pub struct NewsEditorialWorkflowService;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CreateAssignmentCommand {
    pub tenant_id: String,
    pub item_id: Option<String>,
    pub story_id: Option<String>,
    pub assignee_user_id: String,
    pub assignment_role: String,
    pub due_at: Option<String>,
    pub created_by_user_id: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct UpdateAssignmentCommand {
    pub status: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DecideReviewTaskCommand {
    pub decision: String,
    pub decision_reason: Option<String>,
    pub reviewer_user_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EditorialResult {
    pub id: String,
    pub status: String,
    pub message: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EditorialError {
    pub code: &'static str,
    pub message: String,
}

impl std::fmt::Display for EditorialError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl std::error::Error for EditorialError {}

const VALID_ASSIGNMENT_ROLES: &[&str] = &[
    "writer",
    "editor",
    "reviewer",
    "photographer",
    "videographer",
    "fact_checker",
];

const VALID_ASSIGNMENT_STATUSES: &[&str] = &["open", "in_progress", "done", "cancelled"];

const VALID_REVIEW_DECISIONS: &[&str] = &["approved", "rejected", "changes_requested"];

impl NewsEditorialWorkflowService {
    pub fn new() -> Self {
        Self
    }

    pub fn validate_create_assignment(
        &self,
        command: &CreateAssignmentCommand,
    ) -> Result<(), EditorialError> {
        if command.tenant_id.trim().is_empty() {
            return Err(EditorialError {
                code: "validation/missing-tenant",
                message: "tenant_id is required".to_string(),
            });
        }
        if command.assignee_user_id.trim().is_empty() {
            return Err(EditorialError {
                code: "validation/missing-assignee",
                message: "assignee_user_id is required".to_string(),
            });
        }
        if !VALID_ASSIGNMENT_ROLES.contains(&command.assignment_role.as_str()) {
            return Err(EditorialError {
                code: "validation/invalid-role",
                message: format!(
                    "assignment_role must be one of: {}",
                    VALID_ASSIGNMENT_ROLES.join(", ")
                ),
            });
        }
        if command.item_id.is_none() && command.story_id.is_none() {
            return Err(EditorialError {
                code: "validation/missing-target",
                message: "either item_id or story_id is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn validate_update_assignment(&self, status: &str) -> Result<(), EditorialError> {
        if !VALID_ASSIGNMENT_STATUSES.contains(&status) {
            return Err(EditorialError {
                code: "validation/invalid-status",
                message: format!(
                    "status must be one of: {}",
                    VALID_ASSIGNMENT_STATUSES.join(", ")
                ),
            });
        }
        Ok(())
    }

    pub fn validate_decide_review(
        &self,
        command: &DecideReviewTaskCommand,
    ) -> Result<(), EditorialError> {
        if !VALID_REVIEW_DECISIONS.contains(&command.decision.as_str()) {
            return Err(EditorialError {
                code: "validation/invalid-decision",
                message: format!(
                    "decision must be one of: {}",
                    VALID_REVIEW_DECISIONS.join(", ")
                ),
            });
        }
        if command.reviewer_user_id.trim().is_empty() {
            return Err(EditorialError {
                code: "validation/missing-reviewer",
                message: "reviewer_user_id is required".to_string(),
            });
        }
        Ok(())
    }

    pub fn determine_assignment_completed_at(status: &str, now: &str) -> Option<String> {
        match status {
            "done" | "cancelled" => Some(now.to_string()),
            _ => None,
        }
    }
}

impl Default for NewsEditorialWorkflowService {
    fn default() -> Self {
        Self::new()
    }
}
