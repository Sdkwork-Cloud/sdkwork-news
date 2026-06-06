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
    ]
}

pub fn news_migration_names() -> Vec<&'static str> {
    vec!["0001_news_foundation.sql"]
}

pub fn news_initial_migration_sql() -> &'static str {
    include_str!("../migrations/0001_news_foundation.sql")
}

pub fn news_migration_plan() -> Vec<NewsStorageMigration> {
    vec![migration(
        1,
        "0001_news_foundation.sql",
        "news",
        "migrations/0001_news_foundation.sql",
        news_initial_migration_sql(),
        news_database_tables(),
    )]
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
    ]
}

pub fn news_storage_capability_manifest() -> NewsStorageCapabilityManifest {
    NewsStorageCapabilityManifest {
        name: "sdkwork-news-storage-sqlx",
        schema_version: "news.storage.v1",
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
