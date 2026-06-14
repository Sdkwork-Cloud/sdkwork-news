use sqlx::{Row, SqlitePool};

pub struct NewsPaywallRepository {
    pool: SqlitePool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsPaywallPolicy {
    pub id: String,
    pub tenant_id: String,
    pub policy_name: String,
    pub policy_type: String,
    pub rules_json: String,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsStoredPaywallPolicy {
    pub id: String,
    pub policy_name: String,
    pub policy_type: String,
    pub rules_json: String,
    pub enabled: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewNewsMeteredAccessEvent {
    pub id: String,
    pub tenant_id: String,
    pub user_id: String,
    pub item_id: String,
    pub event_type: String,
    pub occurred_at: String,
    pub now: String,
}

impl NewsPaywallRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }

    pub async fn create_paywall_policy(
        &self,
        input: NewNewsPaywallPolicy,
    ) -> Result<NewsStoredPaywallPolicy, sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_paywall_policy
                (id, tenant_id, policy_name, policy_type, rules_json, enabled, created_at, updated_at)
            VALUES
                (?, ?, ?, ?, ?, TRUE, ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.policy_name)
        .bind(&input.policy_type)
        .bind(&input.rules_json)
        .bind(&input.now)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;

        Ok(NewsStoredPaywallPolicy {
            id: input.id,
            policy_name: input.policy_name,
            policy_type: input.policy_type,
            rules_json: input.rules_json,
            enabled: true,
        })
    }

    pub async fn find_matching_rule(
        &self,
        tenant_id: &str,
        target_type: &str,
    ) -> Result<Option<NewsStoredPaywallPolicy>, sqlx::Error> {
        let row = sqlx::query(
            r#"
            SELECT id, policy_name, policy_type, rules_json, enabled
            FROM news_paywall_policy
            WHERE tenant_id = ?
              AND policy_type = ?
              AND enabled = TRUE
            ORDER BY created_at DESC
            LIMIT 1
            "#,
        )
        .bind(tenant_id)
        .bind(target_type)
        .fetch_optional(&self.pool)
        .await?;

        Ok(row.map(|row| NewsStoredPaywallPolicy {
            id: row.get("id"),
            policy_name: row.get("policy_name"),
            policy_type: row.get("policy_type"),
            rules_json: row.get("rules_json"),
            enabled: row.get("enabled"),
        }))
    }

    pub async fn record_metered_access_event(
        &self,
        input: NewNewsMeteredAccessEvent,
    ) -> Result<(), sqlx::Error> {
        sqlx::query(
            r#"
            INSERT INTO news_metered_access_event
                (id, tenant_id, user_id, item_id, event_type, occurred_at, created_at)
            VALUES
                (?, ?, ?, ?, ?, ?, ?)
            "#,
        )
        .bind(&input.id)
        .bind(&input.tenant_id)
        .bind(&input.user_id)
        .bind(&input.item_id)
        .bind(&input.event_type)
        .bind(&input.occurred_at)
        .bind(&input.now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn count_metered_access(
        &self,
        tenant_id: &str,
        user_id: &str,
        item_id: &str,
        window_start: &str,
    ) -> Result<i64, sqlx::Error> {
        let row = sqlx::query(
            r#"
            SELECT COUNT(*) as cnt
            FROM news_metered_access_event
            WHERE tenant_id = ?
              AND user_id = ?
              AND item_id = ?
              AND occurred_at >= ?
            "#,
        )
        .bind(tenant_id)
        .bind(user_id)
        .bind(item_id)
        .bind(window_start)
        .fetch_one(&self.pool)
        .await?;

        Ok(row.get::<i32, _>("cnt") as i64)
    }

    pub async fn list_paywall_policies(
        &self,
        tenant_id: &str,
        limit: i64,
    ) -> Result<Vec<NewsStoredPaywallPolicy>, sqlx::Error> {
        let rows = sqlx::query(
            r#"
            SELECT id, policy_name, policy_type, rules_json, enabled
            FROM news_paywall_policy
            WHERE tenant_id = ?
            ORDER BY created_at DESC
            LIMIT ?
            "#,
        )
        .bind(tenant_id)
        .bind(limit.max(1))
        .fetch_all(&self.pool)
        .await?;

        Ok(rows
            .iter()
            .map(|row| NewsStoredPaywallPolicy {
                id: row.get("id"),
                policy_name: row.get("policy_name"),
                policy_type: row.get("policy_type"),
                rules_json: row.get("rules_json"),
                enabled: row.get("enabled"),
            })
            .collect())
    }
}
