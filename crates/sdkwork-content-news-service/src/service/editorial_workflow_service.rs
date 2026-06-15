use crate::repository::professional_repository::{
    NewsProfessionalRepository, NewNewsEditorialAssignment, NewNewsReviewTask,
};

pub struct NewsEditorialWorkflowService {
    repo: NewsProfessionalRepository,
}

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
    pub fn new(repo: NewsProfessionalRepository) -> Self {
        Self { repo }
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

    pub async fn create_assignment(
        &self,
        command: CreateAssignmentCommand,
        now: &str,
    ) -> Result<EditorialResult, EditorialError> {
        self.validate_create_assignment(&command)?;

        let id = uuid::Uuid::new_v4().to_string();

        let input = NewNewsEditorialAssignment {
            id: id.clone(),
            tenant_id: command.tenant_id,
            item_id: command.item_id,
            story_id: command.story_id,
            assignee_user_id: command.assignee_user_id,
            assignment_role: command.assignment_role,
            due_at: command.due_at,
            created_by_user_id: command.created_by_user_id,
            now: now.to_string(),
        };

        self.repo
            .create_assignment(input)
            .await
            .map_err(|e| EditorialError {
                code: "storage/error",
                message: e.to_string(),
            })?;

        Ok(EditorialResult {
            id,
            status: "open".to_string(),
            message: Some("Assignment created successfully".to_string()),
        })
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

    pub async fn update_assignment(
        &self,
        tenant_id: &str,
        assignment_id: &str,
        status: &str,
        now: &str,
    ) -> Result<(), EditorialError> {
        self.validate_update_assignment(status)?;

        self.repo
            .update_assignment(tenant_id, assignment_id, status, now)
            .await
            .map_err(|e| EditorialError {
                code: "storage/error",
                message: e.to_string(),
            })
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

    pub async fn create_review_task(
        &self,
        tenant_id: &str,
        target_type: &str,
        target_id: &str,
        review_type: &str,
        reviewer_user_id: Option<&str>,
        due_at: Option<&str>,
        now: &str,
    ) -> Result<EditorialResult, EditorialError> {
        let id = uuid::Uuid::new_v4().to_string();

        let input = NewNewsReviewTask {
            id: id.clone(),
            tenant_id: tenant_id.to_string(),
            target_type: target_type.to_string(),
            target_id: target_id.to_string(),
            review_type: review_type.to_string(),
            reviewer_user_id: reviewer_user_id.map(|s| s.to_string()),
            due_at: due_at.map(|s| s.to_string()),
            now: now.to_string(),
        };

        self.repo
            .create_review_task(input)
            .await
            .map_err(|e| EditorialError {
                code: "storage/error",
                message: e.to_string(),
            })?;

        Ok(EditorialResult {
            id,
            status: "open".to_string(),
            message: Some("Review task created successfully".to_string()),
        })
    }

    pub async fn update_review_task(
        &self,
        tenant_id: &str,
        task_id: &str,
        decision: &str,
        decision_reason: Option<&str>,
        now: &str,
    ) -> Result<(), EditorialError> {
        self.repo
            .update_review_task(tenant_id, task_id, decision, decision_reason, now)
            .await
            .map_err(|e| EditorialError {
                code: "storage/error",
                message: e.to_string(),
            })
    }

    pub fn determine_assignment_completed_at(status: &str, now: &str) -> Option<String> {
        match status {
            "done" | "cancelled" => Some(now.to_string()),
            _ => None,
        }
    }
}
