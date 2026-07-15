//! Gateway bootstrap for sdkwork-news.

use axum::Router;
use sdkwork_routes_news_open_api::state::NewsHttpState;
use std::sync::Arc;

pub struct ApplicationAssembly {
    pub router: Router,
}

pub fn assemble_application_business_router(state: Arc<NewsHttpState>) -> ApplicationAssembly {
    let router = Router::new()
        .merge(sdkwork_routes_news_open_api::gateway_mount(state.clone()))
        .merge(sdkwork_routes_news_app_api::gateway_mount(state.clone()))
        .merge(sdkwork_routes_news_backend_api::gateway_mount(state));
    ApplicationAssembly { router }
}

/// Assemble the news application router from environment variables.
///
/// This function bootstraps the news database from environment variables,
/// creates the HTTP state, and delegates to [`assemble_application_business_router`].
pub async fn assemble_application_router() -> Result<ApplicationAssembly, String> {
    let host = sdkwork_news_database_host::bootstrap_news_database_from_env().await?;
    let sqlite_pool = host
        .pool()
        .as_sqlite()
        .ok_or_else(|| "Expected SQLite pool for news service".to_string())?
        .clone();
    let state = Arc::new(NewsHttpState { pool: sqlite_pool });
    Ok(assemble_application_business_router(state))
}
