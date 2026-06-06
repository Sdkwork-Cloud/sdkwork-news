use sdkwork_news_http::{all_routes, app_routes, backend_routes, open_routes, required_dual_token_headers, HttpMethod};

#[test]
fn news_http_routes_use_sdkwork_v3_prefixes_and_resource_operation_ids() {
    assert_eq!(open_routes().len(), 11);
    assert_eq!(app_routes().len(), 29);
    assert_eq!(backend_routes().len(), 61);
    assert!(open_routes().iter().all(|route| route.path.starts_with("/open/v3/api/news")));
    assert!(app_routes().iter().all(|route| route.path.starts_with("/app/v3/api/news")));
    assert!(backend_routes().iter().all(|route| route.path.starts_with("/backend/v3/api/news")));
    assert!(all_routes().iter().all(|route| route.tag == "news"));
    assert!(all_routes().iter().all(|route| route.operation_id.contains('.')));
    assert!(all_routes().iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "items.publish"));
    assert!(all_routes().iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "channels.feed.list"));
    assert!(all_routes().iter().any(|route| route.method == HttpMethod::Post && route.operation_id == "events.create"));
    assert!(all_routes().iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "search.suggestions.list"));
    assert!(all_routes().iter().any(|route| route.method == HttpMethod::Put && route.operation_id == "interests.upsert"));
    assert!(all_routes().iter().any(|route| route.method == HttpMethod::Put && route.operation_id == "feed.candidates.upsert"));
    assert!(all_routes().iter().any(|route| route.method == HttpMethod::Get && route.operation_id == "items.metrics.retrieve"));
    assert!(all_routes().iter().any(|route| route.method == HttpMethod::Patch && route.operation_id == "moderation.cases.update"));
    assert_eq!(required_dual_token_headers(), ["Authorization", "Access-Token"]);
}
