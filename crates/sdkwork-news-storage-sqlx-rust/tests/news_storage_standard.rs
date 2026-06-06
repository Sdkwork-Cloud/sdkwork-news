use sdkwork_news_storage_sqlx::{
    news_database_tables, news_migration_names, news_storage_capability_manifest,
    NewNewsBreakingAlert, NewNewsCategory, NewNewsChannel, NewNewsChannelItem,
    NewNewsCorrectionNotice, NewNewsDigestIssue, NewNewsDigestItem, NewNewsFactCheck,
    NewNewsFavorite, NewNewsFeedCandidate, NewNewsItem, NewNewsItemMetricSnapshot,
    NewNewsItemTrustSnapshot, NewNewsLiveEvent, NewNewsLiveEventItem, NewNewsLiveUpdate,
    NewNewsNotificationSubscription, NewNewsReaction, NewNewsRecommendationEvent,
    NewNewsSearchEvent, NewNewsSearchSuggestion, NewNewsSourceTrustProfile, NewNewsTrendingMetric,
    NewNewsUserFeedback, NewNewsUserInterestSignal, SqliteNewsStore,
};
use sqlx::sqlite::SqlitePoolOptions;

#[test]
fn news_storage_manifest_declares_complete_news_tables_and_migrations() {
    let manifest = news_storage_capability_manifest();
    assert_eq!(manifest.name, "sdkwork-news-storage-sqlx");
    assert_eq!(manifest.schema_version, "news.storage.v6");
    assert_eq!(news_database_tables(), manifest.tables);
    assert_eq!(news_migration_names(), manifest.migrations);
    for table in [
        "news_category",
        "news_item",
        "news_item_body",
        "news_tag",
        "news_item_tag",
        "news_publication_event",
        "news_read_state",
        "news_editorial_audit",
        "news_schema_version",
        "news_migration_lock",
        "news_source",
        "news_author",
        "news_item_version",
        "news_media_asset",
        "news_item_media",
        "news_topic",
        "news_item_topic",
        "news_channel",
        "news_channel_item",
        "news_feed_stream",
        "news_feed_cursor",
        "news_recommendation_event",
        "news_user_feedback",
        "news_trending_metric",
        "news_search_projection",
        "news_experiment",
        "news_experiment_assignment",
        "news_comment",
        "news_comment_moderation",
        "news_reaction",
        "news_favorite",
        "news_share_event",
        "news_follow",
        "news_report",
        "news_moderation_case",
        "news_content_risk_signal",
        "news_takedown_event",
        "news_user_interest_signal",
        "news_feed_candidate",
        "news_item_metric_snapshot",
        "news_search_suggestion",
        "news_search_event",
        "news_notification_subscription",
        "news_breaking_alert",
        "news_digest_issue",
        "news_digest_item",
        "news_source_trust_profile",
        "news_fact_check",
        "news_correction_notice",
        "news_item_trust_snapshot",
        "news_live_event",
        "news_live_update",
        "news_live_event_item",
    ] {
        assert!(manifest.tables.contains(&table), "missing table {table}");
    }
    assert!(manifest
        .indexes
        .contains(&"idx_news_item_tenant_status_published_at"));
    assert!(manifest.indexes.contains(&"idx_news_item_tenant_slug"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_channel_tenant_status_priority"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_channel_item_channel_rank"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_recommendation_event_user_time"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_user_feedback_user_target"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_trending_metric_window_rank"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_comment_item_status_time"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_user_interest_signal_user_target"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_feed_candidate_stream_score"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_item_metric_snapshot_hot"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_search_suggestion_query_rank"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_search_event_query_time"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_notification_subscription_user_target"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_breaking_alert_status_time"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_digest_issue_status_time"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_digest_item_digest_rank"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_source_trust_profile_score"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_fact_check_item_status"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_correction_notice_item_status"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_item_trust_snapshot_risk"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_live_event_status_priority"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_live_update_event_status_time"));
    assert!(manifest
        .indexes
        .contains(&"idx_news_live_event_item_event_rank"));
    assert_eq!(manifest.migration_plan[0].name, "0001_news_foundation.sql");
    assert_eq!(
        manifest.migration_plan[1].name,
        "0002_news_industry_foundation.sql"
    );
    assert_eq!(
        manifest.migration_plan[2].name,
        "0003_news_personalization_foundation.sql"
    );
    assert_eq!(
        manifest.migration_plan[3].name,
        "0004_news_alert_digest_foundation.sql"
    );
    assert_eq!(
        manifest.migration_plan[4].name,
        "0005_news_trust_correction_foundation.sql"
    );
    assert_eq!(
        manifest.migration_plan[5].name,
        "0006_news_live_coverage_foundation.sql"
    );
    assert!(manifest.migration_plan[0]
        .sql
        .contains("CREATE TABLE news_item"));
    assert!(manifest.migration_plan[1]
        .sql
        .contains("CREATE TABLE news_channel"));
    assert!(manifest.migration_plan[2]
        .sql
        .contains("CREATE TABLE news_feed_candidate"));
    assert!(manifest.migration_plan[3]
        .sql
        .contains("CREATE TABLE news_breaking_alert"));
    assert!(manifest.migration_plan[4]
        .sql
        .contains("CREATE TABLE news_fact_check"));
    assert!(manifest.migration_plan[5]
        .sql
        .contains("CREATE TABLE news_live_event"));
}

#[test]
fn news_storage_repositories_bind_to_news_tables() {
    let manifest = news_storage_capability_manifest();
    let names = manifest
        .repository_bindings
        .iter()
        .map(|binding| binding.repository_name)
        .collect::<Vec<_>>();
    assert_eq!(
        names,
        vec![
            "news.category.repository",
            "news.item.repository",
            "news.read_state.repository",
            "news.audit.repository",
            "news.channel.repository",
            "news.topic.repository",
            "news.media.repository",
            "news.feed.repository",
            "news.engagement.repository",
            "news.moderation.repository",
            "news.experiment.repository",
            "news.personalization.repository",
            "news.metrics.repository",
            "news.search.repository",
            "news.notification.repository",
            "news.alert.repository",
            "news.digest.repository",
            "news.trust.repository",
            "news.live.repository",
        ]
    );
}

#[tokio::test]
async fn sqlite_news_store_migrates_creates_publishes_and_reads_news() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    let store = SqliteNewsStore::new(pool.clone());
    store.migrate().await.expect("news migration");

    store
        .create_category(NewNewsCategory {
            id: "category_product".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            slug: "product".to_owned(),
            title: "Product".to_owned(),
            description: Some("Product releases".to_owned()),
            priority: 1,
            enabled: true,
            now: "2026-06-06T00:00:00Z".to_owned(),
        })
        .await
        .expect("create category");
    store
        .create_item(NewNewsItem {
            id: "item_release".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            category_id: "category_product".to_owned(),
            slug: "platform-release".to_owned(),
            title: "Platform release".to_owned(),
            summary: "Release summary".to_owned(),
            body_markdown: "Release body".to_owned(),
            author_name: Some("Product Team".to_owned()),
            priority: 1,
            estimated_read_minutes: 6,
            tags: vec!["release".to_owned(), "platform".to_owned()],
            now: "2026-06-06T00:01:00Z".to_owned(),
        })
        .await
        .expect("create item");

    assert!(store
        .list_published("tenant_1", None, None)
        .await
        .expect("draft list")
        .is_empty());

    store
        .publish_item(
            "tenant_1",
            "item_release",
            "user_editor",
            "2026-06-06T00:02:00Z",
        )
        .await
        .expect("publish item");

    let published = store
        .list_published("tenant_1", Some("category_product"), Some("release"))
        .await
        .expect("published list");
    assert_eq!(published.len(), 1);
    assert_eq!(published[0].slug, "platform-release");
    assert_eq!(published[0].tags, vec!["platform", "release"]);
    assert_eq!(
        store
            .retrieve_published_by_slug("tenant_1", "platform-release")
            .await
            .expect("retrieve by slug")
            .expect("published item")
            .body_markdown,
        "Release body",
    );
}

#[tokio::test]
async fn sqlite_news_store_supports_channel_feed_events_and_engagement() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    let store = SqliteNewsStore::new(pool.clone());
    store.migrate().await.expect("news migration");

    store
        .create_category(NewNewsCategory {
            id: "category_world".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            slug: "world".to_owned(),
            title: "World".to_owned(),
            description: None,
            priority: 1,
            enabled: true,
            now: "2026-06-06T00:00:00Z".to_owned(),
        })
        .await
        .expect("create category");
    store
        .create_item(NewNewsItem {
            id: "item_world".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            category_id: "category_world".to_owned(),
            slug: "world-update".to_owned(),
            title: "World update".to_owned(),
            summary: "World update summary".to_owned(),
            body_markdown: "World update body".to_owned(),
            author_name: Some("News Desk".to_owned()),
            priority: 1,
            estimated_read_minutes: 3,
            tags: vec!["world".to_owned()],
            now: "2026-06-06T00:01:00Z".to_owned(),
        })
        .await
        .expect("create item");
    store
        .publish_item(
            "tenant_1",
            "item_world",
            "user_editor",
            "2026-06-06T00:02:00Z",
        )
        .await
        .expect("publish item");

    store
        .create_channel(NewNewsChannel {
            id: "channel_top".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            organization_id: "org_1".to_owned(),
            slug: "top".to_owned(),
            title: "Top".to_owned(),
            channel_type: "editorial".to_owned(),
            priority: 1,
            now: "2026-06-06T00:03:00Z".to_owned(),
        })
        .await
        .expect("create channel");
    store
        .attach_item_to_channel(NewNewsChannelItem {
            id: "channel_item_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            channel_id: "channel_top".to_owned(),
            item_id: "item_world".to_owned(),
            rank: 10,
            reason: Some("editor-pick".to_owned()),
            now: "2026-06-06T00:04:00Z".to_owned(),
        })
        .await
        .expect("attach item");

    let feed = store
        .list_channel_feed("tenant_1", "channel_top", 10)
        .await
        .expect("channel feed");
    assert_eq!(feed.len(), 1);
    assert_eq!(feed[0].slug, "world-update");

    sqlx::query("UPDATE news_channel_item SET status = 'inactive', updated_at = ? WHERE id = ?")
        .bind("2026-06-06T00:04:30Z")
        .bind("channel_item_1")
        .execute(&pool)
        .await
        .expect("pause channel item");

    let inactive_feed = store
        .list_channel_feed("tenant_1", "channel_top", 10)
        .await
        .expect("inactive channel feed");
    assert!(inactive_feed.is_empty());

    store
        .record_recommendation_event(NewNewsRecommendationEvent {
            id: "event_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: Some("user_1".to_owned()),
            item_id: "item_world".to_owned(),
            channel_id: Some("channel_top".to_owned()),
            event_type: "impression".to_owned(),
            dwell_ms: None,
            trace_id: Some("trace_1".to_owned()),
            occurred_at: "2026-06-06T00:05:00Z".to_owned(),
        })
        .await
        .expect("record event");
    store
        .record_user_feedback(NewNewsUserFeedback {
            id: "feedback_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: "user_1".to_owned(),
            target_type: "item".to_owned(),
            target_id: "item_world".to_owned(),
            feedback_type: "not_interested".to_owned(),
            reason: Some("repetitive".to_owned()),
            created_at: "2026-06-06T00:06:00Z".to_owned(),
        })
        .await
        .expect("record feedback");
    store
        .mark_favorite(NewNewsFavorite {
            id: "favorite_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: "user_1".to_owned(),
            item_id: "item_world".to_owned(),
            created_at: "2026-06-06T00:07:00Z".to_owned(),
        })
        .await
        .expect("favorite");
    store
        .upsert_reaction(NewNewsReaction {
            id: "reaction_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: "user_1".to_owned(),
            item_id: "item_world".to_owned(),
            reaction_type: "like".to_owned(),
            updated_at: "2026-06-06T00:08:00Z".to_owned(),
        })
        .await
        .expect("reaction");
    store
        .upsert_trending_metric(NewNewsTrendingMetric {
            id: "trend_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            item_id: "item_world".to_owned(),
            metric_window: "hour".to_owned(),
            score: 98,
            rank: 1,
            computed_at: "2026-06-06T00:09:00Z".to_owned(),
        })
        .await
        .expect("trend");

    let trending = store
        .list_trending("tenant_1", "hour", 10)
        .await
        .expect("trending");
    assert_eq!(trending.len(), 1);
    assert_eq!(trending[0].item_id, "item_world");
    assert_eq!(trending[0].rank, 1);
}

