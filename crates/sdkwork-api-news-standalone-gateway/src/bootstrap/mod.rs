use axum::Router;
use std::sync::Arc;
use tower_http::trace::TraceLayer;

use crate::readiness::NewsPostgresReadinessCheck;
use crate::web_bootstrap::wrap_router_with_web_framework_from_env;
use sdkwork_api_news_assembly::{assemble_business_routes, NewsHttpState};
use sdkwork_web_bootstrap::{service_router, ServiceRouterConfig};

pub async fn create_app() -> Result<Router, anyhow::Error> {
    let _ = dotenvy::dotenv();

    let pool = sdkwork_database_sqlx::create_pool_from_env("NEWS")
        .await?
        .ok_or_else(|| anyhow::anyhow!("SDKWORK_NEWS_DATABASE_URL not set"))?;

    let postgres_pool = pool
        .as_postgres()
        .ok_or_else(|| anyhow::anyhow!("News authoritative server requires PostgreSQL"))?
        .clone();

    sdkwork_content_news_repository_sqlx::bootstrap_news_database(pool)
        .await
        .map_err(anyhow::Error::msg)?;

    let state = Arc::new(NewsHttpState {
        pool: postgres_pool.clone(),
    });

    let business = assemble_business_routes(state).router;
    let business = business
        .layer(sdkwork_web_bootstrap::application_cors_layer_from_env(
            &["SDKWORK_NEWS_ENVIRONMENT"],
            &[
                "SDKWORK_NEWS_CORS_ALLOWED_ORIGINS",
                "SDKWORK_CORS_ALLOWED_ORIGINS",
            ],
        ))
        .layer(TraceLayer::new_for_http());

    let business = wrap_router_with_web_framework_from_env(business).await;
    Ok(service_router(
        business,
        ServiceRouterConfig::default()
            .with_readiness_check(Arc::new(NewsPostgresReadinessCheck::new(postgres_pool))),
    ))
}
