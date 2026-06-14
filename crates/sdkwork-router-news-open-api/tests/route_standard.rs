use sdkwork_router_news_open_api::{open_routes, HttpMethod};

#[test]
fn news_open_api_routes_use_only_open_prefix() {
    let routes = open_routes();
    assert_eq!(routes.len(), 19);
    assert!(routes
        .iter()
        .all(|route| route.path.starts_with("/open/v3/api/news")));
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