#[tokio::test]
async fn sqlite_news_store_supports_personalized_candidates_metrics_and_search_suggestions() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    let store = SqliteNewsStore::new(pool);
    store.migrate().await.expect("news migration");

    store
        .upsert_user_interest_signal(NewNewsUserInterestSignal {
            id: "interest_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: "user_1".to_owned(),
            target_type: "topic".to_owned(),
            target_id: "topic_ai".to_owned(),
            affinity_score: 92,
            confidence: 80,
            source: "explicit".to_owned(),
            updated_at: "2026-06-06T01:00:00Z".to_owned(),
        })
        .await
        .expect("upsert interest");

    let interests = store
        .list_user_interest_signals("tenant_1", "user_1", 10)
        .await
        .expect("list interests");
    assert_eq!(interests.len(), 1);
    assert_eq!(interests[0].target_id, "topic_ai");
    assert_eq!(interests[0].affinity_score, 92);

    store
        .upsert_feed_candidate(NewNewsFeedCandidate {
            id: "candidate_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: Some("user_1".to_owned()),
            stream_key: "for_you".to_owned(),
            item_id: "item_ai".to_owned(),
            score: 990,
            reason_code: "interest_topic".to_owned(),
            trace_id: Some("trace_1".to_owned()),
            generated_at: "2026-06-06T01:01:00Z".to_owned(),
            expires_at: Some("2026-06-07T01:01:00Z".to_owned()),
        })
        .await
        .expect("upsert candidate");

    let candidates = store
        .list_feed_candidates(
            "tenant_1",
            Some("user_1"),
            "for_you",
            "2026-06-06T01:02:00Z",
            10,
        )
        .await
        .expect("list candidates");
    assert_eq!(candidates.len(), 1);
    assert_eq!(candidates[0].item_id, "item_ai");
    assert_eq!(candidates[0].reason_code, "interest_topic");

    store
        .upsert_item_metric_snapshot(NewNewsItemMetricSnapshot {
            id: "metric_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            item_id: "item_ai".to_owned(),
            impression_count: 1000,
            click_count: 330,
            share_count: 24,
            comment_count: 18,
            favorite_count: 42,
            reaction_count: 88,
            report_count: 1,
            hot_score: 765,
            computed_at: "2026-06-06T01:03:00Z".to_owned(),
        })
        .await
        .expect("upsert item metrics");

    let metrics = store
        .retrieve_item_metric_snapshot("tenant_1", "item_ai")
        .await
        .expect("retrieve metrics")
        .expect("metrics");
    assert_eq!(metrics.hot_score, 765);
    assert_eq!(metrics.click_count, 330);

    store
        .upsert_search_suggestion(NewNewsSearchSuggestion {
            id: "suggestion_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            normalized_query: "ai".to_owned(),
            display_query: "AI".to_owned(),
            suggestion_type: "hot".to_owned(),
            rank: 1,
            score: 950,
            locale: Some("zh-CN".to_owned()),
            computed_at: "2026-06-06T01:04:00Z".to_owned(),
        })
        .await
        .expect("upsert suggestion");

    let suggestions = store
        .list_search_suggestions("tenant_1", "a", 10)
        .await
        .expect("list suggestions");
    assert_eq!(suggestions.len(), 1);
    assert_eq!(suggestions[0].display_query, "AI");

    store
        .record_search_event(NewNewsSearchEvent {
            id: "search_event_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: Some("user_1".to_owned()),
            normalized_query: "ai".to_owned(),
            display_query: "AI".to_owned(),
            result_count: 20,
            clicked_item_id: Some("item_ai".to_owned()),
            trace_id: Some("trace_1".to_owned()),
            occurred_at: "2026-06-06T01:05:00Z".to_owned(),
        })
        .await
        .expect("record search event");
}

