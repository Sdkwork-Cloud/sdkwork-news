mod test_helpers;

use sdkwork_content_news_service::service::trust_service::{
    NewsTrustService, UpsertC2paProvenanceCommand, UpsertItemRightsCommand,
};

#[tokio::test]
async fn upsert_rights_requires_tenant_id() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsTrustService::new(repo);
    let cmd = UpsertItemRightsCommand {
        tenant_id: "".to_string(),
        item_id: "item1".to_string(),
        rights_status: "cleared".to_string(),
        copyright_holder: None,
        license_code: None,
        embargo_until: None,
        usage_terms: None,
        geography_scope: None,
        actor_user_id: None,
    };
    let result = service.validate_upsert_rights(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-tenant");
}

#[tokio::test]
async fn upsert_rights_requires_item_id() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsTrustService::new(repo);
    let cmd = UpsertItemRightsCommand {
        tenant_id: "t1".to_string(),
        item_id: "".to_string(),
        rights_status: "cleared".to_string(),
        copyright_holder: None,
        license_code: None,
        embargo_until: None,
        usage_terms: None,
        geography_scope: None,
        actor_user_id: None,
    };
    let result = service.validate_upsert_rights(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-item");
}

#[tokio::test]
async fn upsert_rights_requires_valid_status() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsTrustService::new(repo);
    let cmd = UpsertItemRightsCommand {
        tenant_id: "t1".to_string(),
        item_id: "item1".to_string(),
        rights_status: "invalid".to_string(),
        copyright_holder: None,
        license_code: None,
        embargo_until: None,
        usage_terms: None,
        geography_scope: None,
        actor_user_id: None,
    };
    let result = service.validate_upsert_rights(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/invalid-rights-status");
}

#[tokio::test]
async fn upsert_rights_valid_statuses_pass() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsTrustService::new(repo);
    for status in &[
        "draft",
        "cleared",
        "restricted",
        "embargoed",
        "licensed",
        "public_domain",
    ] {
        let cmd = UpsertItemRightsCommand {
            tenant_id: "t1".to_string(),
            item_id: "item1".to_string(),
            rights_status: status.to_string(),
            copyright_holder: Some("Publisher".to_string()),
            license_code: Some("CC-BY-4.0".to_string()),
            embargo_until: None,
            usage_terms: Some("Attribution required".to_string()),
            geography_scope: Some("global".to_string()),
            actor_user_id: Some("user1".to_string()),
        };
        assert!(
            service.validate_upsert_rights(&cmd).is_ok(),
            "status '{}' should be valid",
            status
        );
    }
}

#[tokio::test]
async fn upsert_c2pa_requires_tenant_id() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsTrustService::new(repo);
    let cmd = UpsertC2paProvenanceCommand {
        tenant_id: "".to_string(),
        item_id: "item1".to_string(),
        provenance_status: "verified".to_string(),
        manifest_uri: None,
        manifest_hash: Some("abc123".to_string()),
        signer: None,
        actor_user_id: None,
    };
    let result = service.validate_upsert_c2pa_provenance(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-tenant");
}

#[tokio::test]
async fn upsert_c2pa_requires_item_id() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsTrustService::new(repo);
    let cmd = UpsertC2paProvenanceCommand {
        tenant_id: "t1".to_string(),
        item_id: "".to_string(),
        provenance_status: "verified".to_string(),
        manifest_uri: None,
        manifest_hash: Some("abc123".to_string()),
        signer: None,
        actor_user_id: None,
    };
    let result = service.validate_upsert_c2pa_provenance(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-item");
}

#[tokio::test]
async fn upsert_c2pa_requires_valid_status() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsTrustService::new(repo);
    let cmd = UpsertC2paProvenanceCommand {
        tenant_id: "t1".to_string(),
        item_id: "item1".to_string(),
        provenance_status: "invalid".to_string(),
        manifest_uri: None,
        manifest_hash: None,
        signer: None,
        actor_user_id: None,
    };
    let result = service.validate_upsert_c2pa_provenance(&cmd);
    assert!(result.is_err());
    assert_eq!(
        result.unwrap_err().code,
        "validation/invalid-provenance-status"
    );
}

#[tokio::test]
async fn upsert_c2pa_verified_requires_manifest_hash() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsTrustService::new(repo);
    let cmd = UpsertC2paProvenanceCommand {
        tenant_id: "t1".to_string(),
        item_id: "item1".to_string(),
        provenance_status: "verified".to_string(),
        manifest_uri: Some("https://example.com/manifest".to_string()),
        manifest_hash: None,
        signer: Some("signer1".to_string()),
        actor_user_id: None,
    };
    let result = service.validate_upsert_c2pa_provenance(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-manifest-hash");
}

#[tokio::test]
async fn upsert_c2pa_verified_with_hash_passes() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsTrustService::new(repo);
    let cmd = UpsertC2paProvenanceCommand {
        tenant_id: "t1".to_string(),
        item_id: "item1".to_string(),
        provenance_status: "verified".to_string(),
        manifest_uri: Some("https://example.com/manifest".to_string()),
        manifest_hash: Some("sha256:abc123".to_string()),
        signer: Some("signer1".to_string()),
        actor_user_id: Some("user1".to_string()),
    };
    assert!(service.validate_upsert_c2pa_provenance(&cmd).is_ok());
}

#[tokio::test]
async fn upsert_c2pa_unverified_passes_without_hash() {
    let repo = test_helpers::create_test_repo().await;
    let service = NewsTrustService::new(repo);
    let cmd = UpsertC2paProvenanceCommand {
        tenant_id: "t1".to_string(),
        item_id: "item1".to_string(),
        provenance_status: "unverified".to_string(),
        manifest_uri: None,
        manifest_hash: None,
        signer: None,
        actor_user_id: None,
    };
    assert!(service.validate_upsert_c2pa_provenance(&cmd).is_ok());
}

#[tokio::test]
async fn compute_risk_level_high_for_low_trust() {
    assert_eq!(
        NewsTrustService::compute_risk_level(Some(10), None, 0),
        "high"
    );
}

#[tokio::test]
async fn compute_risk_level_high_for_false_verdict() {
    assert_eq!(
        NewsTrustService::compute_risk_level(Some(90), Some("false"), 0),
        "high"
    );
}

#[tokio::test]
async fn compute_risk_level_high_for_many_corrections() {
    assert_eq!(
        NewsTrustService::compute_risk_level(Some(90), None, 5),
        "high"
    );
}

#[tokio::test]
async fn compute_risk_level_medium_for_moderate_trust() {
    assert_eq!(
        NewsTrustService::compute_risk_level(Some(30), None, 0),
        "medium"
    );
}

#[tokio::test]
async fn compute_risk_level_medium_for_mixed_verdict() {
    assert_eq!(
        NewsTrustService::compute_risk_level(Some(90), Some("mixed"), 0),
        "medium"
    );
}

#[tokio::test]
async fn compute_risk_level_medium_for_one_correction() {
    assert_eq!(
        NewsTrustService::compute_risk_level(Some(90), None, 1),
        "medium"
    );
}

#[tokio::test]
async fn compute_risk_level_low_for_high_trust() {
    assert_eq!(
        NewsTrustService::compute_risk_level(Some(90), None, 0),
        "low"
    );
}

#[tokio::test]
async fn compute_risk_level_low_for_default() {
    assert_eq!(NewsTrustService::compute_risk_level(None, None, 0), "low");
}
