//! Gateway bootstrap for sdkwork-news.

use axum::Router;
use sdkwork_routes_news_open_api::state::NewsHttpState;
use std::sync::Arc;

pub struct ApiAssembly {
    pub router: Router,
}

pub fn assemble_business_routes(state: Arc<NewsHttpState>) -> ApiAssembly {
    let router = Router::new()
        .merge(sdkwork_routes_news_open_api::gateway_mount(state.clone()))
        .merge(sdkwork_routes_news_app_api::gateway_mount(state.clone()))
        .merge(sdkwork_routes_news_backend_api::gateway_mount(state));
    ApiAssembly { router }
}

/// Assemble the news application router from environment variables.
///
/// This function prepares the authoritative News PostgreSQL database through
/// the lifecycle host and creates the HTTP state.
pub async fn assemble_api_router() -> Result<ApiAssembly, String> {
    let host = sdkwork_news_database_host::bootstrap_news_database_from_env().await?;
    let postgres_pool = host
        .pool()
        .as_postgres()
        .ok_or_else(|| "News authoritative server requires PostgreSQL".to_string())?
        .clone();
    let state = Arc::new(NewsHttpState {
        pool: postgres_pool,
    });
    Ok(assemble_business_routes(state))
}
