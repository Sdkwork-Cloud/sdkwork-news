pub mod handlers;
pub mod http_route_manifest;
pub mod routes;
pub mod state;
pub mod web_bootstrap;

use sdkwork_web_core::HttpRouteManifest;

pub use http_route_manifest::open_route_manifest;
pub use web_bootstrap::{
    news_open_api_prefixes, news_open_api_public_path_prefixes, wrap_router_with_web_framework,
    wrap_router_with_web_framework_from_env,
};

pub const OPEN_API_PREFIX: &str = "/open/v3/api";

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum HttpMethod {
    Delete,
    Get,
    Patch,
    Post,
    Put,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsHttpRoute {
    pub method: HttpMethod,
    pub path: &'static str,
    pub tag: &'static str,
    pub operation_id: &'static str,
}

impl NewsHttpRoute {
    pub const fn new(
        method: HttpMethod,
        path: &'static str,
        tag: &'static str,
        operation_id: &'static str,
    ) -> Self {
        Self {
            method,
            path,
            tag,
            operation_id,
        }
    }
}

pub fn open_routes() -> Vec<NewsHttpRoute> {
    vec![
        route(HttpMethod::Get, "/open/v3/api/news/items", "items.list"),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/items/{itemId}",
            "items.retrieve",
        ),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/items/by_slug/{slug}",
            "items.bySlug.retrieve",
        ),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/channels",
            "channels.list",
        ),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/channels/{channelId}/feed",
            "channels.feed.list",
        ),
        route(HttpMethod::Get, "/open/v3/api/news/topics", "topics.list"),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/topics/{topicId}/items",
            "topics.items.list",
        ),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/items/{itemId}/related",
            "items.related.list",
        ),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/trending",
            "trending.list",
        ),
        route(HttpMethod::Get, "/open/v3/api/news/search", "search.list"),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/search/suggestions",
            "search.suggestions.list",
        ),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/alerts/breaking",
            "alerts.breaking.list",
        ),
        route(HttpMethod::Get, "/open/v3/api/news/digests", "digests.list"),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/items/{itemId}/trust",
            "trust.item.retrieve",
        ),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/fact_checks",
            "factChecks.list",
        ),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/corrections",
            "corrections.list",
        ),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/live/events",
            "live.events.list",
        ),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/live/events/{eventId}",
            "live.events.retrieve",
        ),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/live/events/{eventId}/updates",
            "live.updates.list",
        ),
    ]
}

fn route(method: HttpMethod, path: &'static str, operation_id: &'static str) -> NewsHttpRoute {
    NewsHttpRoute::new(method, path, "news", operation_id)
}

pub fn gateway_route_manifest() -> HttpRouteManifest {
    open_route_manifest()
}

pub fn gateway_mount(state: std::sync::Arc<state::NewsHttpState>) -> axum::Router {
    routes::gateway_mount(state)
}
