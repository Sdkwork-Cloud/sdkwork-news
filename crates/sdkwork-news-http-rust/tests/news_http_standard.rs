use sdkwork_news_http::{all_routes, app_routes, backend_routes, required_dual_token_headers, HttpMethod};

#[test]
fn news_http_routes_use_sdkwork_v3_prefixes_and_resource_operation_ids() {
    assert_eq!(app_routes().len(), 5);
    assert_eq!(backend_routes().len(), 13);
    assert!(app_routes().iter().all(|route| route.path.starts_with("/app/v3/api/news")));
    assert!(backend_routes().iter().all(|route| route.path.starts_with("/backend/v3/api/news")));
    assert!(all_routes().iter().all(|route| route.tag == "news"));
    assert!(all_routes().iter().all(|route| route.operation_id.contains('.')));
    assert!(all_routes().iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "items.publish"));
    assert_eq!(required_dual_token_headers(), ["Authorization", "Access-Token"]);
}

