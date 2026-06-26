use sdkwork_routes_news_app_api::{app_routes, HttpMethod};

#[test]
fn news_app_api_routes_use_only_app_prefix() {
    let routes = app_routes();
    assert_eq!(routes.len(), 40);
    assert!(routes
        .iter()
        .all(|route| route.path.starts_with("/app/v3/api/news")));
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
