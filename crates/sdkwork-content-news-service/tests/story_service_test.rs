use sdkwork_content_news_service::service::story_service::{
    AttachStoryItemCommand, CreateStoryCommand, NewsStoryService, UpdateStoryCommand,
};

#[test]
fn create_story_requires_tenant_id() {
    let service = NewsStoryService::new();
    let cmd = CreateStoryCommand {
        tenant_id: "".to_string(),
        organization_id: None,
        title: "Test".to_string(),
        slug: None,
        summary: None,
        story_type: None,
        locale: None,
        region: None,
        actor_user_id: None,
    };
    let result = service.validate_create_story(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-tenant");
}

#[test]
fn create_story_requires_title() {
    let service = NewsStoryService::new();
    let cmd = CreateStoryCommand {
        tenant_id: "t1".to_string(),
        organization_id: None,
        title: "  ".to_string(),
        slug: None,
        summary: None,
        story_type: None,
        locale: None,
        region: None,
        actor_user_id: None,
    };
    let result = service.validate_create_story(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-title");
}

#[test]
fn create_story_valid_command_passes() {
    let service = NewsStoryService::new();
    let cmd = CreateStoryCommand {
        tenant_id: "t1".to_string(),
        organization_id: Some("org1".to_string()),
        title: "Breaking News".to_string(),
        slug: Some("breaking-news".to_string()),
        summary: Some("Summary".to_string()),
        story_type: Some("developing".to_string()),
        locale: Some("en".to_string()),
        region: Some("US".to_string()),
        actor_user_id: Some("user1".to_string()),
    };
    assert!(service.validate_create_story(&cmd).is_ok());
}

#[test]
fn generate_slug_from_title() {
    assert_eq!(
        NewsStoryService::generate_slug("Hello World"),
        "hello-world"
    );
    assert_eq!(
        NewsStoryService::generate_slug("Special!@#Chars"),
        "specialchars"
    );
    assert_eq!(NewsStoryService::generate_slug("  spaces  "), "spaces");
}

#[test]
fn update_story_requires_non_negative_version() {
    let service = NewsStoryService::new();
    let cmd = UpdateStoryCommand {
        title: Some("Updated".to_string()),
        summary: None,
        story_type: None,
        locale: None,
        region: None,
        expected_version: -1,
    };
    let result = service.validate_update_story(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/invalid-version");
}

#[test]
fn update_story_valid_command_passes() {
    let service = NewsStoryService::new();
    let cmd = UpdateStoryCommand {
        title: Some("Updated".to_string()),
        summary: Some("New summary".to_string()),
        story_type: None,
        locale: None,
        region: None,
        expected_version: 1,
    };
    assert!(service.validate_update_story(&cmd).is_ok());
}

#[test]
fn publish_story_draft_can_be_published() {
    let service = NewsStoryService::new();
    assert!(service.validate_publish_story("draft").is_ok());
}

#[test]
fn publish_story_review_can_be_published() {
    let service = NewsStoryService::new();
    assert!(service.validate_publish_story("review").is_ok());
}

#[test]
fn publish_story_already_published_fails() {
    let service = NewsStoryService::new();
    let result = service.validate_publish_story("published");
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "conflict/already-published");
}

#[test]
fn publish_story_closed_fails() {
    let service = NewsStoryService::new();
    let result = service.validate_publish_story("closed");
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "conflict/story-closed");
}

#[test]
fn attach_item_requires_item_id() {
    let service = NewsStoryService::new();
    let cmd = AttachStoryItemCommand {
        item_id: "".to_string(),
        relation_type: None,
        rank: None,
        pinned: None,
        note: None,
    };
    let result = service.validate_attach_item("draft", &cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-item");
}

#[test]
fn attach_item_to_closed_story_fails() {
    let service = NewsStoryService::new();
    let cmd = AttachStoryItemCommand {
        item_id: "item1".to_string(),
        relation_type: Some("primary".to_string()),
        rank: Some(0),
        pinned: None,
        note: None,
    };
    let result = service.validate_attach_item("closed", &cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "conflict/story-closed");
}

#[test]
fn attach_item_to_draft_story_passes() {
    let service = NewsStoryService::new();
    let cmd = AttachStoryItemCommand {
        item_id: "item1".to_string(),
        relation_type: Some("primary".to_string()),
        rank: Some(0),
        pinned: None,
        note: None,
    };
    assert!(service.validate_attach_item("draft", &cmd).is_ok());
}

#[test]
fn determine_timeline_type_publish_transition() {
    assert_eq!(
        NewsStoryService::determine_timeline_type("draft", "published"),
        "publish"
    );
}

#[test]
fn determine_timeline_type_close_transition() {
    assert_eq!(
        NewsStoryService::determine_timeline_type("published", "closed"),
        "close"
    );
}

#[test]
fn determine_timeline_type_review_transition() {
    assert_eq!(
        NewsStoryService::determine_timeline_type("draft", "review"),
        "submit_review"
    );
}
