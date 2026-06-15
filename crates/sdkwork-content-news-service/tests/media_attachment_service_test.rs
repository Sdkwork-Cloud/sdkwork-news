mod test_helpers;

use sdkwork_content_news_service::service::media_attachment_service::{
    AttachDriveMediaCommand, NewsMediaAttachmentService,
};

#[tokio::test]
async fn attach_media_requires_tenant_id() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsMediaAttachmentService::new(repo);
    let cmd = AttachDriveMediaCommand {
        tenant_id: "".to_string(),
        item_id: "item1".to_string(),
        media_id: "drive_node_123".to_string(),
        media_role: None,
        sort_order: None,
        actor_user_id: None,
    };
    let result = service.validate_attach_drive_media(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-tenant");
}

#[tokio::test]
async fn attach_media_requires_item_id() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsMediaAttachmentService::new(repo);
    let cmd = AttachDriveMediaCommand {
        tenant_id: "t1".to_string(),
        item_id: "".to_string(),
        media_id: "drive_node_123".to_string(),
        media_role: None,
        sort_order: None,
        actor_user_id: None,
    };
    let result = service.validate_attach_drive_media(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-item");
}

#[tokio::test]
async fn attach_media_requires_media_id() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsMediaAttachmentService::new(repo);
    let cmd = AttachDriveMediaCommand {
        tenant_id: "t1".to_string(),
        item_id: "item1".to_string(),
        media_id: "".to_string(),
        media_role: None,
        sort_order: None,
        actor_user_id: None,
    };
    let result = service.validate_attach_drive_media(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-media");
}

#[tokio::test]
async fn attach_media_requires_valid_role() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsMediaAttachmentService::new(repo);
    let cmd = AttachDriveMediaCommand {
        tenant_id: "t1".to_string(),
        item_id: "item1".to_string(),
        media_id: "drive_node_123".to_string(),
        media_role: Some("invalid_role".to_string()),
        sort_order: None,
        actor_user_id: None,
    };
    let result = service.validate_attach_drive_media(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/invalid-media-role");
}

#[tokio::test]
async fn attach_media_valid_roles_pass() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsMediaAttachmentService::new(repo);
    for role in &["hero", "thumbnail", "inline", "gallery", "video", "audio", "document", "embed"] {
        let cmd = AttachDriveMediaCommand {
            tenant_id: "t1".to_string(),
            item_id: "item1".to_string(),
            media_id: "drive_node_123".to_string(),
            media_role: Some(role.to_string()),
            sort_order: Some(0),
            actor_user_id: Some("user1".to_string()),
        };
        assert!(service.validate_attach_drive_media(&cmd).is_ok(), "role '{}' should be valid", role);
    }
}

#[tokio::test]
async fn attach_media_valid_command_passes() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsMediaAttachmentService::new(repo);
    let cmd = AttachDriveMediaCommand {
        tenant_id: "t1".to_string(),
        item_id: "item1".to_string(),
        media_id: "drive_node_123".to_string(),
        media_role: Some("hero".to_string()),
        sort_order: Some(0),
        actor_user_id: Some("user1".to_string()),
    };
    assert!(service.validate_attach_drive_media(&cmd).is_ok());
}

#[tokio::test]
async fn validate_media_reference_rejects_empty() {
    assert!(!NewsMediaAttachmentService::validate_media_reference(""));
}

#[tokio::test]
async fn validate_media_reference_rejects_http_url() {
    assert!(!NewsMediaAttachmentService::validate_media_reference("https://example.com/image.jpg"));
}

#[tokio::test]
async fn validate_media_reference_accepts_drive_id() {
    assert!(NewsMediaAttachmentService::validate_media_reference("drive_node_123"));
}

#[tokio::test]
async fn resolve_media_requires_media_id() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsMediaAttachmentService::new(repo);
    let result = service.validate_resolve_media("");
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-media");
}

#[tokio::test]
async fn resolve_media_valid_id_passes() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsMediaAttachmentService::new(repo);
    assert!(service.validate_resolve_media("media_123").is_ok());
}
