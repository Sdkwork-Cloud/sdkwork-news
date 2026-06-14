use sdkwork_content_news_repository_sqlx::repository::newsletter_repository::{
    NewNewsNewsletter, NewNewsNewsletterItem, NewsNewsletterRepository,
};
use sqlx::sqlite::SqlitePoolOptions;

async fn setup_repo() -> NewsNewsletterRepository {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    for migration in &[
        include_str!("../migrations/0001_news_foundation.sql"),
        include_str!("../migrations/0002_news_industry_foundation.sql"),
        include_str!("../migrations/0003_news_personalization_foundation.sql"),
        include_str!("../migrations/0004_news_alert_digest_foundation.sql"),
        include_str!("../migrations/0005_news_trust_correction_foundation.sql"),
        include_str!("../migrations/0006_news_live_coverage_foundation.sql"),
        include_str!("../migrations/0007_news_professional_newsroom_foundation.sql"),
    ] {
        sqlx::raw_sql(migration).execute(&pool).await.unwrap();
    }
    NewsNewsletterRepository::new(pool)
}

#[tokio::test]
async fn create_newsletter() {
    let repo = setup_repo().await;
    let nl = repo
        .create_newsletter(NewNewsNewsletter {
            id: "nl1".to_string(),
            tenant_id: "t1".to_string(),
            title: "Daily Digest".to_string(),
            description: Some("Daily news digest".to_string()),
            now: "2026-06-13T00:00:00Z".to_string(),
        })
        .await
        .unwrap();
    assert_eq!(nl.status, "draft");
    assert_eq!(nl.title, "Daily Digest");
}

#[tokio::test]
async fn list_newsletters_filters_by_status() {
    let repo = setup_repo().await;
    repo.create_newsletter(NewNewsNewsletter {
        id: "nl1".to_string(),
        tenant_id: "t1".to_string(),
        title: "NL 1".to_string(),
        description: None,
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    let drafts = repo
        .list_newsletters("t1", Some("draft"), 10)
        .await
        .unwrap();
    assert_eq!(drafts.len(), 1);

    let published = repo
        .list_newsletters("t1", Some("published"), 10)
        .await
        .unwrap();
    assert_eq!(published.len(), 0);
}

#[tokio::test]
async fn attach_newsletter_item() {
    let repo = setup_repo().await;
    repo.create_newsletter(NewNewsNewsletter {
        id: "nl1".to_string(),
        tenant_id: "t1".to_string(),
        title: "NL 1".to_string(),
        description: None,
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.attach_newsletter_item(NewNewsNewsletterItem {
        id: "nli1".to_string(),
        tenant_id: "t1".to_string(),
        newsletter_id: "nl1".to_string(),
        item_id: "item1".to_string(),
        rank: 0,
        note: Some("Top story".to_string()),
        now: "2026-06-13T00:01:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.attach_newsletter_item(NewNewsNewsletterItem {
        id: "nli2".to_string(),
        tenant_id: "t1".to_string(),
        newsletter_id: "nl1".to_string(),
        item_id: "item2".to_string(),
        rank: 1,
        note: None,
        now: "2026-06-13T00:02:00Z".to_string(),
    })
    .await
    .unwrap();
}

#[tokio::test]
async fn create_newsletter_issue() {
    let repo = setup_repo().await;
    repo.create_newsletter(NewNewsNewsletter {
        id: "nl1".to_string(),
        tenant_id: "t1".to_string(),
        title: "Weekly".to_string(),
        description: None,
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.create_newsletter_issue(
        "t1",
        "nl1",
        "Issue #1",
        Some("2026-06-14T09:00:00Z"),
        "2026-06-13T00:00:00Z",
    )
    .await
    .unwrap();
}

#[tokio::test]
async fn record_newsletter_delivery() {
    let repo = setup_repo().await;
    repo.create_newsletter(NewNewsNewsletter {
        id: "nl1".to_string(),
        tenant_id: "t1".to_string(),
        title: "Weekly".to_string(),
        description: None,
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.record_newsletter_delivery("t1", "nl1", "delivered", "2026-06-14T09:00:00Z")
        .await
        .unwrap();
}

#[tokio::test]
async fn create_newsletter_with_schedule() {
    let repo = setup_repo().await;
    repo.create_newsletter(NewNewsNewsletter {
        id: "nl1".to_string(),
        tenant_id: "t1".to_string(),
        title: "Scheduled NL".to_string(),
        description: Some("Sends every Monday".to_string()),
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.create_newsletter_issue(
        "t1",
        "nl1",
        "Monday Edition",
        Some("2026-06-16T09:00:00Z"),
        "2026-06-13T00:00:00Z",
    )
    .await
    .unwrap();
}

#[tokio::test]
async fn attach_duplicate_newsletter_item_upserts() {
    let repo = setup_repo().await;
    repo.create_newsletter(NewNewsNewsletter {
        id: "nl1".to_string(),
        tenant_id: "t1".to_string(),
        title: "NL 1".to_string(),
        description: None,
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.attach_newsletter_item(NewNewsNewsletterItem {
        id: "nli1".to_string(),
        tenant_id: "t1".to_string(),
        newsletter_id: "nl1".to_string(),
        item_id: "item1".to_string(),
        rank: 0,
        note: Some("Original".to_string()),
        now: "2026-06-13T00:01:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.attach_newsletter_item(NewNewsNewsletterItem {
        id: "nli1b".to_string(),
        tenant_id: "t1".to_string(),
        newsletter_id: "nl1".to_string(),
        item_id: "item1".to_string(),
        rank: 5,
        note: Some("Updated".to_string()),
        now: "2026-06-13T00:02:00Z".to_string(),
    })
    .await
    .unwrap();
}
