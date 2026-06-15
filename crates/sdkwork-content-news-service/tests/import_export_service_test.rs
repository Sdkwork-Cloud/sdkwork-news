mod test_helpers;

use sdkwork_content_news_service::service::import_export_service::{
    ExportCommand, ImportNewsmlG2Command, ImportNinjsCommand, NewsImportExportService,
};

#[tokio::test]
async fn import_ninjs_requires_tenant_id() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsImportExportService::new(repo);
    let cmd = ImportNinjsCommand {
        tenant_id: "".to_string(),
        organization_id: None,
        source_id: None,
        provider: None,
        payload: r#"{"headlines":[{"value":"Test"}]}"#.to_string(),
        actor_user_id: None,
    };
    let result = service.validate_import_ninjs(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-tenant");
}

#[tokio::test]
async fn import_ninjs_requires_payload() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsImportExportService::new(repo);
    let cmd = ImportNinjsCommand {
        tenant_id: "t1".to_string(),
        organization_id: None,
        source_id: None,
        provider: None,
        payload: "".to_string(),
        actor_user_id: None,
    };
    let result = service.validate_import_ninjs(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-payload");
}

#[tokio::test]
async fn import_ninjs_valid_command_passes() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsImportExportService::new(repo);
    let cmd = ImportNinjsCommand {
        tenant_id: "t1".to_string(),
        organization_id: Some("org1".to_string()),
        source_id: Some("source1".to_string()),
        provider: Some("reuters".to_string()),
        payload: r#"{"headlines":[{"value":"Breaking News"}],"body_text":"Content here"}"#.to_string(),
        actor_user_id: Some("user1".to_string()),
    };
    assert!(service.validate_import_ninjs(&cmd).is_ok());
}

#[tokio::test]
async fn import_newsml_g2_requires_tenant_id() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsImportExportService::new(repo);
    let cmd = ImportNewsmlG2Command {
        tenant_id: "".to_string(),
        organization_id: None,
        source_id: None,
        provider: None,
        payload: "<newsItem></newsItem>".to_string(),
        actor_user_id: None,
    };
    let result = service.validate_import_newsml_g2(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-tenant");
}

#[tokio::test]
async fn import_newsml_g2_requires_payload() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsImportExportService::new(repo);
    let cmd = ImportNewsmlG2Command {
        tenant_id: "t1".to_string(),
        organization_id: None,
        source_id: None,
        provider: None,
        payload: "".to_string(),
        actor_user_id: None,
    };
    let result = service.validate_import_newsml_g2(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-payload");
}

#[tokio::test]
async fn import_newsml_g2_valid_command_passes() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsImportExportService::new(repo);
    let cmd = ImportNewsmlG2Command {
        tenant_id: "t1".to_string(),
        organization_id: Some("org1".to_string()),
        source_id: None,
        provider: Some("associated-press".to_string()),
        payload: "<newsItem><itemMeta><uri>ap:123</uri></itemMeta></newsItem>".to_string(),
        actor_user_id: None,
    };
    assert!(service.validate_import_newsml_g2(&cmd).is_ok());
}

#[tokio::test]
async fn export_requires_tenant_id() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsImportExportService::new(repo);
    let cmd = ExportCommand {
        tenant_id: "".to_string(),
        organization_id: None,
        format: "ninjs".to_string(),
        filter_json: None,
        destination_uri: None,
        actor_user_id: None,
    };
    let result = service.validate_export(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-tenant");
}

#[tokio::test]
async fn export_requires_valid_format() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsImportExportService::new(repo);
    let cmd = ExportCommand {
        tenant_id: "t1".to_string(),
        organization_id: None,
        format: "invalid_format".to_string(),
        filter_json: None,
        destination_uri: None,
        actor_user_id: None,
    };
    let result = service.validate_export(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/unsupported-format");
}

#[tokio::test]
async fn export_ninjs_valid_command_passes() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsImportExportService::new(repo);
    let cmd = ExportCommand {
        tenant_id: "t1".to_string(),
        organization_id: Some("org1".to_string()),
        format: "ninjs".to_string(),
        filter_json: Some(r#"{"status":"published"}"#.to_string()),
        destination_uri: Some("s3://bucket/export/".to_string()),
        actor_user_id: Some("user1".to_string()),
    };
    assert!(service.validate_export(&cmd).is_ok());
}

#[tokio::test]
async fn export_schema_org_valid_command_passes() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsImportExportService::new(repo);
    let cmd = ExportCommand {
        tenant_id: "t1".to_string(),
        organization_id: None,
        format: "schema_org".to_string(),
        filter_json: None,
        destination_uri: None,
        actor_user_id: None,
    };
    assert!(service.validate_export(&cmd).is_ok());
}

#[tokio::test]
async fn compute_payload_hash_deterministic() {
    let hash1 = NewsImportExportService::compute_payload_hash("test payload");
    let hash2 = NewsImportExportService::compute_payload_hash("test payload");
    assert_eq!(hash1, hash2);
}

#[tokio::test]
async fn compute_payload_hash_different_for_different_input() {
    let hash1 = NewsImportExportService::compute_payload_hash("payload1");
    let hash2 = NewsImportExportService::compute_payload_hash("payload2");
    assert_ne!(hash1, hash2);
}

#[tokio::test]
async fn compute_idempotency_key_format() {
    let key = NewsImportExportService::compute_idempotency_key("t1", "ninjs", "hash123");
    assert!(key.contains("t1"));
    assert!(key.contains("ninjs"));
    assert!(key.contains("hash123"));
}