#[tokio::test]
async fn sqlite_news_store_supports_subscriptions_breaking_alerts_and_digests() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    let store = SqliteNewsStore::new(pool);
    store.migrate().await.expect("news migration");

    store
        .upsert_notification_subscription(NewNewsNotificationSubscription {
            id: "subscription_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            user_id: "user_1".to_owned(),
            target_type: "topic".to_owned(),
            target_id: "topic_ai".to_owned(),
            channel: "push".to_owned(),
            frequency: "breaking".to_owned(),
            quiet_start: Some("22:00".to_owned()),
            quiet_end: Some("07:00".to_owned()),
            locale: Some("zh-CN".to_owned()),
            updated_at: "2026-06-06T02:00:00Z".to_owned(),
        })
        .await
        .expect("upsert subscription");

    let subscriptions = store
        .list_notification_subscriptions("tenant_1", "user_1", 10)
        .await
        .expect("list subscriptions");
    assert_eq!(subscriptions.len(), 1);
    assert_eq!(subscriptions[0].target_id, "topic_ai");
    assert_eq!(subscriptions[0].frequency, "breaking");

    store
        .create_breaking_alert(NewNewsBreakingAlert {
            id: "alert_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            organization_id: "org_1".to_owned(),
            item_id: Some("item_ai".to_owned()),
            title: "AI breaking".to_owned(),
            summary: "AI breaking summary".to_owned(),
            severity: "breaking".to_owned(),
            audience_type: "all".to_owned(),
            target_type: Some("topic".to_owned()),
            target_id: Some("topic_ai".to_owned()),
            priority: 1,
            scheduled_at: Some("2026-06-06T02:10:00Z".to_owned()),
            expires_at: Some("2026-06-07T02:10:00Z".to_owned()),
            now: "2026-06-06T02:05:00Z".to_owned(),
        })
        .await
        .expect("create alert");
    assert!(store
        .list_active_breaking_alerts("tenant_1", "2026-06-06T02:06:00Z", 10)
        .await
        .expect("draft alerts")
        .is_empty());

    store
        .publish_breaking_alert("tenant_1", "alert_1", "2026-06-06T02:11:00Z")
        .await
        .expect("publish alert");
    let alerts = store
        .list_active_breaking_alerts("tenant_1", "2026-06-06T02:12:00Z", 10)
        .await
        .expect("list active alerts");
    assert_eq!(alerts.len(), 1);
    assert_eq!(alerts[0].title, "AI breaking");
    assert_eq!(alerts[0].severity, "breaking");

    store
        .create_digest_issue(NewNewsDigestIssue {
            id: "digest_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            digest_key: "daily-2026-06-06".to_owned(),
            title: "Daily briefing".to_owned(),
            summary: Some("Top AI news".to_owned()),
            digest_type: "daily".to_owned(),
            audience_type: "all".to_owned(),
            locale: Some("zh-CN".to_owned()),
            published_at: Some("2026-06-06T03:00:00Z".to_owned()),
            now: "2026-06-06T02:30:00Z".to_owned(),
        })
        .await
        .expect("create digest");
    store
        .attach_digest_item(NewNewsDigestItem {
            id: "digest_item_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            digest_id: "digest_1".to_owned(),
            item_id: "item_ai".to_owned(),
            rank: 1,
            section: Some("AI".to_owned()),
            reason: Some("editor-pick".to_owned()),
            created_at: "2026-06-06T02:31:00Z".to_owned(),
        })
        .await
        .expect("attach digest item");
    store
        .publish_digest_issue("tenant_1", "digest_1", "2026-06-06T03:00:00Z")
        .await
        .expect("publish digest");

    let digests = store
        .list_published_digest_issues("tenant_1", "2026-06-06T03:01:00Z", 10)
        .await
        .expect("list digests");
    assert_eq!(digests.len(), 1);
    assert_eq!(digests[0].digest_key, "daily-2026-06-06");

    let digest_items = store
        .list_digest_items("tenant_1", "digest_1", 10)
        .await
        .expect("list digest items");
    assert_eq!(digest_items.len(), 1);
    assert_eq!(digest_items[0].item_id, "item_ai");

    store
        .disable_notification_subscription("tenant_1", "subscription_1", "2026-06-06T04:00:00Z")
        .await
        .expect("disable subscription");
    assert!(store
        .list_notification_subscriptions("tenant_1", "user_1", 10)
        .await
        .expect("list disabled subscriptions")
        .is_empty());
}

