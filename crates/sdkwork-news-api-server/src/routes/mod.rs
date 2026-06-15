use axum::{
    routing::{get, post},
    Router,
};
use std::sync::Arc;

use crate::bootstrap::AppState;
use crate::handlers;

pub fn open_api_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/open/v3/api/news/items", get(handlers::open::list_items))
        .route(
            "/open/v3/api/news/items/{itemId}",
            get(handlers::open::get_item),
        )
        .route(
            "/open/v3/api/news/items/by_slug/{slug}",
            get(handlers::open::get_item_by_slug),
        )
        .route(
            "/open/v3/api/news/categories",
            get(handlers::open::list_categories),
        )
        .route(
            "/open/v3/api/news/channels",
            get(handlers::open::list_channels),
        )
        .route(
            "/open/v3/api/news/channels/{channelId}/feed",
            get(handlers::open::list_channel_feed),
        )
        .route("/open/v3/api/news/topics", get(handlers::open::list_topics))
        .route(
            "/open/v3/api/news/trending",
            get(handlers::open::list_trending),
        )
        .route(
            "/open/v3/api/news/search",
            get(handlers::open::search),
        )
}

pub fn app_api_routes() -> Router<Arc<AppState>> {
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
}

pub fn backend_api_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route(
            "/backend/v3/api/news/items",
            get(handlers::backend::list_items),
        )
        .route(
            "/backend/v3/api/news/items",
            post(handlers::backend::create_item),
        )
        .route(
            "/backend/v3/api/news/stories",
            get(handlers::backend::list_stories),
        )
        .route(
            "/backend/v3/api/news/stories",
            post(handlers::backend::create_story),
        )
        .route(
            "/backend/v3/api/news/stories/{storyId}",
            get(handlers::backend::get_story),
        )
        .route(
            "/backend/v3/api/news/stories/{storyId}/publish",
            post(handlers::backend::publish_story),
        )
}

pub fn health_routes() -> Router<Arc<AppState>> {
    Router::new().route("/health", get(handlers::health::health_check))
}
