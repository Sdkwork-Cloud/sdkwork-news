use sqlx::{Row, SqlitePool};

pub struct NewsNewsletterRepository {
    pool: SqlitePool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsNewsletter {
    pub id: String,
    pub tenant_id: String,
    pub title: String,
    pub description: Option<String>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredNewsletter {
    pub id: String,
    pub tenant_id: String,
    pub title: String,
    pub description: Option<String>,
    pub status: String,
    pub scheduled_at: Option<String>,
    pub published_at: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsNewsletterItem {
    pub id: String,
    pub tenant_id: String,
    pub newsletter_id: String,
    pub item_id: String,
    pub rank: i64,
    pub note: Option<String>,
    pub now: String,
}

impl NewsNewsletterRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn create_newsletter(
        &self,
        input: NewNewsNewsletter,
    ) -> Result<NewsStoredNewsletter, sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_newsletter
                (id, tenant_id, title, description, status, scheduled_at, published_at,
                 created_at, updated_at)
            VALUES
                (?, ?, ?, ?, 'draft', NULL, NULL, ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.title)
        .bind(&input.description)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;

        Ok(NewsStoredNewsletter {
            id: input.id,
            tenant_id: input.tenant_id,
            title: input.title,
            description: input.description,
            status: "draft".to_string(),
            scheduled_at: None,
            published_at: None,
        })
    }

    pub async fn create_newsletter_issue(
        &self,
        tenant_id: &str,
        newsletter_id: &str,
        title: &str,
        scheduled_at: Option<&str>,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        let id = format!("nl_issue_{}_{}_{}", tenant_id, newsletter_id, now);
        sqlx::query(
            r#"
            INSERT INTO news_newsletter
                (id, tenant_id, title, description, status, scheduled_at, published_at,
                 created_at, updated_at)
            VALUES
                (?, ?, ?, NULL, 'scheduled', ?, NULL, ?, ?)
            "#,
        )
        .bind(&id)
        .bind(tenant_id)
        .bind(title)
        .bind(scheduled_at)
        .bind(now)
        .bind(now)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn record_newsletter_delivery(
        &self,
        tenant_id: &str,
        newsletter_id: &str,
        delivery_status: &str,
        now: &str,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            UPDATE news_newsletter
            SET status = ?, published_at = CASE WHEN ? = 'delivered' THEN ? ELSE published_at END, updated_at = ?
            WHERE tenant_id = ? AND id = ?
            "#,
        )
        .bind(delivery_status)
        .bind(delivery_status)
        .bind(now)
        .bind(now)
        .bind(tenant_id)
        .bind(newsletter_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn list_newsletters(
        &self,
        tenant_id: &str,
        status: Option<&str>,
        limit: i64,
    ) -> Result<Vec<NewsStoredNewsletter>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, tenant_id, title, description, status, scheduled_at, published_at
            FROM news_newsletter
            WHERE tenant_id = ?
              AND (? IS NULL OR status = ?)
            ORDER BY created_at DESC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(status)
        .bind(status)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredNewsletter {
                id: row.get("id"),
                tenant_id: row.get("tenant_id"),
                title: row.get("title"),
                description: row.get("description"),
                status: row.get("status"),
                scheduled_at: row.get("scheduled_at"),
                published_at: row.get("published_at"),
            })
            .collect())
    }

    pub async fn attach_newsletter_item(
        &self,
        input: NewNewsNewsletterItem,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_newsletter_item
                (id, tenant_id, newsletter_id, item_id, rank, note, created_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (tenant_id, newsletter_id, item_id)
            DO UPDATE SET rank = excluded.rank, note = excluded.note
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.newsletter_id)
        .bind(&input.item_id)
        .bind(input.rank)
        .bind(&input.note)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }
}
