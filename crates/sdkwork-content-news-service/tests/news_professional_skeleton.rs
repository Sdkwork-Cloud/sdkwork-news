use sdkwork_content_news_service::{news_professional_service_plan, NewsProfessionalUseCase};

#[test]
fn news_professional_service_plan_declares_newsroom_use_cases_and_todo_methods() {
    let plan = news_professional_service_plan();

    assert_eq!(plan.domain, "content");
    assert_eq!(plan.capability, "news");
    assert!(plan
        .use_cases
        .contains(&NewsProfessionalUseCase::StoryPackaging));
    assert!(plan
        .use_cases
        .contains(&NewsProfessionalUseCase::EditorialWorkflow));
    assert!(plan
        .use_cases
        .contains(&NewsProfessionalUseCase::TrustAndCorrections));
    assert!(plan
        .use_cases
        .contains(&NewsProfessionalUseCase::ImportExport));
    assert!(plan
        .todo_methods
        .iter()
        .any(|method| method.name == "create_story"));
    assert!(plan
        .todo_methods
        .iter()
        .any(|method| method.name == "import_ninjs"));
    assert!(plan
        .todo_methods
        .iter()
        .all(|method| method.todo.starts_with("TODO")));
}