#[tokio::test]
async fn sqlite_news_store_supports_trust_fact_checks_and_corrections() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    let store = SqliteNewsStore::new(pool);
    store.migrate().await.expect("news migration");

    store
        .upsert_source_trust_profile(NewNewsSourceTrustProfile {
            id: "trust_source_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            source_id: "source_main".to_owned(),
            trust_score: 92,
            trust_tier: "verified".to_owned(),
            credibility_status: "verified".to_owned(),
            fact_check_rating: Some("high".to_owned()),
            correction_count: 1,
            reviewer_user_id: Some("reviewer_1".to_owned()),
            notes: Some("Long-running verified newsroom".to_owned()),
            reviewed_at: "2026-06-06T05:00:00Z".to_owned(),
        })
        .await
        .expect("upsert source trust");

    let source_trust = store
        .retrieve_source_trust_profile("tenant_1", "source_main")
        .await
        .expect("retrieve source trust")
        .expect("source trust profile");
    assert_eq!(source_trust.trust_score, 92);
    assert_eq!(source_trust.trust_tier, "verified");

    store
        .create_fact_check(NewNewsFactCheck {
            id: "fact_check_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            item_id: Some("item_ai".to_owned()),
            claim: "AI model reached public safety benchmark".to_owned(),
            verdict: "mostly_true".to_owned(),
            summary: "Independent sources confirm the benchmark with caveats.".to_owned(),
            evidence_url: Some("https://example.com/fact-check".to_owned()),
            reviewer_user_id: Some("reviewer_1".to_owned()),
            now: "2026-06-06T05:10:00Z".to_owned(),
        })
        .await
        .expect("create fact check");
    assert!(store
        .list_published_fact_checks("tenant_1", Some("item_ai"), 10)
        .await
        .expect("draft fact checks")
        .is_empty());

    store
        .publish_fact_check("tenant_1", "fact_check_1", "2026-06-06T05:20:00Z")
        .await
        .expect("publish fact check");
    let fact_checks = store
        .list_published_fact_checks("tenant_1", Some("item_ai"), 10)
        .await
        .expect("list fact checks");
    assert_eq!(fact_checks.len(), 1);
    assert_eq!(fact_checks[0].verdict, "mostly_true");

    store
        .create_correction_notice(NewNewsCorrectionNotice {
            id: "correction_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            item_id: "item_ai".to_owned(),
            correction_type: "clarification".to_owned(),
            title: "Clarified benchmark scope".to_owned(),
            body: "The benchmark applies to the public evaluation set only.".to_owned(),
            actor_user_id: Some("editor_1".to_owned()),
            now: "2026-06-06T05:30:00Z".to_owned(),
        })
        .await
        .expect("create correction");
    store
        .publish_correction_notice("tenant_1", "correction_1", "2026-06-06T05:40:00Z")
        .await
        .expect("publish correction");
    let corrections = store
        .list_published_correction_notices("tenant_1", Some("item_ai"), 10)
        .await
        .expect("list corrections");
    assert_eq!(corrections.len(), 1);
    assert_eq!(corrections[0].correction_type, "clarification");

    store
        .upsert_item_trust_snapshot(NewNewsItemTrustSnapshot {
            id: "trust_item_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            item_id: "item_ai".to_owned(),
            trust_score: 88,
            source_trust_score: Some(92),
            fact_check_verdict: Some("mostly_true".to_owned()),
            correction_count: 1,
            risk_level: "low".to_owned(),
            computed_at: "2026-06-06T05:45:00Z".to_owned(),
        })
        .await
        .expect("upsert item trust");
    let item_trust = store
        .retrieve_item_trust_snapshot("tenant_1", "item_ai")
        .await
        .expect("retrieve item trust")
        .expect("item trust snapshot");
    assert_eq!(item_trust.trust_score, 88);
    assert_eq!(item_trust.risk_level, "low");
    assert_eq!(item_trust.correction_count, 1);
}

