use crate::repository::professional_repository::{NewsProfessionalRepository, NewNewsItemRights, NewNewsC2paProvenance};

pub struct NewsTrustService {
    repo: NewsProfessionalRepository,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UpsertItemRightsCommand {
    pub tenant_id: String,
    pub item_id: String,
    pub rights_status: String,
    pub copyright_holder: Option<String>,
    pub license_code: Option<String>,
    pub embargo_until: Option<String>,
    pub usage_terms: Option<String>,
    pub geography_scope: Option<String>,
    pub actor_user_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UpsertC2paProvenanceCommand {
    pub tenant_id: String,
    pub item_id: String,
    pub provenance_status: String,
    pub manifest_uri: Option<String>,
    pub manifest_hash: Option<String>,
    pub signer: Option<String>,
    pub actor_user_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TrustResult {
    pub id: String,
    pub status: String,
    pub message: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TrustError {
    pub code: &'static str,
    pub message: String,
}

impl std::fmt::Display for TrustError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for TrustError {}

const VALID_RIGHTS_STATUSES: &[&str] = &[
    "draft",
    "cleared",
    "restricted",
    "embargoed",
    "licensed",
    "public_domain",
];

const VALID_PROVENANCE_STATUSES: &[&str] =
    &["unverified", "verified", "failed", "tampered", "expired"];

impl NewsTrustService {
    pub fn new(repo: NewsProfessionalRepository) -> Self {
        Self { repo }
    }

    pub fn validate_upsert_rights(
        &self,
        command: &UpsertItemRightsCommand,
    ) -> Result<(), TrustError> {
        if command.tenant_id.trim().is_empty() {
            return Err(TrustError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if command.item_id.trim().is_empty() {
            return Err(TrustError {
                code: "validation/missing-item",
                message: "item_id is required".to_string(),
            });
        }
        if !VALID_RIGHTS_STATUSES.contains(&command.rights_status.as_str()) {
            return Err(TrustError {
                code: "validation/invalid-rights-status",
                message: format!(
                    "rights_status must be one of: {}",
                    VALID_RIGHTS_STATUSES.join(", ")
                ),
            });
        }
        Ok(())
    }

    pub async fn upsert_item_rights(
        &self,
        command: UpsertItemRightsCommand,
        now: &str,
    ) -> Result<TrustResult, TrustError> {
        self.validate_upsert_rights(&command)?;

        let input = NewNewsItemRights {
            id: uuid::Uuid::new_v4().to_string(),
            tenant_id: command.tenant_id,
            item_id: command.item_id.clone(),
            rights_status: command.rights_status,
            copyright_holder: command.copyright_holder,
            license_code: command.license_code,
            embargo_until: command.embargo_until,
            usage_terms: command.usage_terms,
            geography_scope: command.geography_scope,
            now: now.to_string(),
        };

        self.repo.upsert_item_rights(input).await.map_err(|e| TrustError {
            code: "storage/error",
            message: e.to_string(),
        })?;

        Ok(TrustResult {
            id: command.item_id,
            status: "upserted".to_string(),
            message: Some("Item rights upserted successfully".to_string()),
        })
    }

    pub fn validate_upsert_c2pa_provenance(
        &self,
        command: &UpsertC2paProvenanceCommand,
    ) -> Result<(), TrustError> {
        if command.tenant_id.trim().is_empty() {
            return Err(TrustError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if command.item_id.trim().is_empty() {
            return Err(TrustError {
                code: "validation/missing-item",
                message: "item_id is required".to_string(),
            });
        }
        if !VALID_PROVENANCE_STATUSES.contains(&command.provenance_status.as_str()) {
            return Err(TrustError {
                code: "validation/invalid-provenance-status",
                message: format!(
                    "provenance_status must be one of: {}",
                    VALID_PROVENANCE_STATUSES.join(", ")
                ),
            });
        }
        if command.provenance_status == "verified"
            && (command.manifest_hash.is_none()
                || command.manifest_hash.as_deref().unwrap_or("").is_empty())
        {
            return Err(TrustError {
                code: "validation/missing-manifest-hash",
                message: "manifest_hash is required when provenance_status is 'verified'"
                    .to_string(),
            });
        }
        Ok(())
    }

    pub async fn upsert_c2pa_provenance(
        &self,
        command: UpsertC2paProvenanceCommand,
        now: &str,
    ) -> Result<TrustResult, TrustError> {
        self.validate_upsert_c2pa_provenance(&command)?;

        let input = NewNewsC2paProvenance {
            id: uuid::Uuid::new_v4().to_string(),
            tenant_id: command.tenant_id,
            item_id: command.item_id.clone(),
            media_id: None,
            provenance_status: command.provenance_status,
            manifest_uri: command.manifest_uri,
            manifest_hash: command.manifest_hash,
            signer: command.signer,
            now: now.to_string(),
        };

        self.repo.upsert_c2pa_provenance(input).await.map_err(|e| TrustError {
            code: "storage/error",
            message: e.to_string(),
        })?;

        Ok(TrustResult {
            id: command.item_id,
            status: "upserted".to_string(),
            message: Some("C2PA provenance upserted successfully".to_string()),
        })
    }

    pub fn compute_risk_level(
        source_trust_score: Option<i64>,
        fact_check_verdict: Option<&str>,
        correction_count: i64,
    ) -> &'static str {
        let trust = source_trust_score.unwrap_or(50);
        match (trust, fact_check_verdict, correction_count) {
            (0..=20, _, _) => "high",
            (_, Some("false"), _) => "high",
            (_, _, c) if c >= 3 => "high",
            (21..=40, _, _) => "medium",
            (_, Some("mixed"), _) => "medium",
            (_, _, c) if c >= 1 => "medium",
            _ => "low",
        }
    }
}
