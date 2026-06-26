pub struct NewsProfessionalBackendApiHandler;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CreateStoryRequest {
    pub tenant_id: String,
    pub organization_id: Option<String>,
    pub title: String,
    pub slug: Option<String>,
    pub summary: Option<String>,
    pub story_type: Option<String>,
    pub locale: Option<String>,
    pub region: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CreateImportJobRequest {
    pub tenant_id: String,
    pub organization_id: Option<String>,
    pub source_format: String,
    pub source_url: Option<String>,
    pub source_id: Option<String>,
    pub provider: Option<String>,
    pub payload: String,
    pub idempotency_key: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ListApiOperationAuditsRequest {
    pub tenant_id: String,
    pub operation_id: Option<String>,
    pub surface: Option<String>,
    pub cursor: Option<String>,
    pub limit: Option<i64>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BackendApiStoryResponse {
    pub id: String,
    pub status: String,
    pub message: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BackendApiImportResponse {
    pub id: String,
    pub status: String,
    pub message: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BackendApiAuditListResponse {
    pub items: Vec<BackendApiAuditItem>,
    pub next_cursor: Option<String>,
    pub has_more: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BackendApiAuditItem {
    pub id: String,
    pub surface: String,
    pub operation_id: String,
    pub method: String,
    pub path: String,
    pub status_code: Option<i64>,
    pub occurred_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BackendApiError {
    pub status: i32,
    pub title: String,
    pub detail: String,
}

impl std::fmt::Display for BackendApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "[{}] {}: {}", self.status, self.title, self.detail)
    }
}

impl std::error::Error for BackendApiError {}

impl NewsProfessionalBackendApiHandler {
    pub fn new() -> Self {
        Self
    }

    pub fn validate_create_story(
        &self,
        request: &CreateStoryRequest,
    ) -> Result<(), BackendApiError> {
        if request.tenant_id.trim().is_empty() {
            return Err(BackendApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "tenant_id is required".to_string(),
            });
        }
        if request.title.trim().is_empty() {
            return Err(BackendApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "title is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn validate_create_import_job(
        &self,
        request: &CreateImportJobRequest,
    ) -> Result<(), BackendApiError> {
        if request.tenant_id.trim().is_empty() {
            return Err(BackendApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "tenant_id is required".to_string(),
            });
        }
        if request.source_format.trim().is_empty() {
            return Err(BackendApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "source_format is required".to_string(),
            });
        }
        if !["ninjs", "newsml_g2"].contains(&request.source_format.as_str()) {
            return Err(BackendApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: format!("unsupported source_format: {}", request.source_format),
            });
        }
        if request.payload.trim().is_empty() {
            return Err(BackendApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "payload is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn validate_list_api_operation_audits(
        &self,
        request: &ListApiOperationAuditsRequest,
    ) -> Result<(), BackendApiError> {
        if request.tenant_id.trim().is_empty() {
            return Err(BackendApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "tenant_id is required".to_string(),
            });
        }
        if let Some(limit) = request.limit {
            if limit <= 0 || limit > 100 {
                return Err(BackendApiError {
                    status: 400,
                    title: "Bad Request".to_string(),
                    detail: "limit must be between 1 and 100".to_string(),
                });
            }
        }
        Ok(())
    }

    pub fn resolve_limit(request_limit: Option<i64>) -> i64 {
        request_limit.unwrap_or(50).clamp(1, 100)
    }

    pub fn compute_idempotency_key(
        request_key: Option<&str>,
        tenant_id: &str,
        format: &str,
        payload_hash: &str,
    ) -> String {
        request_key
            .filter(|k| !k.trim().is_empty())
            .map(|k| k.to_string())
            .unwrap_or_else(|| format!("import_{}_{}_{}", tenant_id, format, payload_hash))
    }
}

impl Default for NewsProfessionalBackendApiHandler {
    fn default() -> Self {
        Self::new()
    }
}
