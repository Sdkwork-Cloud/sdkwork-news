use sdkwork_content_news_service::service::media_attachment_service::{
    AttachDriveMediaCommand, NewsMediaAttachmentService,
};

#[test]
fn attach_media_requires_tenant_id() {
    let service = NewsMediaAttachmentService::new();
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

#[test]
fn attach_media_requires_item_id() {
    let service = NewsMediaAttachmentService::new();
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

#[test]
fn attach_media_requires_media_id() {
    let service = NewsMediaAttachmentService::new();
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

#[test]
fn attach_media_requires_valid_role() {
    let service = NewsMediaAttachmentService::new();
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

#[test]
fn attach_media_valid_roles_pass() {
    let service = NewsMediaAttachmentService::new();
    for role in &[
        "hero",
        "thumbnail",
        "inline",
        "gallery",
        "video",
        "audio",
        "document",
        "embed",
    ] {
        let cmd = AttachDriveMediaCommand {
            tenant_id: "t1".to_string(),
            item_id: "item1".to_string(),
            media_id: "drive_node_123".to_string(),
            media_role: Some(role.to_string()),
            sort_order: Some(0),
            actor_user_id: Some("user1".to_string()),
        };
        assert!(
            service.validate_attach_drive_media(&cmd).is_ok(),
            "role '{}' should be valid",
            role
        );
    }
}

#[test]
fn attach_media_valid_command_passes() {
    let service = NewsMediaAttachmentService::new();
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

#[test]
fn validate_media_reference_rejects_empty() {
    assert!(!NewsMediaAttachmentService::validate_media_reference(""));
}

#[test]
fn validate_media_reference_rejects_http_url() {
    assert!(!NewsMediaAttachmentService::validate_media_reference(
        "https://example.com/image.jpg"
    ));
}

#[test]
fn validate_media_reference_accepts_drive_id() {
    assert!(NewsMediaAttachmentService::validate_media_reference(
        "drive_node_123"
    ));
}

#[test]
fn resolve_media_requires_media_id() {
    let service = NewsMediaAttachmentService::new();
    let result = service.validate_resolve_media("");
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-media");
}

#[test]
fn resolve_media_valid_id_passes() {
    let service = NewsMediaAttachmentService::new();
    assert!(service.validate_resolve_media("media_123").is_ok());
}
