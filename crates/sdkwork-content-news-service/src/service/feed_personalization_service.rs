pub struct NewsFeedPersonalizationService;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FeedQuery {
    pub tenant_id: String,
    pub user_id: Option<String>,
    pub organization_id: Option<String>,
    pub region: Option<String>,
    pub locale: Option<String>,
    pub cursor: Option<String>,
    pub limit: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ShareEventCommand {
    pub tenant_id: String,
    pub user_id: Option<String>,
    pub item_id: String,
    pub share_channel: Option<String>,
    pub actor_user_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FeedResult {
    pub items: Vec<FeedItem>,
    pub next_cursor: Option<String>,
    pub has_more: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FeedItem {
    pub item_id: String,
    pub score: i64,
    pub reason_code: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PersonalizationError {
    pub code: &'static str,
    pub message: String,
}

impl std::fmt::Display for PersonalizationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for PersonalizationError {}

impl NewsFeedPersonalizationService {
    pub fn new() -> Self {
        Self
    }

    pub fn validate_feed_query(&self, query: &FeedQuery) -> Result<(), PersonalizationError> {
        if query.tenant_id.trim().is_empty() {
            return Err(PersonalizationError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if query.limit <= 0 || query.limit > 100 {
            return Err(PersonalizationError {
                code: "validation/invalid-limit",
                message: "limit must be between 1 and 100".to_string(),
            });
        }
        Ok(())
    }

    pub fn validate_share_event(
        &self,
        command: &ShareEventCommand,
    ) -> Result<(), PersonalizationError> {
        if command.tenant_id.trim().is_empty() {
            return Err(PersonalizationError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if command.item_id.trim().is_empty() {
            return Err(PersonalizationError {
                code: "validation/missing-item",
                message: "item_id is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn apply_region_targeting(
        &self,
        items: &mut [FeedItem],
        region: Option<&str>,
        locale: Option<&str>,
    ) {
        if region.is_some() || locale.is_some() {
            items.sort_by(|a, b| b.score.cmp(&a.score));
        }
    }

    pub fn compute_next_cursor(items: &[FeedItem], limit: i64) -> Option<String> {
        if items.len() >= limit as usize {
            items.last().map(|item| item.item_id.clone())
        } else {
            None
        }
    }
}

impl Default for NewsFeedPersonalizationService {
    fn default() -> Self {
        Self::new()
    }
}
