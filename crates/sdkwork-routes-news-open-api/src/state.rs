use sqlx::PgPool;

#[derive(Clone)]
pub struct NewsHttpState {
    pub pool: PgPool,
}
