pub mod handlers;

pub const APP_API_PREFIX: &str = "/app/v3/api";

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

pub fn app_routes() -> Vec<NewsHttpRoute> {
    vec![
        route(
            HttpMethod::Get,
            "/app/v3/api/news/categories",
            "categories.list",
        ),
        route(HttpMethod::Get, "/app/v3/api/news/items", "items.list"),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/items/{itemId}",
            "items.retrieve",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/items/by_slug/{slug}",
            "items.bySlug.retrieve",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/overview",
            "overview.retrieve",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/channels",
            "channels.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/channels/{channelId}/feed",
            "channels.feed.list",
        ),
        route(HttpMethod::Get, "/app/v3/api/news/topics", "topics.list"),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/topics/{topicId}/items",
            "topics.items.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/feed/personalized",
            "feed.personalized.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/items/{itemId}/related",
            "items.related.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/trending",
            "trending.list",
        ),
        route(HttpMethod::Get, "/app/v3/api/news/search", "search.list"),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/search/suggestions",
            "search.suggestions.list",
        ),
        route(HttpMethod::Post, "/app/v3/api/news/events", "events.create"),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/favorites",
            "favorites.list",
        ),
        route(
            HttpMethod::Post,
            "/app/v3/api/news/items/{itemId}/favorites",
            "favorites.create",
        ),
        route(
            HttpMethod::Delete,
            "/app/v3/api/news/items/{itemId}/favorites",
            "favorites.delete",
        ),
        route(
            HttpMethod::Put,
            "/app/v3/api/news/items/{itemId}/reactions",
            "reactions.upsert",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/items/{itemId}/comments",
            "comments.list",
        ),
        route(
            HttpMethod::Post,
            "/app/v3/api/news/items/{itemId}/comments",
            "comments.create",
        ),
        route(
            HttpMethod::Post,
            "/app/v3/api/news/reports",
            "reports.create",
        ),
        route(
            HttpMethod::Post,
            "/app/v3/api/news/feedback",
            "feedback.create",
        ),
        route(HttpMethod::Get, "/app/v3/api/news/history", "history.list"),
        route(HttpMethod::Get, "/app/v3/api/news/follows", "follows.list"),
        route(
            HttpMethod::Post,
            "/app/v3/api/news/follows",
            "follows.create",
        ),
        route(
            HttpMethod::Delete,
            "/app/v3/api/news/follows/{followId}",
            "follows.delete",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/interests",
            "interests.list",
        ),
        route(
            HttpMethod::Put,
            "/app/v3/api/news/interests",
            "interests.upsert",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/notification/subscriptions",
            "notification.subscriptions.list",
        ),
        route(
            HttpMethod::Put,
            "/app/v3/api/news/notification/subscriptions",
            "notification.subscriptions.upsert",
        ),
        route(
            HttpMethod::Delete,
            "/app/v3/api/news/notification/subscriptions/{subscriptionId}",
            "notification.subscriptions.delete",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/alerts/breaking",
            "alerts.breaking.list",
        ),
        route(HttpMethod::Get, "/app/v3/api/news/digests", "digests.list"),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/items/{itemId}/trust",
            "trust.item.retrieve",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/fact_checks",
            "factChecks.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/corrections",
            "corrections.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/live/events",
            "live.events.list",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/live/events/{eventId}",
            "live.events.retrieve",
        ),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/live/events/{eventId}/updates",
            "live.updates.list",
        ),
    ]
}

pub fn required_dual_token_headers() -> [&'static str; 2] {
    ["Authorization", "Access-Token"]
}

fn route(method: HttpMethod, path: &'static str, operation_id: &'static str) -> NewsHttpRoute {
    NewsHttpRoute::new(method, path, "news", operation_id)
}
