use sqlx::SqlitePool;

use super::helpers::*;
use super::models::*;

#[derive(Clone, Debug)]
pub struct SqliteNewsStore {
    pool: SqlitePool,
}

impl SqliteNewsStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn migrate(&self) -> Result<(), sqlx::Error> {
        sqlx::raw_sql(super::manifest::news_initial_migration_sql())
            .execute(&self.pool)
            .await?;
        sqlx::raw_sql(super::manifest::news_industry_migration_sql())
            .execute(&self.pool)
            .await?;
        sqlx::raw_sql(super::manifest::news_personalization_migration_sql())
            .execute(&self.pool)
            .await?;
        sqlx::raw_sql(super::manifest::news_alert_digest_migration_sql())
            .execute(&self.pool)
            .await?;
        sqlx::raw_sql(super::manifest::news_trust_correction_migration_sql())
            .execute(&self.pool)
            .await?;
        sqlx::raw_sql(super::manifest::news_live_coverage_migration_sql())
            .execute(&self.pool)
            .await?;
        sqlx::raw_sql(super::manifest::news_professional_migration_sql())
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    pub async fn create_category(&self, input: NewNewsCategory) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_category
                (id, tenant_id, slug, title, description, priority, enabled, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.slug)
        .bind(input.title)
        .bind(input.description)
        .bind(input.priority)
        .bind(input.enabled)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_item(&self, input: NewNewsItem) -> Result<(), sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        sqlx::query(
            r#"
            INSERT INTO news_item
                (id, tenant_id, category_id, slug, title, summary, status, author_name, featured,
                 priority, estimated_read_minutes, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, 'draft', ?, FALSE, ?, ?, ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.category_id)
        .bind(&input.slug)
        .bind(&input.title)
        .bind(&input.summary)
        .bind(&input.author_name)
        .bind(input.priority)
        .bind(input.estimated_read_minutes)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO news_item_body (item_id, body_markdown, body_format, content_checksum, updated_at)
            VALUES (?, ?, 'markdown', NULL, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.body_markdown)
        .bind(&input.now)
        .execute(&mut *tx)
        .await?;

        let mut tags = input
            .tags
            .iter()
            .map(|tag| normalize_tag_slug(tag))
            .filter(|tag| !tag.is_empty())
            .collect::<Vec<_>>();
        tags.sort();
        tags.dedup();

        for tag in tags {
            let tag_id = format!("tag_{}_{}", input.tenant_id, tag);
            sqlx::query(
                r#"
                INSERT INTO news_tag (id, tenant_id, slug, title, created_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT (tenant_id, slug) DO UPDATE SET title = excluded.title
                "#,
            )
            .bind(&tag_id)
            .bind(&input.tenant_id)
            .bind(&tag)
            .bind(&tag)
            .bind(&input.now)
            .execute(&mut *tx)
            .await?;

            sqlx::query(
                r#"
                INSERT OR IGNORE INTO news_item_tag (item_id, tag_id)
                VALUES (?, ?)
                "#,
            )
            .bind(&input.id)
            .bind(&tag_id)
            .execute(&mut *tx)
            .await?;
        }

        tx.commit().await?;
        Ok(())
    }

    pub async fn publish_item(
        &self,
        tenant_id: &str,
        item_id: &str,
        actor_user_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        sqlx::query(
            r#"
            UPDATE news_item
            SET status = 'published',
                published_at = COALESCE(published_at, ?),
                updated_at = ?
            WHERE tenant_id = ? AND id = ?
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(item_id)
        .execute(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO news_publication_event
                (id, tenant_id, item_id, event_type, actor_user_id, scheduled_for, occurred_at)
            VALUES
                (?, ?, ?, 'publish', ?, NULL, ?)
            "#,
        )
        .bind(format!("event_{tenant_id}_{item_id}_{now}"))
        .bind(tenant_id)
        .bind(item_id)
        .bind(actor_user_id)
        .bind(now)
        .execute(&mut *tx)
        .await?;

        sqlx::query(
            r#"
            INSERT INTO news_editorial_audit
                (id, tenant_id, item_id, action, actor_user_id, before_json, after_json, created_at)
            VALUES
                (?, ?, ?, 'publish', ?, NULL, NULL, ?)
            "#,
        )
        .bind(format!("audit_{tenant_id}_{item_id}_{now}"))
        .bind(tenant_id)
        .bind(item_id)
        .bind(actor_user_id)
        .bind(now)
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;
        Ok(())
    }

    pub async fn list_published(
        &self,
        tenant_id: &str,
        category_id: Option<&str>,
        q: Option<&str>,
    ) -> Result<Vec<NewsStoredItem>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT i.id, i.tenant_id, i.category_id, i.slug, i.title, i.summary,
                   b.body_markdown, i.status, i.author_name, i.featured,
                   i.priority, i.estimated_read_minutes, i.published_at,
                   i.scheduled_for, i.updated_at
            FROM news_item i
            JOIN news_item_body b ON b.item_id = i.id
            WHERE i.tenant_id = ?
              AND i.status = 'published'
              AND (? IS NULL OR i.category_id = ?)
            ORDER BY i.published_at DESC, i.priority ASC, i.slug ASC
            "#,
        )
        .bind(tenant_id)
        .bind(category_id)
        .bind(category_id)
        .fetch_all(&self.pool)
        .await?;

        let mut items = Vec::with_capacity(rows.len());
        for row in rows {
            let mut item = self.item_from_row(row).await?;
            if let Some(query) = q {
                let normalized = query.trim().to_ascii_lowercase();
                if !normalized.is_empty()
                    && !item.title.to_ascii_lowercase().contains(&normalized)
                    && !item.summary.to_ascii_lowercase().contains(&normalized)
                    && !item.tags.iter().any(|tag| tag.contains(&normalized))
                {
                    continue;
                }
            }
            item.tags.sort();
            items.push(item);
        }
        Ok(items)
    }

