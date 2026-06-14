use sdkwork_content_news_service::service::compliance_policy_service::{
    ApplyLegalHoldCommand, EvaluateRetentionPolicyCommand, NewsCompliancePolicyService,
};

#[test]
fn apply_legal_hold_requires_tenant_id() {
    let service = NewsCompliancePolicyService::new();
    let cmd = ApplyLegalHoldCommand {
        tenant_id: "".to_string(),
        hold_reason: "Litigation".to_string(),
        applies_to: "item".to_string(),
        reference_ids: None,
        expires_at: None,
        actor_user_id: None,
    };
    let result = service.validate_apply_legal_hold(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-tenant");
}

#[test]
fn apply_legal_hold_requires_reason() {
    let service = NewsCompliancePolicyService::new();
    let cmd = ApplyLegalHoldCommand {
        tenant_id: "t1".to_string(),
        hold_reason: "".to_string(),
        applies_to: "item".to_string(),
        reference_ids: None,
        expires_at: None,
        actor_user_id: None,
    };
    let result = service.validate_apply_legal_hold(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-reason");
}

#[test]
fn apply_legal_hold_requires_target() {
    let service = NewsCompliancePolicyService::new();
    let cmd = ApplyLegalHoldCommand {
        tenant_id: "t1".to_string(),
        hold_reason: "Litigation".to_string(),
        applies_to: "".to_string(),
        reference_ids: None,
        expires_at: None,
        actor_user_id: None,
    };
    let result = service.validate_apply_legal_hold(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-target");
}

#[test]
fn apply_legal_hold_valid_command_passes() {
    let service = NewsCompliancePolicyService::new();
    let cmd = ApplyLegalHoldCommand {
        tenant_id: "t1".to_string(),
        hold_reason: "Pending litigation case #123".to_string(),
        applies_to: "story".to_string(),
        reference_ids: Some("story1,story2".to_string()),
        expires_at: Some("2027-12-31T23:59:59Z".to_string()),
        actor_user_id: Some("legal1".to_string()),
    };
    assert!(service.validate_apply_legal_hold(&cmd).is_ok());
}

#[test]
fn evaluate_retention_requires_tenant_id() {
    let service = NewsCompliancePolicyService::new();
    let cmd = EvaluateRetentionPolicyCommand {
        tenant_id: "".to_string(),
        target_type: "item".to_string(),
        target_id: "item1".to_string(),
        actor_user_id: None,
    };
    let result = service.validate_evaluate_retention(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-tenant");
}

#[test]
fn evaluate_retention_requires_target_type() {
    let service = NewsCompliancePolicyService::new();
    let cmd = EvaluateRetentionPolicyCommand {
        tenant_id: "t1".to_string(),
        target_type: "".to_string(),
        target_id: "item1".to_string(),
        actor_user_id: None,
    };
    let result = service.validate_evaluate_retention(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-target-type");
}

#[test]
fn evaluate_retention_requires_target_id() {
    let service = NewsCompliancePolicyService::new();
    let cmd = EvaluateRetentionPolicyCommand {
        tenant_id: "t1".to_string(),
        target_type: "item".to_string(),
        target_id: "".to_string(),
        actor_user_id: None,
    };
    let result = service.validate_evaluate_retention(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-target-id");
}

#[test]
fn evaluate_retention_valid_command_passes() {
    let service = NewsCompliancePolicyService::new();
    let cmd = EvaluateRetentionPolicyCommand {
        tenant_id: "t1".to_string(),
        target_type: "story".to_string(),
        target_id: "story1".to_string(),
        actor_user_id: Some("compliance1".to_string()),
    };
    assert!(service.validate_evaluate_retention(&cmd).is_ok());
}

#[test]
fn evaluate_deletion_eligibility_with_legal_hold() {
    let service = NewsCompliancePolicyService::new();
    let (can_delete, can_archive) = service.evaluate_deletion_eligibility(true, true, true);
    assert!(!can_delete);
    assert!(!can_archive);
}

#[test]
fn evaluate_deletion_eligibility_without_hold_retention_expired() {
    let service = NewsCompliancePolicyService::new();
    let (can_delete, can_archive) = service.evaluate_deletion_eligibility(false, true, false);
    assert!(can_delete);
    assert!(can_archive);
}

#[test]
fn evaluate_deletion_eligibility_without_hold_retention_not_expired() {
    let service = NewsCompliancePolicyService::new();
    let (can_delete, can_archive) = service.evaluate_deletion_eligibility(false, false, true);
    assert!(!can_delete);
    assert!(can_archive);
}

#[test]
fn evaluate_deletion_eligibility_archived_no_hold() {
    let service = NewsCompliancePolicyService::new();
    let (can_delete, can_archive) = service.evaluate_deletion_eligibility(false, true, true);
    assert!(can_delete);
    assert!(can_archive);
}

#[test]
fn compute_retention_expiry_format() {
    let expiry = NewsCompliancePolicyService::compute_retention_expiry("2026-01-01T00:00:00Z", 365);
    assert!(expiry.contains("2026-01-01T00:00:00Z"));
    assert!(expiry.contains("365"));
}

#[test]
fn compute_retention_expiry_zero_days() {
    let expiry = NewsCompliancePolicyService::compute_retention_expiry("2026-06-01T00:00:00Z", 0);
    assert!(expiry.contains("+0d"));
}
