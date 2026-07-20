use std::future::Future;
use std::pin::Pin;

use sdkwork_web_bootstrap::ReadinessCheck;
use sqlx::SqlitePool;

pub struct NewsSqliteReadinessCheck {
    pool: SqlitePool,
}

impl NewsSqliteReadinessCheck {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl ReadinessCheck for NewsSqliteReadinessCheck {
    fn check(&self) -> Pin<Box<dyn Future<Output = Result<(), String>> + Send + '_>> {
        let pool = self.pool.clone();
        Box::pin(async move {
            sqlx::query("SELECT 1")
                .execute(&pool)
                .await
                .map(|_| ())
                .map_err(|error| error.to_string())
        })
    }
}
