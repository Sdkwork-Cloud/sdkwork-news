use sdkwork_content_news_service::service::editorial_workflow_service::{
    CreateAssignmentCommand, DecideReviewTaskCommand, NewsEditorialWorkflowService,
};

#[test]
fn create_assignment_requires_tenant_id() {
    let service = NewsEditorialWorkflowService::new();
    let cmd = CreateAssignmentCommand {
        tenant_id: "".to_string(),
        item_id: Some("item1".to_string()),
        story_id: None,
        assignee_user_id: "user1".to_string(),
        assignment_role: "writer".to_string(),
        due_at: None,
        created_by_user_id: None,
    };
    let result = service.validate_create_assignment(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-tenant");
}

#[test]
fn create_assignment_requires_assignee() {
    let service = NewsEditorialWorkflowService::new();
    let cmd = CreateAssignmentCommand {
        tenant_id: "t1".to_string(),
        item_id: Some("item1".to_string()),
        story_id: None,
        assignee_user_id: "".to_string(),
        assignment_role: "writer".to_string(),
        due_at: None,
        created_by_user_id: None,
    };
    let result = service.validate_create_assignment(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-assignee");
}

#[test]
fn create_assignment_requires_valid_role() {
    let service = NewsEditorialWorkflowService::new();
    let cmd = CreateAssignmentCommand {
        tenant_id: "t1".to_string(),
        item_id: Some("item1".to_string()),
        story_id: None,
        assignee_user_id: "user1".to_string(),
        assignment_role: "invalid_role".to_string(),
        due_at: None,
        created_by_user_id: None,
    };
    let result = service.validate_create_assignment(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/invalid-role");
}

#[test]
fn create_assignment_requires_target() {
    let service = NewsEditorialWorkflowService::new();
    let cmd = CreateAssignmentCommand {
        tenant_id: "t1".to_string(),
        item_id: None,
        story_id: None,
        assignee_user_id: "user1".to_string(),
        assignment_role: "writer".to_string(),
        due_at: None,
        created_by_user_id: None,
    };
    let result = service.validate_create_assignment(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-target");
}

#[test]
fn create_assignment_valid_writer_passes() {
    let service = NewsEditorialWorkflowService::new();
    let cmd = CreateAssignmentCommand {
        tenant_id: "t1".to_string(),
        item_id: Some("item1".to_string()),
        story_id: None,
        assignee_user_id: "user1".to_string(),
        assignment_role: "writer".to_string(),
        due_at: Some("2026-12-31T23:59:59Z".to_string()),
        created_by_user_id: Some("editor1".to_string()),
    };
    assert!(service.validate_create_assignment(&cmd).is_ok());
}

#[test]
fn create_assignment_valid_editor_passes() {
    let service = NewsEditorialWorkflowService::new();
    let cmd = CreateAssignmentCommand {
        tenant_id: "t1".to_string(),
        item_id: None,
        story_id: Some("story1".to_string()),
        assignee_user_id: "user2".to_string(),
        assignment_role: "editor".to_string(),
        due_at: None,
        created_by_user_id: None,
    };
    assert!(service.validate_create_assignment(&cmd).is_ok());
}

#[test]
fn create_assignment_valid_reviewer_passes() {
    let service = NewsEditorialWorkflowService::new();
    let cmd = CreateAssignmentCommand {
        tenant_id: "t1".to_string(),
        item_id: Some("item1".to_string()),
        story_id: None,
        assignee_user_id: "user3".to_string(),
        assignment_role: "reviewer".to_string(),
        due_at: None,
        created_by_user_id: None,
    };
    assert!(service.validate_create_assignment(&cmd).is_ok());
}

#[test]
fn update_assignment_valid_statuses_pass() {
    let service = NewsEditorialWorkflowService::new();
    for status in &["open", "in_progress", "done", "cancelled"] {
        assert!(service.validate_update_assignment(status).is_ok());
    }
}

#[test]
fn update_assignment_invalid_status_fails() {
    let service = NewsEditorialWorkflowService::new();
    let result = service.validate_update_assignment("invalid");
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/invalid-status");
}

#[test]
fn decide_review_requires_valid_decision() {
    let service = NewsEditorialWorkflowService::new();
    let cmd = DecideReviewTaskCommand {
        decision: "invalid".to_string(),
        decision_reason: None,
        reviewer_user_id: "user1".to_string(),
    };
    let result = service.validate_decide_review(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/invalid-decision");
}

#[test]
fn decide_review_requires_reviewer() {
    let service = NewsEditorialWorkflowService::new();
    let cmd = DecideReviewTaskCommand {
        decision: "approved".to_string(),
        decision_reason: None,
        reviewer_user_id: "".to_string(),
    };
    let result = service.validate_decide_review(&cmd);
    assert!(result.is_err());
    assert_eq!(result.unwrap_err().code, "validation/missing-reviewer");
}

#[test]
fn decide_review_approved_passes() {
    let service = NewsEditorialWorkflowService::new();
    let cmd = DecideReviewTaskCommand {
        decision: "approved".to_string(),
        decision_reason: Some("Looks good".to_string()),
        reviewer_user_id: "reviewer1".to_string(),
    };
    assert!(service.validate_decide_review(&cmd).is_ok());
}

#[test]
fn decide_review_rejected_passes() {
    let service = NewsEditorialWorkflowService::new();
    let cmd = DecideReviewTaskCommand {
        decision: "rejected".to_string(),
        decision_reason: Some("Needs work".to_string()),
        reviewer_user_id: "reviewer1".to_string(),
    };
    assert!(service.validate_decide_review(&cmd).is_ok());
}

#[test]
fn decide_review_changes_requested_passes() {
    let service = NewsEditorialWorkflowService::new();
    let cmd = DecideReviewTaskCommand {
        decision: "changes_requested".to_string(),
        decision_reason: Some("Fix typos".to_string()),
        reviewer_user_id: "reviewer1".to_string(),
    };
    assert!(service.validate_decide_review(&cmd).is_ok());
}

#[test]
fn determine_assignment_completed_at_done() {
    let result = NewsEditorialWorkflowService::determine_assignment_completed_at(
        "done",
        "2026-01-01T00:00:00Z",
    );
    assert_eq!(result, Some("2026-01-01T00:00:00Z".to_string()));
}

#[test]
fn determine_assignment_completed_at_cancelled() {
    let result = NewsEditorialWorkflowService::determine_assignment_completed_at(
        "cancelled",
        "2026-01-01T00:00:00Z",
    );
    assert_eq!(result, Some("2026-01-01T00:00:00Z".to_string()));
}

#[test]
fn determine_assignment_completed_at_open() {
    let result = NewsEditorialWorkflowService::determine_assignment_completed_at(
        "open",
        "2026-01-01T00:00:00Z",
    );
    assert_eq!(result, None);
}
