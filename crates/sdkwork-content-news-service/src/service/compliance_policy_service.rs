use crate::repository::professional_repository::NewsProfessionalRepository;

pub struct NewsCompliancePolicyService {
    repo: NewsProfessionalRepository,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ApplyLegalHoldCommand {
    pub tenant_id: String,
    pub hold_reason: String,
    pub applies_to: String,
    pub reference_ids: Option<String>,
    pub expires_at: Option<String>,
    pub actor_user_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EvaluateRetentionPolicyCommand {
    pub tenant_id: String,
    pub target_type: String,
    pub target_id: String,
    pub actor_user_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ComplianceResult {
    pub id: String,
    pub status: String,
    pub can_delete: bool,
    pub can_archive: bool,
    pub message: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ComplianceError {
    pub code: &'static str,
    pub message: String,
}

impl std::fmt::Display for ComplianceError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for ComplianceError {}

impl NewsCompliancePolicyService {
    pub fn new(repo: NewsProfessionalRepository) -> Self {
        Self { repo }
    }

    pub fn validate_apply_legal_hold(
        &self,
        command: &ApplyLegalHoldCommand,
    ) -> Result<(), ComplianceError> {
        if command.tenant_id.trim().is_empty() {
            return Err(ComplianceError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if command.hold_reason.trim().is_empty() {
            return Err(ComplianceError {
                code: "validation/missing-reason",
                message: "hold_reason is required".to_string(),
            });
        }
        if command.applies_to.trim().is_empty() {
            return Err(ComplianceError {
                code: "validation/missing-target",
                message: "applies_to is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn validate_evaluate_retention(
        &self,
        command: &EvaluateRetentionPolicyCommand,
    ) -> Result<(), ComplianceError> {
        if command.tenant_id.trim().is_empty() {
            return Err(ComplianceError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if command.target_type.trim().is_empty() {
            return Err(ComplianceError {
                code: "validation/missing-target-type",
                message: "target_type is required".to_string(),
            });
        }
        if command.target_id.trim().is_empty() {
            return Err(ComplianceError {
                code: "validation/missing-target-id",
                message: "target_id is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn evaluate_deletion_eligibility(
        &self,
        has_legal_hold: bool,
        retention_expired: bool,
        _is_archived: bool,
    ) -> (bool, bool) {
        let can_delete = !has_legal_hold && retention_expired;
        let can_archive = !has_legal_hold;
        (can_delete, can_archive)
    }

    pub fn compute_retention_expiry(created_at: &str, retention_days: i64) -> String {
        format!("{}+{}d", created_at, retention_days)
    }

    pub fn repo(&self) -> &NewsProfessionalRepository {
        &self.repo
    }
}
