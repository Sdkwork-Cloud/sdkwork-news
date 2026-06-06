pub const APP_API_PREFIX: &str = "/app/v3/api";
pub const BACKEND_API_PREFIX: &str = "/backend/v3/api";
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

pub fn app_routes() -> Vec<NewsHttpRoute> {
    vec![
        route(HttpMethod::Get, "/app/v3/api/news/categories", "categories.list"),
        route(HttpMethod::Get, "/app/v3/api/news/items", "items.list"),
        route(HttpMethod::Get, "/app/v3/api/news/items/{itemId}", "items.retrieve"),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/items/by_slug/{slug}",
            "items.bySlug.retrieve",
        ),
        route(HttpMethod::Get, "/app/v3/api/news/overview", "overview.retrieve"),
        route(HttpMethod::Get, "/app/v3/api/news/channels", "channels.list"),
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
        route(HttpMethod::Get, "/app/v3/api/news/trending", "trending.list"),
        route(HttpMethod::Get, "/app/v3/api/news/search", "search.list"),
        route(
            HttpMethod::Get,
            "/app/v3/api/news/search/suggestions",
            "search.suggestions.list",
        ),
        route(HttpMethod::Post, "/app/v3/api/news/events", "events.create"),
        route(HttpMethod::Get, "/app/v3/api/news/favorites", "favorites.list"),
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
        route(HttpMethod::Post, "/app/v3/api/news/reports", "reports.create"),
        route(HttpMethod::Post, "/app/v3/api/news/feedback", "feedback.create"),
        route(HttpMethod::Get, "/app/v3/api/news/history", "history.list"),
        route(HttpMethod::Get, "/app/v3/api/news/follows", "follows.list"),
        route(HttpMethod::Post, "/app/v3/api/news/follows", "follows.create"),
        route(
            HttpMethod::Delete,
            "/app/v3/api/news/follows/{followId}",
            "follows.delete",
        ),
        route(HttpMethod::Get, "/app/v3/api/news/interests", "interests.list"),
        route(HttpMethod::Put, "/app/v3/api/news/interests", "interests.upsert"),
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
    ]
}

pub fn open_routes() -> Vec<NewsHttpRoute> {
    vec![
        route(HttpMethod::Get, "/open/v3/api/news/items", "items.list"),
        route(HttpMethod::Get, "/open/v3/api/news/items/{itemId}", "items.retrieve"),
        route(
            HttpMethod::Get,
            "/open/v3/api/news/items/by_slug/{slug}",
            "items.bySlug.retrieve",
        ),
        route(HttpMethod::Get, "/open/v3/api/news/channels", "channels.list"),
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
        route(HttpMethod::Get, "/open/v3/api/news/trending", "trending.list"),
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
    ]
}

