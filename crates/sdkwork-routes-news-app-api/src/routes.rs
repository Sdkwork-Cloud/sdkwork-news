use axum::{
    routing::{get, post},
    Router,
};
use std::sync::Arc;

use crate::handlers;
use sdkwork_routes_news_open_api::state::NewsHttpState;

pub fn gateway_mount(state: Arc<NewsHttpState>) -> Router {
    Router::new()
        .route("/app/v3/api/news/items", get(handlers::app::list_items))
        .route(
            "/app/v3/api/news/items/{itemId}",
            get(handlers::app::get_item),
        )
        .route(
            "/app/v3/api/news/categories",
            get(handlers::app::list_categories),
        )
        .route(
            "/app/v3/api/news/feed/personalized",
            get(handlers::app::get_personalized_feed),
        )
        .route(
            "/app/v3/api/news/events",
            post(handlers::app::create_event),
        )
        .route(
            "/app/v3/api/news/favorites",
            get(handlers::app::list_favorites),
        )
        .route(
            "/app/v3/api/news/favorites/{itemId}",
            post(handlers::app::create_favorite),
        )
        .with_state(state)
}
