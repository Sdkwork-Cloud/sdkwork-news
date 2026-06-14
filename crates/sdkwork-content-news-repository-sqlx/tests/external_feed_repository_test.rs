use sdkwork_content_news_repository_sqlx::repository::external_feed_repository::{
    NewNewsExternalFeed, NewNewsExternalFeedItem, NewsExternalFeedRepository,
};
use sqlx::sqlite::SqlitePoolOptions;

async fn setup_repo() -> NewsExternalFeedRepository {
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
    NewsExternalFeedRepository::new(pool)
}

#[tokio::test]
async fn create_feed() {
    let repo = setup_repo().await;
    let feed = repo
        .create_feed(NewNewsExternalFeed {
            id: "feed1".to_string(),
            tenant_id: "t1".to_string(),
            feed_url: "https://example.com/rss".to_string(),
            feed_type: "rss".to_string(),
            poll_interval_seconds: 3600,
            now: "2026-06-13T00:00:00Z".to_string(),
        })
        .await
        .unwrap();
    assert_eq!(feed.status, "active");
    assert_eq!(feed.feed_url, "https://example.com/rss");
}

#[tokio::test]
async fn claim_due_feed_returns_none_when_nothing_due() {
    let repo = setup_repo().await;
    repo.create_feed(NewNewsExternalFeed {
        id: "feed1".to_string(),
        tenant_id: "t1".to_string(),
        feed_url: "https://example.com/rss".to_string(),
        feed_type: "rss".to_string(),
        poll_interval_seconds: 3600,
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    let claimed = repo
        .claim_due_feed("t1", "2026-06-13T00:00:01Z")
        .await
        .unwrap();
    assert!(claimed.is_some());

    let claimed2 = repo
        .claim_due_feed("t1", "2026-06-13T01:00:01Z")
        .await
        .unwrap();
    assert!(claimed2.is_some());
}

#[tokio::test]
async fn upsert_external_feed_item() {
    let repo = setup_repo().await;
    repo.create_feed(NewNewsExternalFeed {
        id: "feed1".to_string(),
        tenant_id: "t1".to_string(),
        feed_url: "https://example.com/rss".to_string(),
        feed_type: "rss".to_string(),
        poll_interval_seconds: 3600,
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    let item = repo
        .upsert_external_feed_item(NewNewsExternalFeedItem {
            id: "fi1".to_string(),
            tenant_id: "t1".to_string(),
            feed_id: "feed1".to_string(),
            external_id: "ext1".to_string(),
            title: Some("Article 1".to_string()),
            url: Some("https://example.com/article1".to_string()),
            published_at: Some("2026-06-12T00:00:00Z".to_string()),
            content_hash: "hash1".to_string(),
            now: "2026-06-13T00:01:00Z".to_string(),
        })
        .await
        .unwrap();
    assert_eq!(item.status, "pending");
}

#[tokio::test]
async fn list_pending_feed_items() {
    let repo = setup_repo().await;
    repo.create_feed(NewNewsExternalFeed {
        id: "feed1".to_string(),
        tenant_id: "t1".to_string(),
        feed_url: "https://example.com/rss".to_string(),
        feed_type: "rss".to_string(),
        poll_interval_seconds: 3600,
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    for i in 0..3 {
        repo.upsert_external_feed_item(NewNewsExternalFeedItem {
            id: format!("fi{}", i),
            tenant_id: "t1".to_string(),
            feed_id: "feed1".to_string(),
            external_id: format!("ext{}", i),
            title: Some(format!("Article {}", i)),
            url: None,
            published_at: None,
            content_hash: format!("hash{}", i),
            now: "2026-06-13T00:01:00Z".to_string(),
        })
        .await
        .unwrap();
    }

    let pending = repo
        .list_pending_feed_items("t1", "feed1", 10)
        .await
        .unwrap();
    assert_eq!(pending.len(), 3);
}

#[tokio::test]
async fn mark_feed_item_imported() {
    let repo = setup_repo().await;
    repo.create_feed(NewNewsExternalFeed {
        id: "feed1".to_string(),
        tenant_id: "t1".to_string(),
        feed_url: "https://example.com/rss".to_string(),
        feed_type: "rss".to_string(),
        poll_interval_seconds: 3600,
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.upsert_external_feed_item(NewNewsExternalFeedItem {
        id: "fi1".to_string(),
        tenant_id: "t1".to_string(),
        feed_id: "feed1".to_string(),
        external_id: "ext1".to_string(),
        title: None,
        url: None,
        published_at: None,
        content_hash: "hash1".to_string(),
        now: "2026-06-13T00:01:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.mark_feed_item_imported("t1", "fi1", "2026-06-13T00:02:00Z")
        .await
        .unwrap();

    let pending = repo
        .list_pending_feed_items("t1", "feed1", 10)
        .await
        .unwrap();
    assert_eq!(pending.len(), 0);
}

#[tokio::test]
async fn mark_feed_item_failed() {
    let repo = setup_repo().await;
    repo.create_feed(NewNewsExternalFeed {
        id: "feed1".to_string(),
        tenant_id: "t1".to_string(),
        feed_url: "https://example.com/rss".to_string(),
        feed_type: "rss".to_string(),
        poll_interval_seconds: 3600,
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.upsert_external_feed_item(NewNewsExternalFeedItem {
        id: "fi1".to_string(),
        tenant_id: "t1".to_string(),
        feed_id: "feed1".to_string(),
        external_id: "ext1".to_string(),
        title: None,
        url: None,
        published_at: None,
        content_hash: "hash1".to_string(),
        now: "2026-06-13T00:01:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.mark_feed_item_failed("t1", "fi1", "2026-06-13T00:02:00Z")
        .await
        .unwrap();

    let pending = repo
        .list_pending_feed_items("t1", "feed1", 10)
        .await
        .unwrap();
    assert_eq!(pending.len(), 0);
}

#[tokio::test]
async fn update_feed_success() {
    let repo = setup_repo().await;
    repo.create_feed(NewNewsExternalFeed {
        id: "feed1".to_string(),
        tenant_id: "t1".to_string(),
        feed_url: "https://example.com/rss".to_string(),
        feed_type: "rss".to_string(),
        poll_interval_seconds: 3600,
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.update_feed_success("t1", "feed1", "2026-06-13T00:05:00Z")
        .await
        .unwrap();
}
