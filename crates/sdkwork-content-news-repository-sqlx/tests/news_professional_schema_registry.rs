use sdkwork_content_news_repository_sqlx::{
    news_professional_schema_registry, NewsTableImplementationStatus,
};

#[test]
fn news_professional_schema_registry_declares_complete_table_blueprint() {
    let registry = news_professional_schema_registry();

    assert_eq!(registry.domain, "content");
    assert_eq!(registry.capability, "news");
    assert!(registry.tables.len() >= 84);
    assert!(registry.tables.iter().any(|table| table.name == "news_item"
        && table.status == NewsTableImplementationStatus::Implemented));
    assert!(registry
        .tables
        .iter()
        .any(|table| table.name == "news_story"
            && table.status == NewsTableImplementationStatus::Planned
            && table
                .columns
                .iter()
                .any(|column| column.name == "story_type")));
    assert!(registry
        .tables
        .iter()
        .any(|table| table.name == "news_import_job"
            && table
                .columns
                .iter()
                .any(|column| column.name == "provider_payload_hash")));
    assert!(registry
        .tables
        .iter()
        .any(|table| table.name == "news_homepage_layout"
            && table.status == NewsTableImplementationStatus::Planned));
    assert!(registry
        .tables
        .iter()
        .any(|table| table.name == "news_newsletter_issue"
            && table
                .columns
                .iter()
                .any(|column| column.name == "newsletter_id")));
    assert!(registry
        .tables
        .iter()
        .any(|table| table.name == "news_paywall_rule"
            && table
                .columns
                .iter()
                .any(|column| column.name == "entitlement_code")));
    assert!(registry
        .tables
        .iter()
        .any(|table| table.name == "news_legal_hold"
            && table
                .columns
                .iter()
                .any(|column| column.name == "case_reference")));
    assert!(registry
        .tables
        .iter()
        .all(|table| table.todo.starts_with("TODO")));
}
