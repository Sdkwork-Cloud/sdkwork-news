use sdkwork_content_news_repository_sqlx::repository::professional_repository::{
    NewNewsStory, NewNewsStoryItem, NewsProfessionalRepository,
};
use sqlx::sqlite::SqlitePoolOptions;

async fn setup_repo() -> NewsProfessionalRepository {
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
    NewsProfessionalRepository::new(pool)
}

#[tokio::test]
async fn create_and_retrieve_story() {
    let repo = setup_repo().await;
    let story = repo
        .create_story(NewNewsStory {
            id: "story_1".to_string(),
            tenant_id: "100001".to_string(),
            organization_id: "org1".to_string(),
            slug: "breaking-news".to_string(),
            title: "Breaking News".to_string(),
            summary: "Summary".to_string(),
            story_type: "developing".to_string(),
            now: "2026-06-13T00:00:00Z".to_string(),
        })
        .await
        .unwrap();
    assert_eq!(story.id, "story_1");
    assert_eq!(story.status, "draft");

    let retrieved = repo.retrieve_story("100001", "story_1").await.unwrap();
    assert!(retrieved.is_some());
    let s = retrieved.unwrap();
    assert_eq!(s.title, "Breaking News");
    assert_eq!(s.slug, "breaking-news");
}

#[tokio::test]
async fn list_stories_filters_by_status() {
    let repo = setup_repo().await;
    repo.create_story(NewNewsStory {
        id: "s1".to_string(),
        tenant_id: "100001".to_string(),
        organization_id: "".to_string(),
        slug: "s1".to_string(),
        title: "Story 1".to_string(),
        summary: "".to_string(),
        story_type: "standard".to_string(),
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    let drafts = repo.list_stories("100001", Some("draft"), 10).await.unwrap();
    assert_eq!(drafts.len(), 1);

    let published = repo
        .list_stories("100001", Some("published"), 10)
        .await
        .unwrap();
    assert_eq!(published.len(), 0);
}

#[tokio::test]
async fn update_story() {
    let repo = setup_repo().await;
    repo.create_story(NewNewsStory {
        id: "s1".to_string(),
        tenant_id: "100001".to_string(),
        organization_id: "".to_string(),
        slug: "s1".to_string(),
        title: "Story 1".to_string(),
        summary: "Original".to_string(),
        story_type: "standard".to_string(),
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    let updated = repo
        .update_story(
            "100001",
            "s1",
            "Updated Title",
            "Updated Summary",
            0,
            "2026-06-13T01:00:00Z",
        )
        .await
        .unwrap();
    assert!(updated);

    let story = repo.retrieve_story("100001", "s1").await.unwrap().unwrap();
    assert_eq!(story.title, "Updated Title");
    assert_eq!(story.summary, "Updated Summary");
}

#[tokio::test]
async fn update_story_with_wrong_version_fails() {
    let repo = setup_repo().await;
    repo.create_story(NewNewsStory {
        id: "s1".to_string(),
        tenant_id: "100001".to_string(),
        organization_id: "".to_string(),
        slug: "s1".to_string(),
        title: "Story 1".to_string(),
        summary: "Original".to_string(),
        story_type: "standard".to_string(),
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    let updated = repo
        .update_story(
            "100001",
            "s1",
            "Updated Title",
            "Updated Summary",
            999,
            "2026-06-13T01:00:00Z",
        )
        .await
        .unwrap();
    assert!(!updated);
}

#[tokio::test]
async fn attach_story_item_and_list() {
    let repo = setup_repo().await;
    repo.create_story(NewNewsStory {
        id: "s1".to_string(),
        tenant_id: "100001".to_string(),
        organization_id: "".to_string(),
        slug: "s1".to_string(),
        title: "Story 1".to_string(),
        summary: "".to_string(),
        story_type: "standard".to_string(),
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.attach_story_item(NewNewsStoryItem {
        id: "si1".to_string(),
        tenant_id: "100001".to_string(),
        story_id: "s1".to_string(),
        item_id: "item1".to_string(),
        relation_type: "primary".to_string(),
        rank: 0,
        now: "2026-06-13T00:01:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.attach_story_item(NewNewsStoryItem {
        id: "si2".to_string(),
        tenant_id: "100001".to_string(),
        story_id: "s1".to_string(),
        item_id: "item2".to_string(),
        relation_type: "related".to_string(),
        rank: 1,
        now: "2026-06-13T00:02:00Z".to_string(),
    })
    .await
    .unwrap();
}

#[tokio::test]
async fn list_stories_with_limit() {
    let repo = setup_repo().await;
    for i in 0..5 {
        repo.create_story(NewNewsStory {
            id: format!("s{}", i),
            tenant_id: "100001".to_string(),
            organization_id: "".to_string(),
            slug: format!("s{}", i),
            title: format!("Story {}", i),
            summary: "".to_string(),
            story_type: "standard".to_string(),
            now: format!("2026-06-13T0{}:00:00Z", i),
        })
        .await
        .unwrap();
    }

    let all = repo.list_stories("100001", None, 10).await.unwrap();
    assert_eq!(all.len(), 5);

    let limited = repo.list_stories("100001", None, 2).await.unwrap();
    assert_eq!(limited.len(), 2);
}

#[tokio::test]
async fn retrieve_nonexistent_story_returns_none() {
    let repo = setup_repo().await;
    let story = repo.retrieve_story("100001", "nonexistent").await.unwrap();
    assert!(story.is_none());
}

#[tokio::test]
async fn create_multiple_stories_different_tenants() {
    let repo = setup_repo().await;
    repo.create_story(NewNewsStory {
        id: "s1".to_string(),
        tenant_id: "100001".to_string(),
        organization_id: "".to_string(),
        slug: "s1".to_string(),
        title: "Story 1".to_string(),
        summary: "".to_string(),
        story_type: "standard".to_string(),
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.create_story(NewNewsStory {
        id: "s2".to_string(),
        tenant_id: "t2".to_string(),
        organization_id: "".to_string(),
        slug: "s2".to_string(),
        title: "Story 2".to_string(),
        summary: "".to_string(),
        story_type: "standard".to_string(),
        now: "2026-06-13T00:01:00Z".to_string(),
    })
    .await
    .unwrap();

    let t1_stories = repo.list_stories("100001", None, 10).await.unwrap();
    assert_eq!(t1_stories.len(), 1);
    assert_eq!(t1_stories[0].tenant_id, "100001");

    let t2_stories = repo.list_stories("t2", None, 10).await.unwrap();
    assert_eq!(t2_stories.len(), 1);
    assert_eq!(t2_stories[0].tenant_id, "t2");
}
