use sdkwork_router_news_backend_api::{backend_routes, HttpMethod};

#[test]
fn news_backend_api_routes_use_only_backend_prefix() {
    let routes = backend_routes();
    assert_eq!(routes.len(), 93);
    assert!(routes
        .iter()
        .all(|route| route.path.starts_with("/backend/v3/api/news")));
    assert!(routes.iter().all(|route| route.tag == "news"));
    assert!(routes.iter().all(|route| route.operation_id.contains('.')));
    assert!(routes.iter().any(|route| matches!(
        route.method,
        HttpMethod::Get
            | HttpMethod::Post
            | HttpMethod::Put
            | HttpMethod::Patch
            | HttpMethod::Delete
    )));
}
