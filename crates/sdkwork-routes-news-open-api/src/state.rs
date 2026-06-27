use sqlx::SqlitePool;

#[derive(Clone)]
pub struct NewsHttpState {
    pub pool: SqlitePool,
}
