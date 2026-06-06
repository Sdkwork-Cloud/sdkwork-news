use sdkwork_news_core::{
    evaluate_editorial_readiness, news_capability_manifest, NewsEditorialAction, NewsItem,
    NewsItemStatus,
};

#[test]
fn news_core_manifest_owns_news_domain_contracts() {
    let manifest = news_capability_manifest();
    assert_eq!(manifest.owner, "sdkwork-news");
    assert_eq!(manifest.domain, "news");
    assert_eq!(manifest.statuses, vec!["draft", "published", "scheduled", "archived"]);
    assert!(manifest.operations.contains(&"items.publish"));
    assert!(manifest.operations.contains(&"items.editorialReadiness.retrieve"));
    assert!(manifest.operations.contains(&"channels.feed.list"));
    assert!(manifest.operations.contains(&"feed.personalized.list"));
    assert!(manifest.operations.contains(&"feed.candidates.upsert"));
    assert!(manifest.operations.contains(&"events.create"));
    assert!(manifest.operations.contains(&"interests.upsert"));
    assert!(manifest.operations.contains(&"search.suggestions.list"));
    assert!(manifest.operations.contains(&"items.metrics.retrieve"));
    assert!(manifest.operations.contains(&"moderation.cases.update"));
    assert!(manifest.operations.contains(&"experiments.archive"));
}

#[test]
fn news_core_evaluates_publish_schedule_archive_readiness() {
    let item = NewsItem {
        id: "item_1",
        tenant_id: "tenant_1",
        category_id: "product",
        slug: "platform-release",
        title: "Platform release",
        summary: "Release summary",
        body: Some("Body"),
        tags: vec!["release"],
        status: NewsItemStatus::Draft,
    };

    let readiness = evaluate_editorial_readiness(&item, NewsEditorialAction::Publish);
    assert!(readiness.ready);
    assert!(readiness.can_publish);
    assert!(!readiness.can_archive);

    let archive_readiness = evaluate_editorial_readiness(&item, NewsEditorialAction::Archive);
    assert!(!archive_readiness.ready);
    assert_eq!(archive_readiness.issues, vec!["unpublished"]);
}
