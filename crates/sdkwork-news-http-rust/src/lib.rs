pub const APP_API_PREFIX: &str = "/app/v3/api";
pub const BACKEND_API_PREFIX: &str = "/backend/v3/api";

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
    ]
}

pub fn all_routes() -> Vec<NewsHttpRoute> {
    let mut routes = app_routes();
    routes.extend(backend_routes());
    routes
}

pub fn required_dual_token_headers() -> [&'static str; 2] {
    ["Authorization", "Access-Token"]
}

fn route(method: HttpMethod, path: &'static str, operation_id: &'static str) -> NewsHttpRoute {
    NewsHttpRoute::new(method, path, "news", operation_id)
}

