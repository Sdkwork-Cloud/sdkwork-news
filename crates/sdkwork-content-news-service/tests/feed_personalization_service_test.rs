use sdkwork_content_news_service::service::feed_personalization_service::{
    FeedQuery, NewsFeedPersonalizationService, ShareEventCommand,
};

#[test]
fn validate_feed_query_requires_tenant_id() {
    let service = NewsFeedPersonalizationService::new();
    let query = FeedQuery {
        tenant_id: "".to_string(),
        user_id: None,
        organization_id: None,
        region: None,
        locale: None,
        cursor: None,
        limit: 20,
    };
    let result = service.validate_feed_query(&query);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-tenant");
}

#[test]
fn validate_feed_query_limit_zero_fails() {
    let service = NewsFeedPersonalizationService::new();
    let query = FeedQuery {
        tenant_id: "t1".to_string(),
        user_id: Some("u1".to_string()),
        organization_id: None,
        region: None,
        locale: None,
        cursor: None,
        limit: 0,
    };
    let result = service.validate_feed_query(&query);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/invalid-limit");
}

#[test]
fn validate_feed_query_limit_over_100_fails() {
    let service = NewsFeedPersonalizationService::new();
    let query = FeedQuery {
        tenant_id: "t1".to_string(),
        user_id: None,
        organization_id: None,
        region: None,
        locale: None,
        cursor: None,
        limit: 101,
    };
    let result = service.validate_feed_query(&query);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/invalid-limit");
}

#[test]
fn validate_feed_query_valid_passes() {
    let service = NewsFeedPersonalizationService::new();
    let query = FeedQuery {
        tenant_id: "t1".to_string(),
        user_id: Some("u1".to_string()),
        organization_id: Some("org1".to_string()),
        region: Some("US".to_string()),
        locale: Some("en".to_string()),
        cursor: Some("cursor123".to_string()),
        limit: 20,
    };
    assert!(service.validate_feed_query(&query).is_ok());
}

#[test]
fn validate_share_event_requires_tenant_id() {
    let service = NewsFeedPersonalizationService::new();
    let cmd = ShareEventCommand {
        tenant_id: "".to_string(),
        user_id: None,
        item_id: "item1".to_string(),
        share_channel: None,
        actor_user_id: None,
    };
    let result = service.validate_share_event(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-tenant");
}

#[test]
fn validate_share_event_requires_item_id() {
    let service = NewsFeedPersonalizationService::new();
    let cmd = ShareEventCommand {
        tenant_id: "t1".to_string(),
        user_id: Some("u1".to_string()),
        item_id: "".to_string(),
        share_channel: Some("twitter".to_string()),
        actor_user_id: None,
    };
    let result = service.validate_share_event(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-item");
}

#[test]
fn validate_share_event_valid_passes() {
    let service = NewsFeedPersonalizationService::new();
    let cmd = ShareEventCommand {
        tenant_id: "t1".to_string(),
        user_id: Some("u1".to_string()),
        item_id: "item1".to_string(),
        share_channel: Some("twitter".to_string()),
        actor_user_id: Some("u1".to_string()),
    };
    assert!(service.validate_share_event(&cmd).is_ok());
}

#[test]
fn compute_next_cursor_returns_cursor_when_at_limit() {
    use sdkwork_content_news_service::service::feed_personalization_service::FeedItem;
    let items = vec![
        FeedItem {
            item_id: "i1".to_string(),
            score: 100,
            reason_code: "interest".to_string(),
        },
        FeedItem {
            item_id: "i2".to_string(),
            score: 90,
            reason_code: "trending".to_string(),
        },
    ];
    let cursor = NewsFeedPersonalizationService::compute_next_cursor(&items, 2);
    assert_eq!(cursor, Some("i2".to_string()));
}

#[test]
fn compute_next_cursor_returns_none_when_below_limit() {
    use sdkwork_content_news_service::service::feed_personalization_service::FeedItem;
    let items = vec![FeedItem {
        item_id: "i1".to_string(),
        score: 100,
        reason_code: "interest".to_string(),
    }];
    let cursor = NewsFeedPersonalizationService::compute_next_cursor(&items, 10);
    assert_eq!(cursor, None);
}

#[test]
fn compute_next_cursor_returns_none_for_empty() {
    let items = vec![];
    let cursor = NewsFeedPersonalizationService::compute_next_cursor(&items, 10);
    assert_eq!(cursor, None);
}
