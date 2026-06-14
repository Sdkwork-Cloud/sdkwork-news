pub struct NewsExternalFeedPollingWorker;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PollFeedsRequest {
    pub tenant_id: String,
    pub now: String,
    pub max_feeds: Option<i64>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RetryFailedItemsRequest {
    pub tenant_id: String,
    pub feed_id: String,
    pub max_retries: Option<i64>,
    pub now: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FeedPollResult {
    pub feed_id: String,
    pub feed_url: String,
    pub items_found: i64,
    pub items_imported: i64,
    pub items_failed: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RetryResult {
    pub feed_id: String,
    pub items_retried: i64,
    pub items_succeeded: i64,
    pub items_failed: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PollingError {
    pub code: &'static str,
    pub message: String,
}

impl std::fmt::Display for PollingError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for PollingError {}

impl NewsExternalFeedPollingWorker {
    pub fn new() -> Self {
        Self
    }

    pub fn validate_poll_feeds(&self, request: &PollFeedsRequest) -> Result<(), PollingError> {
        if request.tenant_id.trim().is_empty() {
            return Err(PollingError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if request.now.trim().is_empty() {
            return Err(PollingError {
                code: "validation/missing-now",
                message: "now timestamp is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn validate_retry_failed(
        &self,
        request: &RetryFailedItemsRequest,
    ) -> Result<(), PollingError> {
        if request.tenant_id.trim().is_empty() {
            return Err(PollingError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if request.feed_id.trim().is_empty() {
            return Err(PollingError {
                code: "validation/missing-feed",
                message: "feed_id is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn compute_content_hash(content: &str) -> String {
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};
        let mut hasher = DefaultHasher::new();
        content.hash(&mut hasher);
        format!("{:016x}", hasher.finish())
    }

    pub fn should_retry(attempt_count: i64, max_retries: i64) -> bool {
        attempt_count < max_retries
    }

    pub fn compute_next_retry_delay(attempt_count: i64) -> i64 {
        (2i64.pow(attempt_count as u32)).min(3600)
    }

    pub fn resolve_max_feeds(request_max: Option<i64>) -> i64 {
        request_max.unwrap_or(10).clamp(1, 50)
    }

    pub fn resolve_max_retries(request_max: Option<i64>) -> i64 {
        request_max.unwrap_or(3).clamp(1, 10)
    }
}

impl Default for NewsExternalFeedPollingWorker {
    fn default() -> Self {
        Self::new()
    }
}
