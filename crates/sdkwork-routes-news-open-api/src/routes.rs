use axum::{
    routing::{get},
    Router,
};
use std::sync::Arc;

use crate::handlers;
use crate::state::NewsHttpState;

pub fn gateway_mount(state: Arc<NewsHttpState>) -> Router {
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
        .with_state(state)
}
