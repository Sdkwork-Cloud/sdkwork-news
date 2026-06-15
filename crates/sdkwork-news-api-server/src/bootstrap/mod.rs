use axum::Router;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;

use crate::routes;

pub struct AppState {
    pub pool: SqlitePool,
}

pub async fn create_app() -> Result<Router, anyhow::Error> {
    // Database connection
    let database_url =
        std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:news.db?mode=rwc".to_string());

    let pool = SqlitePoolOptions::new()
        .max_connections(16)
        .connect(&database_url)
        .await?;

    // Run migrations
    run_migrations(&pool).await?;

    let state = Arc::new(AppState { pool });

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