pub fn backend_routes() -> Vec<NewsHttpRoute> {
    vec![
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/categories",
            "categories.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/categories",
            "categories.create",
        ),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/news/categories/{categoryId}",
            "categories.update",
        ),
        route(
            HttpMethod::Delete,
            "/backend/v3/api/news/categories/{categoryId}",
            "categories.delete",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/items",
            "items.management.list",
        ),
        route(HttpMethod::Post, "/backend/v3/api/news/items", "items.create"),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/news/items/{itemId}",
            "items.update",
        ),
        route(
            HttpMethod::Delete,
            "/backend/v3/api/news/items/{itemId}",
            "items.delete",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/items/{itemId}/publish",
            "items.publish",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/items/{itemId}/schedule",
            "items.schedule",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/items/{itemId}/archive",
            "items.archive",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/items/{itemId}/feature",
            "items.feature",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/items/{itemId}/editorial_readiness",
            "items.editorialReadiness.retrieve",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/sources",
            "sources.management.list",
        ),
        route(HttpMethod::Post, "/backend/v3/api/news/sources", "sources.create"),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/news/sources/{sourceId}",
            "sources.update",
        ),
        route(
            HttpMethod::Delete,
            "/backend/v3/api/news/sources/{sourceId}",
            "sources.delete",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/authors",
            "authors.management.list",
        ),
        route(HttpMethod::Post, "/backend/v3/api/news/authors", "authors.create"),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/news/authors/{authorId}",
            "authors.update",
        ),
        route(
            HttpMethod::Delete,
            "/backend/v3/api/news/authors/{authorId}",
            "authors.delete",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/channels",
            "channels.management.list",
        ),
        route(HttpMethod::Post, "/backend/v3/api/news/channels", "channels.create"),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/news/channels/{channelId}",
            "channels.update",
        ),
        route(
            HttpMethod::Delete,
            "/backend/v3/api/news/channels/{channelId}",
            "channels.delete",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/topics",
            "topics.management.list",
        ),
        route(HttpMethod::Post, "/backend/v3/api/news/topics", "topics.create"),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/news/topics/{topicId}",
            "topics.update",
        ),
        route(
            HttpMethod::Delete,
            "/backend/v3/api/news/topics/{topicId}",
            "topics.delete",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/items/{itemId}/versions",
            "items.versions.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/items/{itemId}/versions",
            "items.versions.create",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/items/{itemId}/media",
            "items.media.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/items/{itemId}/media",
            "items.media.attach",
        ),
        route(
            HttpMethod::Delete,
            "/backend/v3/api/news/items/{itemId}/media/{mediaId}",
            "items.media.delete",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/moderation/cases",
            "moderation.cases.list",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/moderation/cases/{caseId}",
            "moderation.cases.retrieve",
        ),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/news/moderation/cases/{caseId}",
            "moderation.cases.update",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/comments/moderation",
            "comments.moderation.list",
        ),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/news/comments/{commentId}/moderation",
            "comments.moderation.update",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/reports",
            "reports.management.list",
        ),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/news/reports/{reportId}",
            "reports.update",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/trending/metrics",
            "trending.metrics.list",
        ),
        route(
            HttpMethod::Put,
            "/backend/v3/api/news/trending/metrics",
            "trending.metrics.upsert",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/items/metrics",
            "items.metrics.list",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/items/{itemId}/metrics",
            "items.metrics.retrieve",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/items/metrics/rebuild",
            "items.metrics.rebuild",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/feed/candidates",
            "feed.candidates.list",
        ),
        route(
            HttpMethod::Put,
            "/backend/v3/api/news/feed/candidates",
            "feed.candidates.upsert",
        ),
        route(
            HttpMethod::Delete,
            "/backend/v3/api/news/feed/candidates/{candidateId}",
            "feed.candidates.delete",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/interests",
            "interests.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/interests/rebuild",
            "interests.rebuild",
        ),
        route(
            HttpMethod::Delete,
            "/backend/v3/api/news/interests/{interestId}",
            "interests.delete",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/search/suggestions",
            "search.suggestions.management.list",
        ),
        route(
            HttpMethod::Put,
            "/backend/v3/api/news/search/suggestions",
            "search.suggestions.upsert",
        ),
        route(
            HttpMethod::Delete,
            "/backend/v3/api/news/search/suggestions/{suggestionId}",
            "search.suggestions.delete",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/search/events",
            "search.events.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/search/projections/rebuild",
            "search.projections.rebuild",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/experiments",
            "experiments.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/experiments",
            "experiments.create",
        ),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/news/experiments/{experimentId}",
            "experiments.update",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/experiments/{experimentId}/archive",
            "experiments.archive",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/notification/subscriptions",
            "notification.subscriptions.management.list",
        ),
        route(
            HttpMethod::Delete,
            "/backend/v3/api/news/notification/subscriptions/{subscriptionId}",
            "notification.subscriptions.delete",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/alerts/breaking",
            "alerts.breaking.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/alerts/breaking",
            "alerts.breaking.create",
        ),
        route(
            HttpMethod::Patch,
            "/backend/v3/api/news/alerts/breaking/{alertId}",
            "alerts.breaking.update",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/alerts/breaking/{alertId}/publish",
            "alerts.breaking.publish",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/alerts/breaking/{alertId}/cancel",
            "alerts.breaking.cancel",
        ),
        route(
            HttpMethod::Get,
            "/backend/v3/api/news/digests",
            "digests.management.list",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/digests",
            "digests.create",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/digests/{digestId}/publish",
            "digests.publish",
        ),
        route(
            HttpMethod::Post,
            "/backend/v3/api/news/digests/{digestId}/items",
            "digests.items.attach",
        ),
    ]
}

pub fn all_routes() -> Vec<NewsHttpRoute> {
    let mut routes = open_routes();
    routes.extend(app_routes());
    routes.extend(backend_routes());
    routes
}

pub fn required_dual_token_headers() -> [&'static str; 2] {
    ["Authorization", "Access-Token"]
}

fn route(method: HttpMethod, path: &'static str, operation_id: &'static str) -> NewsHttpRoute {
    NewsHttpRoute::new(method, path, "news", operation_id)
}
