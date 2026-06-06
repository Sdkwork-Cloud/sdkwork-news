use sqlx::{Row, SqlitePool};

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsRepositoryBinding {
    pub domain: &'static str,
    pub repository_name: &'static str,
    pub tables: Vec<&'static str>,
    pub requires_transaction: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStorageMigration {
    pub sequence: u32,
    pub name: &'static str,
    pub domain: &'static str,
    pub source_path: &'static str,
    pub sql: &'static str,
    pub checksum: String,
    pub required_tables: Vec<&'static str>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStorageCapabilityManifest {
    pub name: &'static str,
    pub schema_version: &'static str,
    pub tables: Vec<&'static str>,
    pub indexes: Vec<&'static str>,
    pub migrations: Vec<&'static str>,
    pub migration_plan: Vec<NewsStorageMigration>,
    pub repository_bindings: Vec<NewsRepositoryBinding>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsCategory {
    pub id: String,
    pub tenant_id: String,
    pub slug: String,
    pub title: String,
    pub description: Option<String>,
    pub priority: i64,
    pub enabled: bool,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsItem {
    pub id: String,
    pub tenant_id: String,
    pub category_id: String,
    pub slug: String,
    pub title: String,
    pub summary: String,
    pub body_markdown: String,
    pub author_name: Option<String>,
    pub priority: i64,
    pub estimated_read_minutes: i64,
    pub tags: Vec<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsChannel {
    pub id: String,
    pub tenant_id: String,
    pub organization_id: String,
    pub slug: String,
    pub title: String,
    pub channel_type: String,
    pub priority: i64,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsChannelItem {
    pub id: String,
    pub tenant_id: String,
    pub channel_id: String,
    pub item_id: String,
    pub rank: i64,
    pub reason: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsRecommendationEvent {
    pub id: String,
    pub tenant_id: String,
    pub user_id: Option<String>,
    pub item_id: String,
    pub channel_id: Option<String>,
    pub event_type: String,
    pub dwell_ms: Option<i64>,
    pub trace_id: Option<String>,
    pub occurred_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsUserFeedback {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub target_type: String,
    pub target_id: String,
    pub feedback_type: String,
    pub reason: Option<String>,
    pub created_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsFavorite {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub item_id: String,
    pub created_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsReaction {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub item_id: String,
    pub reaction_type: String,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsTrendingMetric {
    pub id: String,
    pub tenant_id: String,
    pub item_id: String,
    pub metric_window: String,
    pub score: i64,
    pub rank: i64,
    pub computed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsUserInterestSignal {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub target_type: String,
    pub target_id: String,
    pub affinity_score: i64,
    pub confidence: i64,
    pub source: String,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredUserInterestSignal {
    pub target_type: String,
    pub target_id: String,
    pub affinity_score: i64,
    pub confidence: i64,
    pub source: String,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsFeedCandidate {
    pub id: String,
    pub tenant_id: String,
    pub user_id: Option<String>,
    pub stream_key: String,
    pub item_id: String,
    pub score: i64,
    pub reason_code: String,
    pub trace_id: Option<String>,
    pub generated_at: String,
    pub expires_at: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredFeedCandidate {
    pub item_id: String,
    pub score: i64,
    pub reason_code: String,
    pub trace_id: Option<String>,
    pub generated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsItemMetricSnapshot {
    pub id: String,
    pub tenant_id: String,
    pub item_id: String,
    pub impression_count: i64,
    pub click_count: i64,
    pub share_count: i64,
    pub comment_count: i64,
    pub favorite_count: i64,
    pub reaction_count: i64,
    pub report_count: i64,
    pub hot_score: i64,
    pub computed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredItemMetricSnapshot {
    pub item_id: String,
    pub impression_count: i64,
    pub click_count: i64,
    pub share_count: i64,
    pub comment_count: i64,
    pub favorite_count: i64,
    pub reaction_count: i64,
    pub report_count: i64,
    pub hot_score: i64,
    pub computed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsSearchSuggestion {
    pub id: String,
    pub tenant_id: String,
    pub normalized_query: String,
    pub display_query: String,
    pub suggestion_type: String,
    pub rank: i64,
    pub score: i64,
    pub locale: Option<String>,
    pub computed_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredSearchSuggestion {
    pub normalized_query: String,
    pub display_query: String,
    pub suggestion_type: String,
    pub rank: i64,
    pub score: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsSearchEvent {
    pub id: String,
    pub tenant_id: String,
    pub user_id: Option<String>,
    pub normalized_query: String,
    pub display_query: String,
    pub result_count: i64,
    pub clicked_item_id: Option<String>,
    pub trace_id: Option<String>,
    pub occurred_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredItem {
    pub id: String,
    pub tenant_id: String,
    pub category_id: String,
    pub slug: String,
    pub title: String,
    pub summary: String,
    pub body_markdown: String,
    pub status: String,
    pub author_name: Option<String>,
    pub featured: bool,
    pub priority: i64,
    pub estimated_read_minutes: i64,
    pub tags: Vec<String>,
    pub published_at: Option<String>,
    pub scheduled_for: Option<String>,
    pub updated_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredTrendingMetric {
    pub item_id: String,
    pub metric_window: String,
    pub score: i64,
    pub rank: i64,
    pub computed_at: String,
}

#[derive(Clone, Debug)]
pub struct SqliteNewsStore {
    pool: SqlitePool,
}

impl SqliteNewsStore {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn migrate(&self) -> Result<(), sqlx::Error> {
        sqlx::raw_sql(news_initial_migration_sql())
            .execute(&self.pool)
            .await?;
        sqlx::raw_sql(news_industry_migration_sql())
            .execute(&self.pool)
            .await?;
        sqlx::raw_sql(news_personalization_migration_sql())
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

    pub async fn attach_item_to_channel(&self, input: NewNewsChannelItem) -> Result<(), sqlx::Error> {
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

    pub async fn record_recommendation_event(&self, input: NewNewsRecommendationEvent) -> Result<(), sqlx::Error> {
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

    pub async fn record_user_feedback(&self, input: NewNewsUserFeedback) -> Result<(), sqlx::Error> {
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

    pub async fn upsert_trending_metric(&self, input: NewNewsTrendingMetric) -> Result<(), sqlx::Error> {
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

    pub async fn upsert_feed_candidate(&self, input: NewNewsFeedCandidate) -> Result<(), sqlx::Error> {
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

    async fn item_from_row(&self, row: sqlx::sqlite::SqliteRow) -> Result<NewsStoredItem, sqlx::Error> {
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

pub fn news_database_tables() -> Vec<&'static str> {
    vec![
        "news_category",
        "news_item",
        "news_item_body",
        "news_tag",
        "news_item_tag",
        "news_publication_event",
        "news_read_state",
        "news_editorial_audit",
        "news_schema_version",
        "news_migration_lock",
        "news_source",
        "news_author",
        "news_item_version",
        "news_media_asset",
        "news_item_media",
        "news_topic",
        "news_item_topic",
        "news_channel",
        "news_channel_item",
        "news_feed_stream",
        "news_feed_cursor",
        "news_recommendation_event",
        "news_user_feedback",
        "news_trending_metric",
        "news_search_projection",
        "news_experiment",
        "news_experiment_assignment",
        "news_comment",
        "news_comment_moderation",
        "news_reaction",
        "news_favorite",
        "news_share_event",
        "news_follow",
        "news_report",
        "news_moderation_case",
        "news_content_risk_signal",
        "news_takedown_event",
        "news_user_interest_signal",
        "news_feed_candidate",
        "news_item_metric_snapshot",
        "news_search_suggestion",
        "news_search_event",
    ]
}

pub fn news_database_indexes() -> Vec<&'static str> {
    vec![
        "idx_news_category_tenant_priority",
        "idx_news_item_tenant_status_published_at",
        "idx_news_item_tenant_slug",
        "idx_news_item_tenant_category_status",
        "idx_news_item_tenant_featured_priority",
        "idx_news_tag_tenant_slug",
        "idx_news_item_tag_tag",
        "idx_news_publication_event_item",
        "idx_news_read_state_user_item",
        "idx_news_editorial_audit_item",
        "idx_news_source_tenant_status",
        "idx_news_author_tenant_source",
        "idx_news_item_version_item",
        "idx_news_media_asset_tenant_kind",
        "idx_news_item_media_item_role",
        "idx_news_topic_tenant_status_priority",
        "idx_news_item_topic_topic",
        "idx_news_channel_tenant_status_priority",
        "idx_news_channel_item_channel_rank",
        "idx_news_feed_stream_tenant_type",
        "idx_news_feed_cursor_user_stream",
        "idx_news_recommendation_event_user_time",
        "idx_news_recommendation_event_item_type",
        "idx_news_user_feedback_user_target",
        "idx_news_trending_metric_window_rank",
        "idx_news_search_projection_status",
        "idx_news_experiment_surface_status",
        "idx_news_experiment_assignment_user",
        "idx_news_comment_item_status_time",
        "idx_news_comment_parent",
        "idx_news_comment_moderation_comment",
        "idx_news_reaction_user_item",
        "idx_news_favorite_user_time",
        "idx_news_share_event_item_time",
        "idx_news_follow_user_target",
        "idx_news_report_target_status",
        "idx_news_moderation_case_status_priority",
        "idx_news_content_risk_signal_target",
        "idx_news_takedown_event_item_time",
        "idx_news_user_interest_signal_user_target",
        "idx_news_feed_candidate_stream_score",
        "idx_news_feed_candidate_user_stream_score",
        "idx_news_item_metric_snapshot_hot",
        "idx_news_search_suggestion_query_rank",
        "idx_news_search_event_query_time",
        "idx_news_search_event_user_time",
    ]
}

pub fn news_migration_names() -> Vec<&'static str> {
    vec![
        "0001_news_foundation.sql",
        "0002_news_industry_foundation.sql",
        "0003_news_personalization_foundation.sql",
    ]
}

pub fn news_initial_migration_sql() -> &'static str {
    include_str!("../migrations/0001_news_foundation.sql")
}

pub fn news_industry_migration_sql() -> &'static str {
    include_str!("../migrations/0002_news_industry_foundation.sql")
}

pub fn news_personalization_migration_sql() -> &'static str {
    include_str!("../migrations/0003_news_personalization_foundation.sql")
}

pub fn news_migration_plan() -> Vec<NewsStorageMigration> {
    vec![
        migration(
            1,
            "0001_news_foundation.sql",
            "news",
            "migrations/0001_news_foundation.sql",
            news_initial_migration_sql(),
            vec![
                "news_category",
                "news_item",
                "news_item_body",
                "news_tag",
                "news_item_tag",
                "news_publication_event",
                "news_read_state",
                "news_editorial_audit",
                "news_schema_version",
                "news_migration_lock",
            ],
        ),
        migration(
            2,
            "0002_news_industry_foundation.sql",
            "news",
            "migrations/0002_news_industry_foundation.sql",
            news_industry_migration_sql(),
            vec![
                "news_source",
                "news_author",
                "news_item_version",
                "news_media_asset",
                "news_item_media",
                "news_topic",
                "news_item_topic",
                "news_channel",
                "news_channel_item",
                "news_feed_stream",
                "news_feed_cursor",
                "news_recommendation_event",
                "news_user_feedback",
                "news_trending_metric",
                "news_search_projection",
                "news_experiment",
                "news_experiment_assignment",
                "news_comment",
                "news_comment_moderation",
                "news_reaction",
                "news_favorite",
                "news_share_event",
                "news_follow",
                "news_report",
                "news_moderation_case",
                "news_content_risk_signal",
                "news_takedown_event",
            ],
        ),
        migration(
            3,
            "0003_news_personalization_foundation.sql",
            "news",
            "migrations/0003_news_personalization_foundation.sql",
            news_personalization_migration_sql(),
            vec![
                "news_user_interest_signal",
                "news_feed_candidate",
                "news_item_metric_snapshot",
                "news_search_suggestion",
                "news_search_event",
            ],
        ),
    ]
}

pub fn news_repository_bindings() -> Vec<NewsRepositoryBinding> {
    vec![
        binding("news", "news.category.repository", vec!["news_category"]),
        binding(
            "news",
            "news.item.repository",
            vec![
                "news_item",
                "news_item_body",
                "news_tag",
                "news_item_tag",
                "news_publication_event",
            ],
        ),
        binding("news", "news.read_state.repository", vec!["news_read_state"]),
        binding(
            "news",
            "news.audit.repository",
            vec!["news_editorial_audit"],
        ),
        binding(
            "news",
            "news.channel.repository",
            vec!["news_channel", "news_channel_item"],
        ),
        binding(
            "news",
            "news.topic.repository",
            vec!["news_topic", "news_item_topic"],
        ),
        binding(
            "news",
            "news.media.repository",
            vec!["news_media_asset", "news_item_media"],
        ),
        binding(
            "news",
            "news.feed.repository",
            vec![
                "news_feed_stream",
                "news_feed_cursor",
                "news_recommendation_event",
                "news_user_feedback",
                "news_trending_metric",
                "news_search_projection",
            ],
        ),
        binding(
            "news",
            "news.engagement.repository",
            vec![
                "news_comment",
                "news_comment_moderation",
                "news_reaction",
                "news_favorite",
                "news_share_event",
                "news_follow",
                "news_report",
            ],
        ),
        binding(
            "news",
            "news.moderation.repository",
            vec![
                "news_moderation_case",
                "news_content_risk_signal",
                "news_takedown_event",
            ],
        ),
        binding(
            "news",
            "news.experiment.repository",
            vec!["news_experiment", "news_experiment_assignment"],
        ),
        binding(
            "news",
            "news.personalization.repository",
            vec!["news_user_interest_signal", "news_feed_candidate"],
        ),
        binding(
            "news",
            "news.metrics.repository",
            vec!["news_item_metric_snapshot"],
        ),
        binding(
            "news",
            "news.search.repository",
            vec![
                "news_search_projection",
                "news_search_suggestion",
                "news_search_event",
            ],
        ),
    ]
}

pub fn news_storage_capability_manifest() -> NewsStorageCapabilityManifest {
    NewsStorageCapabilityManifest {
        name: "sdkwork-news-storage-sqlx",
        schema_version: "news.storage.v3",
        tables: news_database_tables(),
        indexes: news_database_indexes(),
        migrations: news_migration_names(),
        migration_plan: news_migration_plan(),
        repository_bindings: news_repository_bindings(),
    }
}

fn binding(
    domain: &'static str,
    repository_name: &'static str,
    tables: Vec<&'static str>,
) -> NewsRepositoryBinding {
    NewsRepositoryBinding {
        domain,
        repository_name,
        tables,
        requires_transaction: true,
    }
}

fn migration(
    sequence: u32,
    name: &'static str,
    domain: &'static str,
    source_path: &'static str,
    sql: &'static str,
    required_tables: Vec<&'static str>,
) -> NewsStorageMigration {
    NewsStorageMigration {
        sequence,
        name,
        domain,
        source_path,
        sql,
        checksum: migration_checksum(name, sql),
        required_tables,
    }
}

fn migration_checksum(name: &str, sql: &str) -> String {
    let mut hash = 0xcbf29ce484222325u64;
    for byte in name.bytes().chain(sql.bytes()) {
        hash ^= u64::from(byte);
        hash = hash.wrapping_mul(0x100000001b3);
    }
    format!("news-migration-checksum:{hash:016x}")
}

fn normalize_tag_slug(value: &str) -> String {
    value.trim().to_ascii_lowercase().replace(' ', "-")
}

fn optional_string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> Option<String> {
    row.try_get::<Option<String>, _>(column).ok().flatten()
}

fn string_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> String {
    optional_string_cell(row, column).unwrap_or_default()
}

fn integer_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> i64 {
    row.try_get::<i64, _>(column)
        .or_else(|_| row.try_get::<i32, _>(column).map(i64::from))
        .unwrap_or(0)
}

fn bool_cell(row: &sqlx::sqlite::SqliteRow, column: &str) -> bool {
    row.try_get::<bool, _>(column)
        .or_else(|_| row.try_get::<i64, _>(column).map(|value| value != 0))
        .unwrap_or(false)
}
