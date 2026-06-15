use axum::Router;
use sqlx::SqlitePool;
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;

use crate::routes;

pub struct AppState {
    pub pool: SqlitePool,
}

pub async fn create_app() -> Result<Router, anyhow::Error> {
    // Load .env file if present
    let _ = dotenvy::dotenv();

    // Create database pool using sdkwork-pool
    let pool = sdkwork_pool_sqlx::create_pool_from_env("NEWS")
        .await?
        .ok_or_else(|| anyhow::anyhow!("SDKWORK_NEWS_DATABASE_URL not set"))?;

    // Extract SQLite pool
    let sqlite_pool = pool.as_sqlite()
        .ok_or_else(|| anyhow::anyhow!("Expected SQLite pool for news service"))?
        .clone();

    // Run migrations
    run_migrations(&sqlite_pool).await?;

    let state = Arc::new(AppState { pool: sqlite_pool });

    // Build router
    let app = Router::new()
        .merge(routes::open_api_routes())
        .merge(routes::app_api_routes())
        .merge(routes::backend_api_routes())
        .merge(routes::health_routes())
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    Ok(app)
}

async fn run_migrations(pool: &SqlitePool) -> Result<(), anyhow::Error> {
    let migrations = [
        include_str!("../../../sdkwork-content-news-repository-sqlx/migrations/0001_news_foundation.sql"),
        include_str!("../../../sdkwork-content-news-repository-sqlx/migrations/0002_news_industry_foundation.sql"),
        include_str!("../../../sdkwork-content-news-repository-sqlx/migrations/0003_news_personalization_foundation.sql"),
        include_str!("../../../sdkwork-content-news-repository-sqlx/migrations/0004_news_alert_digest_foundation.sql"),
        include_str!("../../../sdkwork-content-news-repository-sqlx/migrations/0005_news_trust_correction_foundation.sql"),
        include_str!("../../../sdkwork-content-news-repository-sqlx/migrations/0006_news_live_coverage_foundation.sql"),
        include_str!("../../../sdkwork-content-news-repository-sqlx/migrations/0007_news_professional_newsroom_foundation.sql"),
    ];

    for migration in &migrations {
        sqlx::raw_sql(migration).execute(pool).await?;
    }

    tracing::info!("Database migrations completed");
    Ok(())
}
