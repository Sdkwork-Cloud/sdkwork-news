use sdkwork_content_news_repository_sqlx::repository::paywall_repository::{
    NewNewsMeteredAccessEvent, NewNewsPaywallPolicy, NewsPaywallRepository,
};
use sqlx::sqlite::SqlitePoolOptions;

async fn setup_repo() -> NewsPaywallRepository {
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
    NewsPaywallRepository::new(pool)
}

#[tokio::test]
async fn create_paywall_policy() {
    let repo = setup_repo().await;
    let policy = repo
        .create_paywall_policy(NewNewsPaywallPolicy {
            id: "p1".to_string(),
            tenant_id: "100001".to_string(),
            policy_name: "metered-access".to_string(),
            policy_type: "metered".to_string(),
            rules_json: r#"{"max_views":10,"window_days":30}"#.to_string(),
            now: "2026-06-13T00:00:00Z".to_string(),
        })
        .await
        .unwrap();
    assert!(policy.enabled);
    assert_eq!(policy.policy_name, "metered-access");
}

#[tokio::test]
async fn find_matching_rule_returns_none_when_empty() {
    let repo = setup_repo().await;
    let rule = repo.find_matching_rule("100001", "metered").await.unwrap();
    assert!(rule.is_none());
}

#[tokio::test]
async fn find_matching_rule_returns_created_policy() {
    let repo = setup_repo().await;
    repo.create_paywall_policy(NewNewsPaywallPolicy {
        id: "p1".to_string(),
        tenant_id: "100001".to_string(),
        policy_name: "premium".to_string(),
        policy_type: "subscription".to_string(),
        rules_json: r#"{"tier":"premium"}"#.to_string(),
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    let rule = repo.find_matching_rule("100001", "subscription").await.unwrap();
    assert!(rule.is_some());
    assert_eq!(rule.unwrap().policy_type, "subscription");
}

#[tokio::test]
async fn record_metered_access_event() {
    let repo = setup_repo().await;
    repo.record_metered_access_event(NewNewsMeteredAccessEvent {
        id: "mae1".to_string(),
        tenant_id: "100001".to_string(),
        user_id: "user1".to_string(),
        item_id: "item1".to_string(),
        event_type: "view".to_string(),
        occurred_at: "2026-06-13T00:00:00Z".to_string(),
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();
}

#[tokio::test]
async fn count_metered_access_returns_correct_count() {
    let repo = setup_repo().await;
    for i in 0..5 {
        repo.record_metered_access_event(NewNewsMeteredAccessEvent {
            id: format!("mae{}", i),
            tenant_id: "100001".to_string(),
            user_id: "user1".to_string(),
            item_id: "item1".to_string(),
            event_type: "view".to_string(),
            occurred_at: format!("2026-06-13T0{}:00:00Z", i),
            now: format!("2026-06-13T0{}:00:00Z", i),
        })
        .await
        .unwrap();
    }

    let count = repo
        .count_metered_access("100001", "user1", "item1", "2026-06-01T00:00:00Z")
        .await
        .unwrap();
    assert_eq!(count, 5);
}

#[tokio::test]
async fn list_paywall_policies() {
    let repo = setup_repo().await;
    for i in 0..3 {
        repo.create_paywall_policy(NewNewsPaywallPolicy {
            id: format!("p{}", i),
            tenant_id: "100001".to_string(),
            policy_name: format!("policy_{}", i),
            policy_type: "metered".to_string(),
            rules_json: "{}".to_string(),
            now: "2026-06-13T00:00:00Z".to_string(),
        })
        .await
        .unwrap();
    }

    let policies = repo.list_paywall_policies("100001", 10).await.unwrap();
    assert_eq!(policies.len(), 3);
}

#[tokio::test]
async fn create_multiple_metered_events_different_users() {
    let repo = setup_repo().await;
    for user_id in &["user1", "user2", "user3"] {
        repo.record_metered_access_event(NewNewsMeteredAccessEvent {
            id: format!("mae_{}", user_id),
            tenant_id: "100001".to_string(),
            user_id: user_id.to_string(),
            item_id: "item1".to_string(),
            event_type: "view".to_string(),
            occurred_at: "2026-06-13T00:00:00Z".to_string(),
            now: "2026-06-13T00:00:00Z".to_string(),
        })
        .await
        .unwrap();
    }

    let count_user1 = repo
        .count_metered_access("100001", "user1", "item1", "2026-06-01T00:00:00Z")
        .await
        .unwrap();
    assert_eq!(count_user1, 1);

    let count_user2 = repo
        .count_metered_access("100001", "user2", "item1", "2026-06-01T00:00:00Z")
        .await
        .unwrap();
    assert_eq!(count_user2, 1);
}

#[tokio::test]
async fn create_multiple_policies_different_types() {
    let repo = setup_repo().await;
    repo.create_paywall_policy(NewNewsPaywallPolicy {
        id: "p1".to_string(),
        tenant_id: "100001".to_string(),
        policy_name: "metered".to_string(),
        policy_type: "metered".to_string(),
        rules_json: r#"{"max_views":5}"#.to_string(),
        now: "2026-06-13T00:00:00Z".to_string(),
    })
    .await
    .unwrap();

    repo.create_paywall_policy(NewNewsPaywallPolicy {
        id: "p2".to_string(),
        tenant_id: "100001".to_string(),
        policy_name: "hard-paywall".to_string(),
        policy_type: "hard".to_string(),
        rules_json: r#"{"always_block":true}"#.to_string(),
        now: "2026-06-13T00:01:00Z".to_string(),
    })
    .await
    .unwrap();

    let metered = repo.find_matching_rule("100001", "metered").await.unwrap();
    assert!(metered.is_some());
    assert_eq!(metered.unwrap().policy_type, "metered");

    let hard = repo.find_matching_rule("100001", "hard").await.unwrap();
    assert!(hard.is_some());
    assert_eq!(hard.unwrap().policy_type, "hard");
}