    pub async fn retrieve_published_by_slug(
        &self,
        tenant_id: &str,
        slug: &str,
    ) -> Result<Option<NewsStoredItem>, sqlx::Error> {
        let row = sqlx::query(
            r#"
            SELECT i.id, i.tenant_id, i.category_id, i.slug, i.title, i.summary,
                   b.body_markdown, i.status, i.author_name, i.featured,
                   i.priority, i.estimated_read_minutes, i.published_at,
                   i.scheduled_for, i.updated_at
            FROM news_item i
            JOIN news_item_body b ON b.item_id = i.id
            WHERE i.tenant_id = ?
              AND i.slug = ?
              AND i.status = 'published'
            LIMIT 1
            "#,
        )
        .bind(tenant_id)
        .bind(slug)
        .fetch_optional(&self.pool)
        .await?;

        match row {
            Some(row) => self.item_from_row(row).await.map(Some),
            None => Ok(None),
        }
    }

    pub async fn create_channel(&self, input: NewNewsChannel) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_channel
                (id, tenant_id, organization_id, slug, title, channel_type, status, priority,
                 created_at, updated_at, version)
            VALUES
                (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, 0)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.organization_id)
        .bind(input.slug)
        .bind(input.title)
        .bind(input.channel_type)
        .bind(input.priority)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn attach_item_to_channel(
        &self,
        input: NewNewsChannelItem,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_channel_item
                (id, tenant_id, channel_id, item_id, rank, reason, pinned, status, starts_at, ends_at,
                 created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, FALSE, 'active', NULL, NULL, ?, ?)
            ON CONFLICT (tenant_id, channel_id, item_id)
            DO UPDATE SET rank = excluded.rank,
                          reason = excluded.reason,
                          status = 'active',
                          updated_at = excluded.updated_at
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.channel_id)
        .bind(input.item_id)
        .bind(input.rank)
        .bind(input.reason)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_channel_feed(
        &self,
        tenant_id: &str,
        channel_id: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredItem>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT i.id, i.tenant_id, i.category_id, i.slug, i.title, i.summary,
                   b.body_markdown, i.status, i.author_name, i.featured,
                   i.priority, i.estimated_read_minutes, i.published_at,
                   i.scheduled_for, i.updated_at
            FROM news_channel_item ci
            JOIN news_item i ON i.id = ci.item_id
            JOIN news_item_body b ON b.item_id = i.id
            WHERE ci.tenant_id = ?
              AND ci.channel_id = ?
              AND ci.status = 'active'
              AND i.status = 'published'
            ORDER BY ci.rank ASC, i.published_at DESC, i.slug ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(channel_id)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        let mut items = Vec::with_capacity(rows.len());
        for row in rows {
            let mut item = self.item_from_row(row).await?;
            item.tags.sort();
            items.push(item);
        }
        Ok(items)
    }

    pub async fn record_recommendation_event(
        &self,
        input: NewNewsRecommendationEvent,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_recommendation_event
                (id, tenant_id, user_id, item_id, channel_id, event_type, dwell_ms, trace_id,
                 occurred_at, idempotency_key, payload_hash)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.item_id)
        .bind(input.channel_id)
        .bind(input.event_type)
        .bind(input.dwell_ms)
        .bind(input.trace_id)
        .bind(input.occurred_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn record_user_feedback(
        &self,
        input: NewNewsUserFeedback,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_user_feedback
                (id, tenant_id, user_id, target_type, target_id, feedback_type, reason, created_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.target_type)
        .bind(input.target_id)
        .bind(input.feedback_type)
        .bind(input.reason)
        .bind(input.created_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn mark_favorite(&self, input: NewNewsFavorite) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_favorite
                (id, tenant_id, user_id, item_id, status, created_at, deleted_at)
            VALUES
                (?, ?, ?, ?, 'active', ?, NULL)
            ON CONFLICT (tenant_id, user_id, item_id)
            DO UPDATE SET status = 'active',
                          deleted_at = NULL
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.item_id)
        .bind(input.created_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn upsert_reaction(&self, input: NewNewsReaction) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_reaction
                (id, tenant_id, user_id, item_id, reaction_type, status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, 'active', ?, ?)
            ON CONFLICT (tenant_id, user_id, item_id)
            DO UPDATE SET reaction_type = excluded.reaction_type,
                          status = 'active',
                          updated_at = excluded.updated_at
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.item_id)
        .bind(input.reaction_type)
        .bind(&input.updated_at)
        .bind(&input.updated_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn upsert_trending_metric(
        &self,
        input: NewNewsTrendingMetric,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_trending_metric
                (id, tenant_id, item_id, metric_window, score, rank, computed_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, item_id, metric_window)
            DO UPDATE SET score = excluded.score,
                          rank = excluded.rank,
                          computed_at = excluded.computed_at
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.item_id)
        .bind(input.metric_window)
        .bind(input.score)
        .bind(input.rank)
        .bind(input.computed_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_trending(
        &self,
        tenant_id: &str,
        metric_window: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredTrendingMetric>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT item_id, metric_window, score, rank, computed_at
            FROM news_trending_metric
            WHERE tenant_id = ?
              AND metric_window = ?
            ORDER BY rank ASC, score DESC, computed_at DESC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(metric_window)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredTrendingMetric {
                item_id: string_cell(row, "item_id"),
                metric_window: string_cell(row, "metric_window"),
                score: integer_cell(row, "score"),
                rank: integer_cell(row, "rank"),
                computed_at: string_cell(row, "computed_at"),
            })
            .collect())
    }

    pub async fn upsert_user_interest_signal(
        &self,
        input: NewNewsUserInterestSignal,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_user_interest_signal
                (id, tenant_id, user_id, target_type, target_id, affinity_score, confidence,
                 source, status, created_at, updated_at, version, deleted_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, 0, NULL)
            ON CONFLICT (tenant_id, user_id, target_type, target_id)
            DO UPDATE SET affinity_score = excluded.affinity_score,
                          confidence = excluded.confidence,
                          source = excluded.source,
                          status = 'active',
                          updated_at = excluded.updated_at,
                          version = news_user_interest_signal.version + 1,
                          deleted_at = NULL
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.target_type)
        .bind(input.target_id)
        .bind(input.affinity_score)
        .bind(input.confidence)
        .bind(input.source)
        .bind(&input.updated_at)
        .bind(&input.updated_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_user_interest_signals(
        &self,
        tenant_id: &str,
        user_id: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredUserInterestSignal>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT target_type, target_id, affinity_score, confidence, source, updated_at
            FROM news_user_interest_signal
            WHERE tenant_id = ?
              AND user_id = ?
              AND status = 'active'
            ORDER BY affinity_score DESC, confidence DESC, updated_at DESC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredUserInterestSignal {
                target_type: string_cell(row, "target_type"),
                target_id: string_cell(row, "target_id"),
                affinity_score: integer_cell(row, "affinity_score"),
                confidence: integer_cell(row, "confidence"),
                source: string_cell(row, "source"),
                updated_at: string_cell(row, "updated_at"),
            })
            .collect())
    }

    pub async fn upsert_feed_candidate(
        &self,
        input: NewNewsFeedCandidate,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_feed_candidate
                (id, tenant_id, user_id, stream_key, item_id, score, reason_code, trace_id,
                 status, generated_at, expires_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
            ON CONFLICT (tenant_id, user_id, stream_key, item_id)
            DO UPDATE SET score = excluded.score,
                          reason_code = excluded.reason_code,
                          trace_id = excluded.trace_id,
                          status = 'active',
                          generated_at = excluded.generated_at,
                          expires_at = excluded.expires_at,
                          updated_at = excluded.updated_at
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.stream_key)
        .bind(input.item_id)
        .bind(input.score)
        .bind(input.reason_code)
        .bind(input.trace_id)
        .bind(&input.generated_at)
        .bind(input.expires_at)
        .bind(&input.generated_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_feed_candidates(
        &self,
        tenant_id: &str,
        user_id: Option<&str>,
        stream_key: &str,
        now: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredFeedCandidate>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT item_id, score, reason_code, trace_id, generated_at
            FROM news_feed_candidate
            WHERE tenant_id = ?
              AND (? IS NULL OR user_id = ?)
              AND stream_key = ?
              AND status = 'active'
              AND (expires_at IS NULL OR expires_at > ?)
            ORDER BY score DESC, generated_at DESC, item_id ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .bind(user_id)
        .bind(stream_key)
        .bind(now)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredFeedCandidate {
                item_id: string_cell(row, "item_id"),
                score: integer_cell(row, "score"),
                reason_code: string_cell(row, "reason_code"),
                trace_id: optional_string_cell(row, "trace_id"),
                generated_at: string_cell(row, "generated_at"),
            })
            .collect())
    }

    pub async fn upsert_item_metric_snapshot(
        &self,
        input: NewNewsItemMetricSnapshot,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_item_metric_snapshot
                (id, tenant_id, item_id, impression_count, click_count, share_count, comment_count,
                 favorite_count, reaction_count, report_count, hot_score, computed_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, item_id)
            DO UPDATE SET impression_count = excluded.impression_count,
                          click_count = excluded.click_count,
                          share_count = excluded.share_count,
                          comment_count = excluded.comment_count,
                          favorite_count = excluded.favorite_count,
                          reaction_count = excluded.reaction_count,
                          report_count = excluded.report_count,
                          hot_score = excluded.hot_score,
                          computed_at = excluded.computed_at,
                          updated_at = excluded.updated_at
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.item_id)
        .bind(input.impression_count)
        .bind(input.click_count)
        .bind(input.share_count)
        .bind(input.comment_count)
        .bind(input.favorite_count)
        .bind(input.reaction_count)
        .bind(input.report_count)
        .bind(input.hot_score)
        .bind(&input.computed_at)
        .bind(&input.computed_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn retrieve_item_metric_snapshot(
        &self,
        tenant_id: &str,
        item_id: &str,
    ) -> Result<Option<NewsStoredItemMetricSnapshot>, sqlx::Error> {
        let row = sqlx::query(
            r#"
            SELECT item_id, impression_count, click_count, share_count, comment_count,
                   favorite_count, reaction_count, report_count, hot_score, computed_at
            FROM news_item_metric_snapshot
            WHERE tenant_id = ?
              AND item_id = ?
            LIMIT 1
            "#,
        )
        .bind(tenant_id)
        .bind(item_id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(row.as_ref().map(|row| NewsStoredItemMetricSnapshot {
            item_id: string_cell(row, "item_id"),
            impression_count: integer_cell(row, "impression_count"),
            click_count: integer_cell(row, "click_count"),
            share_count: integer_cell(row, "share_count"),
            comment_count: integer_cell(row, "comment_count"),
            favorite_count: integer_cell(row, "favorite_count"),
            reaction_count: integer_cell(row, "reaction_count"),
            report_count: integer_cell(row, "report_count"),
            hot_score: integer_cell(row, "hot_score"),
            computed_at: string_cell(row, "computed_at"),
        }))
    }

    pub async fn upsert_search_suggestion(
        &self,
        input: NewNewsSearchSuggestion,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_search_suggestion
                (id, tenant_id, normalized_query, display_query, suggestion_type, rank, score,
                 locale, status, computed_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
            ON CONFLICT (tenant_id, normalized_query, suggestion_type, locale)
            DO UPDATE SET display_query = excluded.display_query,
                          rank = excluded.rank,
                          score = excluded.score,
                          status = 'active',
                          computed_at = excluded.computed_at,
                          updated_at = excluded.updated_at
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.normalized_query)
        .bind(input.display_query)
        .bind(input.suggestion_type)
        .bind(input.rank)
        .bind(input.score)
        .bind(input.locale)
        .bind(&input.computed_at)
        .bind(&input.computed_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_search_suggestions(
        &self,
        tenant_id: &str,
        query_prefix: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredSearchSuggestion>, sqlx::Error> {
        let prefix = format!("{}%", query_prefix.trim().to_ascii_lowercase());
        let rows = sqlx::query(
            r#"
            SELECT normalized_query, display_query, suggestion_type, rank, score
            FROM news_search_suggestion
            WHERE tenant_id = ?
              AND status = 'active'
              AND normalized_query LIKE ?
            ORDER BY rank ASC, score DESC, normalized_query ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(prefix)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredSearchSuggestion {
                normalized_query: string_cell(row, "normalized_query"),
                display_query: string_cell(row, "display_query"),
                suggestion_type: string_cell(row, "suggestion_type"),
                rank: integer_cell(row, "rank"),
                score: integer_cell(row, "score"),
            })
            .collect())
    }

    pub async fn record_search_event(&self, input: NewNewsSearchEvent) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_search_event
                (id, tenant_id, user_id, normalized_query, display_query, result_count,
                 clicked_item_id, trace_id, occurred_at, idempotency_key, payload_hash)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.normalized_query)
        .bind(input.display_query)
        .bind(input.result_count)
        .bind(input.clicked_item_id)
        .bind(input.trace_id)
        .bind(input.occurred_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn upsert_notification_subscription(
        &self,
        input: NewNewsNotificationSubscription,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_notification_subscription
                (id, tenant_id, user_id, target_type, target_id, channel, frequency, status,
                 quiet_start, quiet_end, locale, created_at, updated_at, version, deleted_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, 0, NULL)
            ON CONFLICT (tenant_id, user_id, target_type, target_id, channel)
            DO UPDATE SET frequency = excluded.frequency,
                          status = 'active',
                          quiet_start = excluded.quiet_start,
                          quiet_end = excluded.quiet_end,
                          locale = excluded.locale,
                          updated_at = excluded.updated_at,
                          version = news_notification_subscription.version + 1,
                          deleted_at = NULL
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.user_id)
        .bind(input.target_type)
        .bind(input.target_id)
        .bind(input.channel)
        .bind(input.frequency)
        .bind(input.quiet_start)
        .bind(input.quiet_end)
        .bind(input.locale)
        .bind(&input.updated_at)
        .bind(&input.updated_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_notification_subscriptions(
        &self,
        tenant_id: &str,
        user_id: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredNotificationSubscription>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, target_type, target_id, channel, frequency, status, updated_at
            FROM news_notification_subscription
            WHERE tenant_id = ?
              AND user_id = ?
              AND status = 'active'
            ORDER BY updated_at DESC, target_type ASC, target_id ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredNotificationSubscription {
                id: string_cell(row, "id"),
                target_type: string_cell(row, "target_type"),
                target_id: string_cell(row, "target_id"),
                channel: string_cell(row, "channel"),
                frequency: string_cell(row, "frequency"),
                status: string_cell(row, "status"),
                updated_at: string_cell(row, "updated_at"),
            })
            .collect())
    }

    pub async fn disable_notification_subscription(
        &self,
        tenant_id: &str,
        subscription_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_notification_subscription
            SET status = 'disabled',
                updated_at = ?,
                deleted_at = ?,
                version = version + 1
            WHERE tenant_id = ?
              AND id = ?
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(subscription_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn create_breaking_alert(
        &self,
        input: NewNewsBreakingAlert,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_breaking_alert
                (id, tenant_id, organization_id, item_id, title, summary, severity, audience_type,
                 target_type, target_id, priority, status, scheduled_at, published_at, expires_at,
                 created_at, updated_at, version, cancelled_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, NULL, ?, ?, ?, 0, NULL)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.organization_id)
        .bind(input.item_id)
        .bind(input.title)
        .bind(input.summary)
        .bind(input.severity)
        .bind(input.audience_type)
        .bind(input.target_type)
        .bind(input.target_id)
        .bind(input.priority)
        .bind(input.scheduled_at)
        .bind(input.expires_at)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn publish_breaking_alert(
        &self,
        tenant_id: &str,
        alert_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_breaking_alert
            SET status = 'published',
                published_at = COALESCE(published_at, ?),
                updated_at = ?,
                version = version + 1
            WHERE tenant_id = ?
              AND id = ?
              AND status != 'cancelled'
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(alert_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_active_breaking_alerts(
        &self,
        tenant_id: &str,
        now: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredBreakingAlert>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, item_id, title, summary, severity, audience_type, priority, published_at, expires_at
            FROM news_breaking_alert
            WHERE tenant_id = ?
              AND status = 'published'
              AND (published_at IS NULL OR published_at <= ?)
              AND (expires_at IS NULL OR expires_at > ?)
            ORDER BY priority ASC, published_at DESC, id ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(now)
        .bind(now)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredBreakingAlert {
                id: string_cell(row, "id"),
                item_id: optional_string_cell(row, "item_id"),
                title: string_cell(row, "title"),
                summary: string_cell(row, "summary"),
                severity: string_cell(row, "severity"),
                audience_type: string_cell(row, "audience_type"),
                priority: integer_cell(row, "priority"),
                published_at: optional_string_cell(row, "published_at"),
                expires_at: optional_string_cell(row, "expires_at"),
            })
            .collect())
    }

    pub async fn create_digest_issue(&self, input: NewNewsDigestIssue) -> Result<(), sqlx::Error> {
        let status = if input.published_at.is_some() {
            "published"
        } else {
            "draft"
        };
        sqlx::query(
            r#"
            INSERT INTO news_digest_issue
                (id, tenant_id, digest_key, title, summary, digest_type, audience_type, locale,
                 status, scheduled_at, published_at, created_at, updated_at, version, archived_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, 0, NULL)
            ON CONFLICT (tenant_id, digest_key)
            DO UPDATE SET title = excluded.title,
                          summary = excluded.summary,
                          digest_type = excluded.digest_type,
                          audience_type = excluded.audience_type,
                          locale = excluded.locale,
                          status = excluded.status,
                          published_at = excluded.published_at,
                          updated_at = excluded.updated_at,
                          version = news_digest_issue.version + 1
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.digest_key)
        .bind(input.title)
        .bind(input.summary)
        .bind(input.digest_type)
        .bind(input.audience_type)
        .bind(input.locale)
        .bind(status)
        .bind(input.published_at)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn publish_digest_issue(
        &self,
        tenant_id: &str,
        digest_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_digest_issue
            SET status = 'published',
                published_at = COALESCE(published_at, ?),
                updated_at = ?,
                version = version + 1
            WHERE tenant_id = ?
              AND id = ?
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(digest_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn attach_digest_item(&self, input: NewNewsDigestItem) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_digest_item
                (id, tenant_id, digest_id, item_id, rank, section, reason, created_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, digest_id, item_id)
            DO UPDATE SET rank = excluded.rank,
                          section = excluded.section,
                          reason = excluded.reason
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.digest_id)
        .bind(input.item_id)
        .bind(input.rank)
        .bind(input.section)
        .bind(input.reason)
        .bind(input.created_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_published_digest_issues(
        &self,
        tenant_id: &str,
        now: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredDigestIssue>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, digest_key, title, summary, digest_type, audience_type, published_at
            FROM news_digest_issue
            WHERE tenant_id = ?
              AND status = 'published'
              AND (published_at IS NULL OR published_at <= ?)
            ORDER BY published_at DESC, digest_key DESC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(now)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredDigestIssue {
                id: string_cell(row, "id"),
                digest_key: string_cell(row, "digest_key"),
                title: string_cell(row, "title"),
                summary: optional_string_cell(row, "summary"),
                digest_type: string_cell(row, "digest_type"),
                audience_type: string_cell(row, "audience_type"),
                published_at: optional_string_cell(row, "published_at"),
            })
            .collect())
    }

    pub async fn list_digest_items(
        &self,
        tenant_id: &str,
        digest_id: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredDigestItem>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT item_id, rank, section, reason
            FROM news_digest_item
            WHERE tenant_id = ?
              AND digest_id = ?
            ORDER BY rank ASC, item_id ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(digest_id)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredDigestItem {
                item_id: string_cell(row, "item_id"),
                rank: integer_cell(row, "rank"),
                section: optional_string_cell(row, "section"),
                reason: optional_string_cell(row, "reason"),
            })
            .collect())
    }

    pub async fn upsert_source_trust_profile(
        &self,
        input: NewNewsSourceTrustProfile,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_source_trust_profile
                (id, tenant_id, source_id, trust_score, trust_tier, credibility_status,
                 fact_check_rating, correction_count, reviewer_user_id, notes, reviewed_at,
                 updated_at, version)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            ON CONFLICT (tenant_id, source_id)
            DO UPDATE SET trust_score = excluded.trust_score,
                          trust_tier = excluded.trust_tier,
                          credibility_status = excluded.credibility_status,
                          fact_check_rating = excluded.fact_check_rating,
                          correction_count = excluded.correction_count,
                          reviewer_user_id = excluded.reviewer_user_id,
                          notes = excluded.notes,
                          reviewed_at = excluded.reviewed_at,
                          updated_at = excluded.updated_at,
                          version = news_source_trust_profile.version + 1
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.source_id)
        .bind(input.trust_score)
        .bind(input.trust_tier)
        .bind(input.credibility_status)
        .bind(input.fact_check_rating)
        .bind(input.correction_count)
        .bind(input.reviewer_user_id)
        .bind(input.notes)
        .bind(&input.reviewed_at)
        .bind(&input.reviewed_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn retrieve_source_trust_profile(
        &self,
        tenant_id: &str,
        source_id: &str,
    ) -> Result<Option<NewsStoredSourceTrustProfile>, sqlx::Error> {
        let row = sqlx::query(
            r#"
            SELECT source_id, trust_score, trust_tier, credibility_status, fact_check_rating,
                   correction_count, reviewed_at
            FROM news_source_trust_profile
            WHERE tenant_id = ?
              AND source_id = ?
            LIMIT 1
            "#,
        )
        .bind(tenant_id)
        .bind(source_id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(row.map(|row| NewsStoredSourceTrustProfile {
            source_id: string_cell(&row, "source_id"),
            trust_score: integer_cell(&row, "trust_score"),
            trust_tier: string_cell(&row, "trust_tier"),
            credibility_status: string_cell(&row, "credibility_status"),
            fact_check_rating: optional_string_cell(&row, "fact_check_rating"),
            correction_count: integer_cell(&row, "correction_count"),
            reviewed_at: string_cell(&row, "reviewed_at"),
        }))
    }

    pub async fn create_fact_check(&self, input: NewNewsFactCheck) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_fact_check
                (id, tenant_id, item_id, claim, verdict, summary, evidence_url, reviewer_user_id,
                 status, published_at, archived_at, created_at, updated_at, version)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, 'draft', NULL, NULL, ?, ?, 0)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.item_id)
        .bind(input.claim)
        .bind(input.verdict)
        .bind(input.summary)
        .bind(input.evidence_url)
        .bind(input.reviewer_user_id)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn publish_fact_check(
        &self,
        tenant_id: &str,
        fact_check_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_fact_check
            SET status = 'published',
                published_at = COALESCE(published_at, ?),
                updated_at = ?,
                version = version + 1
            WHERE tenant_id = ?
              AND id = ?
              AND status != 'archived'
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(fact_check_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_published_fact_checks(
        &self,
        tenant_id: &str,
        item_id: Option<&str>,
        limit: i64,
    ) -> Result<Vec<NewsStoredFactCheck>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, item_id, claim, verdict, summary, evidence_url, published_at
            FROM news_fact_check
            WHERE tenant_id = ?
              AND status = 'published'
              AND (? IS NULL OR item_id = ?)
            ORDER BY published_at DESC, id ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(item_id)
        .bind(item_id)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredFactCheck {
                id: string_cell(row, "id"),
                item_id: optional_string_cell(row, "item_id"),
                claim: string_cell(row, "claim"),
                verdict: string_cell(row, "verdict"),
                summary: string_cell(row, "summary"),
                evidence_url: optional_string_cell(row, "evidence_url"),
                published_at: optional_string_cell(row, "published_at"),
            })
            .collect())
    }

    pub async fn create_correction_notice(
        &self,
        input: NewNewsCorrectionNotice,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_correction_notice
                (id, tenant_id, item_id, correction_type, title, body, actor_user_id, status,
                 published_at, archived_at, created_at, updated_at, version)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, 'draft', NULL, NULL, ?, ?, 0)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.item_id)
        .bind(input.correction_type)
        .bind(input.title)
        .bind(input.body)
        .bind(input.actor_user_id)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn publish_correction_notice(
        &self,
        tenant_id: &str,
        correction_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_correction_notice
            SET status = 'published',
                published_at = COALESCE(published_at, ?),
                updated_at = ?,
                version = version + 1
            WHERE tenant_id = ?
              AND id = ?
              AND status != 'archived'
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(correction_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_published_correction_notices(
        &self,
        tenant_id: &str,
        item_id: Option<&str>,
        limit: i64,
    ) -> Result<Vec<NewsStoredCorrectionNotice>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, item_id, correction_type, title, body, published_at
            FROM news_correction_notice
            WHERE tenant_id = ?
              AND status = 'published'
              AND (? IS NULL OR item_id = ?)
            ORDER BY published_at DESC, id ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(item_id)
        .bind(item_id)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredCorrectionNotice {
                id: string_cell(row, "id"),
                item_id: string_cell(row, "item_id"),
                correction_type: string_cell(row, "correction_type"),
                title: string_cell(row, "title"),
                body: string_cell(row, "body"),
                published_at: optional_string_cell(row, "published_at"),
            })
            .collect())
    }

    pub async fn upsert_item_trust_snapshot(
        &self,
        input: NewNewsItemTrustSnapshot,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_item_trust_snapshot
                (id, tenant_id, item_id, trust_score, source_trust_score, fact_check_verdict,
                 correction_count, risk_level, computed_at, updated_at, version)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            ON CONFLICT (tenant_id, item_id)
            DO UPDATE SET trust_score = excluded.trust_score,
                          source_trust_score = excluded.source_trust_score,
                          fact_check_verdict = excluded.fact_check_verdict,
                          correction_count = excluded.correction_count,
                          risk_level = excluded.risk_level,
                          computed_at = excluded.computed_at,
                          updated_at = excluded.updated_at,
                          version = news_item_trust_snapshot.version + 1
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.item_id)
        .bind(input.trust_score)
        .bind(input.source_trust_score)
        .bind(input.fact_check_verdict)
        .bind(input.correction_count)
        .bind(input.risk_level)
        .bind(&input.computed_at)
        .bind(&input.computed_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn retrieve_item_trust_snapshot(
        &self,
        tenant_id: &str,
        item_id: &str,
    ) -> Result<Option<NewsStoredItemTrustSnapshot>, sqlx::Error> {
        let row = sqlx::query(
            r#"
            SELECT item_id, trust_score, source_trust_score, fact_check_verdict,
                   correction_count, risk_level, computed_at
            FROM news_item_trust_snapshot
            WHERE tenant_id = ?
              AND item_id = ?
            LIMIT 1
            "#,
        )
        .bind(tenant_id)
        .bind(item_id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(row.map(|row| NewsStoredItemTrustSnapshot {
            item_id: string_cell(&row, "item_id"),
            trust_score: integer_cell(&row, "trust_score"),
            source_trust_score: optional_integer_cell(&row, "source_trust_score"),
            fact_check_verdict: optional_string_cell(&row, "fact_check_verdict"),
            correction_count: integer_cell(&row, "correction_count"),
            risk_level: string_cell(&row, "risk_level"),
            computed_at: string_cell(&row, "computed_at"),
        }))
    }

    pub async fn create_live_event(&self, input: NewNewsLiveEvent) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_live_event
                (id, tenant_id, organization_id, slug, title, summary, event_type, priority,
                 status, region, locale, started_at, published_at, closed_at, created_at,
                 updated_at, version)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, NULL, NULL, ?, ?, 0)
            ON CONFLICT (tenant_id, slug)
            DO UPDATE SET organization_id = excluded.organization_id,
                          title = excluded.title,
                          summary = excluded.summary,
                          event_type = excluded.event_type,
                          priority = excluded.priority,
                          region = excluded.region,
                          locale = excluded.locale,
                          started_at = excluded.started_at,
                          updated_at = excluded.updated_at,
                          version = news_live_event.version + 1
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.organization_id)
        .bind(input.slug)
        .bind(input.title)
        .bind(input.summary)
        .bind(input.event_type)
        .bind(input.priority)
        .bind(input.region)
        .bind(input.locale)
        .bind(input.started_at)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn publish_live_event(
        &self,
        tenant_id: &str,
        live_event_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_live_event
            SET status = 'published',
                published_at = COALESCE(published_at, ?),
                updated_at = ?,
                version = version + 1
            WHERE tenant_id = ?
              AND id = ?
              AND status != 'closed'
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(live_event_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn close_live_event(
        &self,
        tenant_id: &str,
        live_event_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_live_event
            SET status = 'closed',
                closed_at = COALESCE(closed_at, ?),
                updated_at = ?,
                version = version + 1
            WHERE tenant_id = ?
              AND id = ?
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(live_event_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_published_live_events(
        &self,
        tenant_id: &str,
        now: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredLiveEvent>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, slug, title, summary, event_type, priority, status, region, locale,
                   started_at, published_at, closed_at, updated_at
            FROM news_live_event
            WHERE tenant_id = ?
              AND status = 'published'
              AND (published_at IS NULL OR published_at <= ?)
            ORDER BY priority ASC, published_at DESC, started_at DESC, id ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(now)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows.iter().map(live_event_from_row).collect())
    }

    pub async fn retrieve_published_live_event(
        &self,
        tenant_id: &str,
        live_event_id: &str,
    ) -> Result<Option<NewsStoredLiveEvent>, sqlx::Error> {
        let row = sqlx::query(
            r#"
            SELECT id, slug, title, summary, event_type, priority, status, region, locale,
                   started_at, published_at, closed_at, updated_at
            FROM news_live_event
            WHERE tenant_id = ?
              AND id = ?
              AND status = 'published'
            LIMIT 1
            "#,
        )
        .bind(tenant_id)
        .bind(live_event_id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(row.as_ref().map(live_event_from_row))
    }

    pub async fn create_live_update(&self, input: NewNewsLiveUpdate) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_live_update
                (id, tenant_id, live_event_id, title, body, update_type, importance, source_id,
                 author_id, item_id, status, published_at, created_at, updated_at, version)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', NULL, ?, ?, 0)
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.live_event_id)
        .bind(input.title)
        .bind(input.body)
        .bind(input.update_type)
        .bind(input.importance)
        .bind(input.source_id)
        .bind(input.author_id)
        .bind(input.item_id)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn publish_live_update(
        &self,
        tenant_id: &str,
        live_update_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_live_update
            SET status = 'published',
                published_at = COALESCE(published_at, ?),
                updated_at = ?,
                version = version + 1
            WHERE tenant_id = ?
              AND id = ?
              AND status != 'archived'
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(live_update_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_published_live_updates(
        &self,
        tenant_id: &str,
        live_event_id: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredLiveUpdate>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, live_event_id, title, body, update_type, importance, source_id,
                   author_id, item_id, published_at
            FROM news_live_update
            WHERE tenant_id = ?
              AND live_event_id = ?
              AND status = 'published'
            ORDER BY published_at DESC, importance DESC, id ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(live_event_id)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows.iter().map(live_update_from_row).collect())
    }

    pub async fn attach_item_to_live_event(
        &self,
        input: NewNewsLiveEventItem,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_live_event_item
                (id, tenant_id, live_event_id, item_id, relation_type, rank, note, created_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, live_event_id, item_id, relation_type)
            DO UPDATE SET rank = excluded.rank,
                          note = excluded.note
            "#,
        )
        .bind(input.id)
        .bind(input.tenant_id)
        .bind(input.live_event_id)
        .bind(input.item_id)
        .bind(input.relation_type)
        .bind(input.rank)
        .bind(input.note)
        .bind(input.created_at)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_live_event_items(
        &self,
        tenant_id: &str,
        live_event_id: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredLiveEventItem>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT item_id, relation_type, rank, note
            FROM news_live_event_item
            WHERE tenant_id = ?
              AND live_event_id = ?
            ORDER BY rank ASC, item_id ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(live_event_id)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredLiveEventItem {
                item_id: string_cell(row, "item_id"),
                relation_type: string_cell(row, "relation_type"),
                rank: integer_cell(row, "rank"),
                note: optional_string_cell(row, "note"),
            })
            .collect())
    }

    async fn item_from_row(
        &self,
        row: sqlx::sqlite::SqliteRow,
    ) -> Result<NewsStoredItem, sqlx::Error> {
        let item_id = string_cell(&row, "id");
        let tags = self.item_tags(&item_id).await?;
        Ok(NewsStoredItem {
            id: item_id,
            tenant_id: string_cell(&row, "tenant_id"),
            category_id: string_cell(&row, "category_id"),
            slug: string_cell(&row, "slug"),
            title: string_cell(&row, "title"),
            summary: string_cell(&row, "summary"),
            body_markdown: string_cell(&row, "body_markdown"),
            status: string_cell(&row, "status"),
            author_name: optional_string_cell(&row, "author_name"),
            featured: bool_cell(&row, "featured"),
            priority: integer_cell(&row, "priority"),
            estimated_read_minutes: integer_cell(&row, "estimated_read_minutes"),
            tags,
            published_at: optional_string_cell(&row, "published_at"),
            scheduled_for: optional_string_cell(&row, "scheduled_for"),
            updated_at: string_cell(&row, "updated_at"),
        })
    }

    async fn item_tags(&self, item_id: &str) -> Result<Vec<String>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT t.slug
            FROM news_item_tag it
            JOIN news_tag t ON t.id = it.tag_id
            WHERE it.item_id = ?
            ORDER BY t.slug ASC
            "#,
        )
        .bind(item_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(rows.iter().map(|row| string_cell(row, "slug")).collect())
    }
}
