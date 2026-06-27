use sdkwork_web_core::{HttpMethod, HttpRoute, HttpRouteManifest};

const HTTP_ROUTES: &[HttpRoute] = &[
    HttpRoute::public(HttpMethod::Get, "/open/v3/api/news/items", "news", "items.list"),
    HttpRoute::public(
        HttpMethod::Get,
        "/open/v3/api/news/items/{itemId}",
        "news",
        "items.retrieve",
    ),
    HttpRoute::public(
        HttpMethod::Get,
        "/open/v3/api/news/items/by_slug/{slug}",
        "news",
        "items.bySlug.retrieve",
    ),
    HttpRoute::public(
        HttpMethod::Get,
        "/open/v3/api/news/categories",
        "news",
        "categories.list",
    ),
    HttpRoute::public(
        HttpMethod::Get,
        "/open/v3/api/news/channels",
        "news",
        "channels.list",
    ),
    HttpRoute::public(
        HttpMethod::Get,
        "/open/v3/api/news/channels/{channelId}/feed",
        "news",
        "channels.feed.list",
    ),
    HttpRoute::public(HttpMethod::Get, "/open/v3/api/news/topics", "news", "topics.list"),
    HttpRoute::public(
        HttpMethod::Get,
        "/open/v3/api/news/trending",
        "news",
        "trending.list",
    ),
    HttpRoute::public(HttpMethod::Get, "/open/v3/api/news/search", "news", "search.list"),
    HttpRoute::dual_token(HttpMethod::Get, "/app/v3/api/news/items", "news", "items.list"),
    HttpRoute::dual_token(
        HttpMethod::Get,
        "/app/v3/api/news/items/{itemId}",
        "news",
        "items.retrieve",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        "/app/v3/api/news/categories",
        "news",
        "categories.list",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        "/app/v3/api/news/feed/personalized",
        "news",
        "feed.personalized.retrieve",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        "/app/v3/api/news/events",
        "news",
        "events.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        "/app/v3/api/news/favorites",
        "news",
        "favorites.list",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        "/app/v3/api/news/favorites/{itemId}",
        "news",
        "favorites.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        "/backend/v3/api/news/items",
        "news",
        "items.list",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        "/backend/v3/api/news/items",
        "news",
        "items.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        "/backend/v3/api/news/stories",
        "news",
        "stories.list",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        "/backend/v3/api/news/stories",
        "news",
        "stories.create",
    ),
    HttpRoute::dual_token(
        HttpMethod::Get,
        "/backend/v3/api/news/stories/{storyId}",
        "news",
        "stories.retrieve",
    ),
    HttpRoute::dual_token(
        HttpMethod::Post,
        "/backend/v3/api/news/stories/{storyId}/publish",
        "news",
        "stories.publish",
    ),
];

pub fn news_route_manifest() -> HttpRouteManifest {
    HttpRouteManifest::new(HTTP_ROUTES)
}

pub fn news_public_path_prefixes() -> Vec<String> {
    sdkwork_web_bootstrap::infra_public_path_prefixes()
}

pub fn news_open_api_prefixes() -> Vec<String> {
    vec!["/open/v3/api".to_owned()]
}
