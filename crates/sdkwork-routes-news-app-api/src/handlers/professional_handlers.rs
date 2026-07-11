pub struct NewsProfessionalAppApiHandler;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ListFollowingFeedRequest {
    pub tenant_id: String,
    pub user_id: String,
    pub organization_id: Option<String>,
    pub cursor: Option<String>,
    pub page_size: Option<i64>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RecordReadingProgressRequest {
    pub tenant_id: String,
    pub user_id: String,
    pub item_id: String,
    pub progress_percent: Option<i64>,
    pub dwell_ms: Option<i64>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AppApiFeedResponse {
    pub items: Vec<AppApiFeedItem>,
    pub next_cursor: Option<String>,
    pub has_more: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AppApiFeedItem {
    pub item_id: String,
    pub title: String,
    pub summary: String,
    pub score: i64,
    pub reason_code: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AppApiReadingProgressResponse {
    pub item_id: String,
    pub status: String,
    pub message: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AppApiError {
    pub status: i32,
    pub title: String,
    pub detail: String,
}

impl std::fmt::Display for AppApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "[{}] {}: {}", self.status, self.title, self.detail)
    }
}

impl std::error::Error for AppApiError {}

impl NewsProfessionalAppApiHandler {
    pub fn new() -> Self {
        Self
    }

    pub fn validate_list_following_feed(
        &self,
        request: &ListFollowingFeedRequest,
    ) -> Result<(), AppApiError> {
        if request.tenant_id.trim().is_empty() {
            return Err(AppApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "tenant_id is required".to_string(),
            });
        }
        if request.user_id.trim().is_empty() {
            return Err(AppApiError {
                status: 401,
                title: "Unauthorized".to_string(),
                detail: "user_id is required from authenticated context".to_string(),
            });
        }
        if let Some(limit) = request.page_size {
            if limit <= 0 || limit > 100 {
                return Err(AppApiError {
                    status: 400,
                    title: "Bad Request".to_string(),
                    detail: "limit must be between 1 and 100".to_string(),
                });
            }
        }
        Ok(())
    }

    pub fn validate_record_reading_progress(
        &self,
        request: &RecordReadingProgressRequest,
    ) -> Result<(), AppApiError> {
        if request.tenant_id.trim().is_empty() {
            return Err(AppApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "tenant_id is required".to_string(),
            });
        }
        if request.user_id.trim().is_empty() {
            return Err(AppApiError {
                status: 401,
                title: "Unauthorized".to_string(),
                detail: "user_id is required from authenticated context".to_string(),
            });
        }
        if request.item_id.trim().is_empty() {
            return Err(AppApiError {
                status: 400,
                title: "Bad Request".to_string(),
                detail: "item_id is required".to_string(),
            });
        }
        if let Some(progress) = request.progress_percent {
            if !(0..=100).contains(&progress) {
                return Err(AppApiError {
                    status: 400,
                    title: "Bad Request".to_string(),
                    detail: "progress_percent must be between 0 and 100".to_string(),
                });
            }
        }
        Ok(())
    }

    pub fn resolve_limit(request_limit: Option<i64>) -> i64 {
        request_limit.unwrap_or(20).clamp(1, 100)
    }

    pub fn resolve_default_cursor() -> String {
        String::new()
    }
}

impl Default for NewsProfessionalAppApiHandler {
    fn default() -> Self {
        Self::new()
    }
}
