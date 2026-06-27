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
