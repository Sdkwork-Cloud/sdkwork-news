pub struct NewsStoryService;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CreateStoryCommand {
    pub tenant_id: String,
    pub organization_id: Option<String>,
    pub title: String,
    pub slug: Option<String>,
    pub summary: Option<String>,
    pub story_type: Option<String>,
    pub locale: Option<String>,
    pub region: Option<String>,
    pub actor_user_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UpdateStoryCommand {
    pub title: Option<String>,
    pub summary: Option<String>,
    pub story_type: Option<String>,
    pub locale: Option<String>,
    pub region: Option<String>,
    pub expected_version: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PublishStoryCommand {
    pub actor_user_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AttachStoryItemCommand {
    pub item_id: String,
    pub relation_type: Option<String>,
    pub rank: Option<i64>,
    pub pinned: Option<bool>,
    pub note: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StoryResult {
    pub id: String,
    pub status: String,
    pub message: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StoryError {
    pub code: &'static str,
    pub message: String,
}

impl std::fmt::Display for StoryError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for StoryError {}

impl NewsStoryService {
    pub fn new() -> Self {
        Self
    }

    pub fn validate_create_story(&self, command: &CreateStoryCommand) -> Result<(), StoryError> {
        if command.tenant_id.trim().is_empty() {
            return Err(StoryError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if command.title.trim().is_empty() {
            return Err(StoryError {
                code: "validation/missing-title",
                message: "title is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn generate_slug(title: &str) -> String {
        let slug: String = title
            .to_ascii_lowercase()
            .replace(' ', "-")
            .chars()
            .filter(|c| c.is_alphanumeric() || *c == '-')
            .collect();
        let mut result = String::new();
        let mut prev_dash = false;
        for c in slug.chars() {
            if c == '-' {
                if !prev_dash {
                    result.push(c);
                }
                prev_dash = true;
            } else {
                result.push(c);
                prev_dash = false;
            }
        }
        result.trim_matches('-').to_string()
    }

    pub fn validate_update_story(&self, command: &UpdateStoryCommand) -> Result<(), StoryError> {
        if command.expected_version < 0 {
            return Err(StoryError {
                code: "validation/invalid-version",
                message: "expected_version must be non-negative".to_string(),
            });
        }
        Ok(())
    }

    pub fn validate_publish_story(&self, story_status: &str) -> Result<(), StoryError> {
        match story_status {
            "draft" | "review" => Ok(()),
            "published" => Err(StoryError {
                code: "conflict/already-published",
                message: "story is already published".to_string(),
            }),
            "closed" => Err(StoryError {
                code: "conflict/story-closed",
                message: "cannot publish a closed story".to_string(),
            }),
            _ => Err(StoryError {
                code: "conflict/invalid-transition",
                message: format!("cannot publish story with status '{}'", story_status),
            }),
        }
    }

    pub fn validate_attach_item(
        &self,
        story_status: &str,
        command: &AttachStoryItemCommand,
    ) -> Result<(), StoryError> {
        if command.item_id.trim().is_empty() {
            return Err(StoryError {
                code: "validation/missing-item",
                message: "item_id is required".to_string(),
            });
        }
        if story_status == "closed" {
            return Err(StoryError {
                code: "conflict/story-closed",
                message: "cannot attach items to a closed story".to_string(),
            });
        }
        Ok(())
    }

    pub fn determine_timeline_type(story_status: &str, new_status: &str) -> &'static str {
        match (story_status, new_status) {
            ("draft", "published") => "publish",
            ("draft", "review") => "submit_review",
            ("review", "published") => "approve_publish",
            (_, "closed") => "close",
            _ => "update",
        }
    }
}

impl Default for NewsStoryService {
    fn default() -> Self {
        Self::new()
    }
}