#[tokio::test]
async fn sqlite_news_store_supports_live_events_updates_and_item_links() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    let store = SqliteNewsStore::new(pool);
    store.migrate().await.expect("news migration");

    store
        .create_live_event(NewNewsLiveEvent {
            id: "live_event_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            organization_id: "org_1".to_owned(),
            slug: "election-night".to_owned(),
            title: "Election night live".to_owned(),
            summary: "Minute-by-minute election coverage".to_owned(),
            event_type: "developing_story".to_owned(),
            priority: 1,
            region: Some("US".to_owned()),
            locale: Some("en-US".to_owned()),
            started_at: Some("2026-06-06T06:00:00Z".to_owned()),
            now: "2026-06-06T06:00:00Z".to_owned(),
        })
        .await
        .expect("create live event");

    assert!(store
        .list_published_live_events("tenant_1", "2026-06-06T06:05:00Z", 10)
        .await
        .expect("draft live events")
        .is_empty());

    store
        .publish_live_event("tenant_1", "live_event_1", "2026-06-06T06:10:00Z")
        .await
        .expect("publish live event");

    let live_events = store
        .list_published_live_events("tenant_1", "2026-06-06T06:12:00Z", 10)
        .await
        .expect("list live events");
    assert_eq!(live_events.len(), 1);
    assert_eq!(live_events[0].slug, "election-night");
    assert_eq!(live_events[0].status, "published");

    store
        .create_live_update(NewNewsLiveUpdate {
            id: "live_update_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            live_event_id: "live_event_1".to_owned(),
            title: Some("First projections".to_owned()),
            body: "First official projections are coming in.".to_owned(),
            update_type: "text".to_owned(),
            importance: 90,
            source_id: Some("source_main".to_owned()),
            author_id: Some("author_main".to_owned()),
            item_id: Some("item_projection".to_owned()),
            now: "2026-06-06T06:15:00Z".to_owned(),
        })
        .await
        .expect("create live update");

    assert!(store
        .list_published_live_updates("tenant_1", "live_event_1", 10)
        .await
        .expect("draft live updates")
        .is_empty());

    store
        .publish_live_update("tenant_1", "live_update_1", "2026-06-06T06:20:00Z")
        .await
        .expect("publish live update");

    let live_updates = store
        .list_published_live_updates("tenant_1", "live_event_1", 10)
        .await
        .expect("list live updates");
    assert_eq!(live_updates.len(), 1);
    assert_eq!(live_updates[0].title.as_deref(), Some("First projections"));
    assert_eq!(live_updates[0].importance, 90);

    store
        .attach_item_to_live_event(NewNewsLiveEventItem {
            id: "live_item_1".to_owned(),
            tenant_id: "tenant_1".to_owned(),
            live_event_id: "live_event_1".to_owned(),
            item_id: "item_projection".to_owned(),
            relation_type: "source_article".to_owned(),
            rank: 1,
            note: Some("Full projection analysis".to_owned()),
            created_at: "2026-06-06T06:25:00Z".to_owned(),
        })
        .await
        .expect("attach live item");

    let live_items = store
        .list_live_event_items("tenant_1", "live_event_1", 10)
        .await
        .expect("list live items");
    assert_eq!(live_items.len(), 1);
    assert_eq!(live_items[0].item_id, "item_projection");
    assert_eq!(live_items[0].relation_type, "source_article");
}
