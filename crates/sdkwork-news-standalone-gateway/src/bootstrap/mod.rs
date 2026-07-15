use axum::Router;
use sqlx::SqlitePool;
use std::sync::Arc;
use tower_http::trace::TraceLayer;

use crate::readiness::NewsSqliteReadinessCheck;
use crate::web_bootstrap::wrap_router_with_web_framework_from_env;
use sdkwork_news_gateway_assembly::{assemble_application_business_router, NewsHttpState};
use sdkwork_web_bootstrap::{service_router, ServiceRouterConfig};

pub async fn create_app() -> Result<Router, anyhow::Error> {
    let _ = dotenvy::dotenv();

    let pool = sdkwork_database_sqlx::create_pool_from_env("NEWS")
        .await?
        .ok_or_else(|| anyhow::anyhow!("SDKWORK_NEWS_DATABASE_URL not set"))?;

    let sqlite_pool = pool
        .as_sqlite()
        .ok_or_else(|| anyhow::anyhow!("Expected SQLite pool for news service"))?
        .clone();

    run_migrations(&sqlite_pool).await?;

    let state = Arc::new(NewsHttpState {
        pool: sqlite_pool.clone(),
    });

    let business = assemble_application_business_router(state).router;
    let business = business
        .layer(sdkwork_web_bootstrap::application_cors_layer_from_env(
            &["SDKWORK_NEWS_ENVIRONMENT"],
            &["SDKWORK_NEWS_CORS_ALLOWED_ORIGINS", "SDKWORK_CORS_ALLOWED_ORIGINS"],
        ))
        .layer(TraceLayer::new_for_http());

    let business = wrap_router_with_web_framework_from_env(business).await;
    Ok(service_router(
        business,
        ServiceRouterConfig::default()
            .with_readiness_check(Arc::new(NewsSqliteReadinessCheck::new(sqlite_pool))),
    ))
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
