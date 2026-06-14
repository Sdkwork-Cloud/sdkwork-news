pub struct NewsSearchProjectionWorker;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProjectionRebuildRequest {
    pub tenant_id: String,
    pub item_id: String,
    pub source_version: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProjectionDriftCheckRequest {
    pub tenant_id: String,
    pub item_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProjectionResult {
    pub item_id: String,
    pub schema_org_version: i64,
    pub search_version: i64,
    pub canonical_url: Option<String>,
    pub cdn_invalidation_queued: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DriftReport {
    pub item_id: String,
    pub has_drift: bool,
    pub source_version: i64,
    pub projection_version: i64,
    pub drift_details: Vec<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProjectionError {
    pub code: &'static str,
    pub message: String,
}

impl std::fmt::Display for ProjectionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for ProjectionError {}

impl NewsSearchProjectionWorker {
    pub fn new() -> Self {
        Self
    }

    pub fn validate_rebuild_request(
        &self,
        request: &ProjectionRebuildRequest,
    ) -> Result<(), ProjectionError> {
        if request.tenant_id.trim().is_empty() {
            return Err(ProjectionError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if request.item_id.trim().is_empty() {
            return Err(ProjectionError {
                code: "validation/missing-item",
                message: "item_id is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn validate_drift_check(
        &self,
        request: &ProjectionDriftCheckRequest,
    ) -> Result<(), ProjectionError> {
        if request.tenant_id.trim().is_empty() {
            return Err(ProjectionError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if request.item_id.trim().is_empty() {
            return Err(ProjectionError {
                code: "validation/missing-item",
                message: "item_id is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn build_schema_org_json_ld(
        item_id: &str,
        title: &str,
        summary: &str,
        published_at: Option<&str>,
        author_name: Option<&str>,
    ) -> String {
        let mut parts = vec![
            format!(r#""@type": "NewsArticle""#),
            format!(r#""@id": "{}""#, item_id),
            format!(r#""headline": "{}""#, title.replace('"', "\\\"")),
            format!(r#""description": "{}""#, summary.replace('"', "\\\"")),
        ];
        if let Some(at) = published_at {
            parts.push(format!(r#""datePublished": "{}""#, at));
        }
        if let Some(author) = author_name {
            parts.push(format!(
                r#""author": {{"@type": "Person", "name": "{}"}}"#,
                author.replace('"', "\\\"")
            ));
        }
        format!("{{{}}}", parts.join(", "))
    }

    pub fn compute_drift_report(
        item_id: &str,
        source_version: i64,
        projection_version: i64,
    ) -> DriftReport {
        let has_drift = source_version != projection_version;
        let mut drift_details = Vec::new();
        if has_drift {
            drift_details.push(format!(
                "source_version={} != projection_version={}",
                source_version, projection_version
            ));
        }
        DriftReport {
            item_id: item_id.to_string(),
            has_drift,
            source_version,
            projection_version,
            drift_details,
        }
    }

    pub fn should_invalidate_cdn(old_status: &str, new_status: &str) -> bool {
        old_status != new_status
    }
}

impl Default for NewsSearchProjectionWorker {
    fn default() -> Self {
        Self::new()
    }
}
