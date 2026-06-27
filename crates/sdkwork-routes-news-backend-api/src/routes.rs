use axum::{
    routing::{get, post},
    Router,
};
use std::sync::Arc;

use crate::handlers;
use sdkwork_routes_news_open_api::state::NewsHttpState;

pub fn gateway_mount(state: Arc<NewsHttpState>) -> Router {
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
        .with_state(state)
}
