use sqlx::{Row, SqlitePool};

pub struct NewsExternalFeedRepository {
    pool: SqlitePool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsExternalFeed {
    pub id: String,
    pub tenant_id: String,
    pub feed_url: String,
    pub feed_type: String,
    pub poll_interval_seconds: i64,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredExternalFeed {
    pub id: String,
    pub tenant_id: String,
    pub feed_url: String,
    pub feed_type: String,
    pub poll_interval_seconds: i64,
    pub last_polled_at: Option<String>,
    pub status: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsExternalFeedItem {
    pub id: String,
    pub tenant_id: String,
    pub feed_id: String,
    pub external_id: String,
    pub title: Option<String>,
    pub url: Option<String>,
    pub published_at: Option<String>,
    pub content_hash: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredExternalFeedItem {
    pub id: String,
    pub feed_id: String,
    pub external_id: String,
    pub title: Option<String>,
    pub status: String,
    pub imported_at: Option<String>,
}

impl NewsExternalFeedRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn create_feed(
        &self,
        input: NewNewsExternalFeed,
    ) -> Result<NewsStoredExternalFeed, sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_external_feed
                (id, tenant_id, feed_url, feed_type, poll_interval_seconds, last_polled_at,
                 last_success_at, status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, NULL, NULL, 'active', ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.feed_url)
        .bind(&input.feed_type)
        .bind(input.poll_interval_seconds)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;

        Ok(NewsStoredExternalFeed {
            id: input.id,
            tenant_id: input.tenant_id,
            feed_url: input.feed_url,
            feed_type: input.feed_type,
            poll_interval_seconds: input.poll_interval_seconds,
            last_polled_at: None,
            status: "active".to_string(),
        })
    }

    pub async fn claim_due_feed(
        &self,
        tenant_id: &str,
        now: &str,
    ) -> Result<Option<NewsStoredExternalFeed>, sqlx::Error> {
        let row = sqlx::query(
            r#"
            UPDATE news_external_feed
            SET last_polled_at = ?, updated_at = ?
            WHERE id = (
                SELECT id FROM news_external_feed
                WHERE tenant_id = ?
                  AND status = 'active'
                  AND (last_polled_at IS NULL
                       OR datetime(last_polled_at, '+' || poll_interval_seconds || ' seconds') <= ?)
                ORDER BY last_polled_at ASC NULLS FIRST
                LIMIT 1
            )
            RETURNING id, tenant_id, feed_url, feed_type, poll_interval_seconds, last_polled_at, status
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(now)
        .fetch_optional(&self.pool)
        .await?;

        Ok(row.map(|row| NewsStoredExternalFeed {
            id: row.get("id"),
            tenant_id: row.get("tenant_id"),
            feed_url: row.get("feed_url"),
            feed_type: row.get("feed_type"),
            poll_interval_seconds: row.get::<i32, _>("poll_interval_seconds") as i64,
            last_polled_at: row.get("last_polled_at"),
            status: row.get("status"),
        }))
    }

    pub async fn upsert_external_feed_item(
        &self,
        input: NewNewsExternalFeedItem,
    ) -> Result<NewsStoredExternalFeedItem, sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_external_feed_item
                (id, tenant_id, feed_id, external_id, title, url, published_at,
                 content_hash, imported_at, status, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, NULL, 'pending', ?, ?)
            ON CONFLICT (tenant_id, feed_id, external_id)
            DO UPDATE SET title = excluded.title,
                          url = excluded.url,
                          published_at = excluded.published_at,
                          content_hash = excluded.content_hash,
                          updated_at = excluded.updated_at
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.feed_id)
        .bind(&input.external_id)
        .bind(&input.title)
        .bind(&input.url)
        .bind(&input.published_at)
        .bind(&input.content_hash)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;

        Ok(NewsStoredExternalFeedItem {
            id: input.id,
            feed_id: input.feed_id,
            external_id: input.external_id,
            title: input.title,
            status: "pending".to_string(),
            imported_at: None,
        })
    }

    pub async fn list_pending_feed_items(
        &self,
        tenant_id: &str,
        feed_id: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredExternalFeedItem>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, feed_id, external_id, title, status, imported_at
            FROM news_external_feed_item
            WHERE tenant_id = ?
              AND feed_id = ?
              AND status = 'pending'
            ORDER BY created_at ASC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(feed_id)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredExternalFeedItem {
                id: row.get("id"),
                feed_id: row.get("feed_id"),
                external_id: row.get("external_id"),
                title: row.get("title"),
                status: row.get("status"),
                imported_at: row.get("imported_at"),
            })
            .collect())
    }

    pub async fn mark_feed_item_imported(
        &self,
        tenant_id: &str,
        item_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_external_feed_item
            SET status = 'imported', imported_at = ?, updated_at = ?
            WHERE tenant_id = ? AND id = ?
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(item_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn mark_feed_item_failed(
        &self,
        tenant_id: &str,
        item_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_external_feed_item
            SET status = 'failed', updated_at = ?
            WHERE tenant_id = ? AND id = ?
            "#,
        )
        .bind(now)
        .bind(tenant_id)
        .bind(item_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update_feed_success(
        &self,
        tenant_id: &str,
        feed_id: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_external_feed
            SET last_success_at = ?, updated_at = ?
            WHERE tenant_id = ? AND id = ?
            "#,
        )
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(feed_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }
}
