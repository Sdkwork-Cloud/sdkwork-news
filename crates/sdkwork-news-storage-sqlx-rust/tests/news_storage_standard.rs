use sdkwork_news_storage_sqlx::{
    news_database_tables, news_migration_names, news_storage_capability_manifest,
    NewNewsCategory, NewNewsChannel, NewNewsChannelItem, NewNewsFavorite, NewNewsFeedCandidate,
    NewNewsItem, NewNewsItemMetricSnapshot, NewNewsReaction, NewNewsRecommendationEvent,
    NewNewsSearchEvent, NewNewsSearchSuggestion, NewNewsTrendingMetric, NewNewsUserFeedback,
    NewNewsUserInterestSignal, SqliteNewsStore,
};
use sqlx::sqlite::SqlitePoolOptions;

#[test]
fn news_storage_manifest_declares_complete_news_tables_and_migrations() {
    let manifest = news_storage_capability_manifest();
    assert_eq!(manifest.name, "sdkwork-news-storage-sqlx");
    assert_eq!(manifest.schema_version, "news.storage.v3");
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
    ] {
        assert!(manifest.tables.contains(&table), "missing table {table}");
    }
    assert!(manifest.indexes.contains(&"idx_news_item_tenant_status_published_at"));
    assert!(manifest.indexes.contains(&"idx_news_item_tenant_slug"));
    assert!(manifest.indexes.contains(&"idx_news_channel_tenant_status_priority"));
    assert!(manifest.indexes.contains(&"idx_news_channel_item_channel_rank"));
    assert!(manifest.indexes.contains(&"idx_news_recommendation_event_user_time"));
    assert!(manifest.indexes.contains(&"idx_news_user_feedback_user_target"));
    assert!(manifest.indexes.contains(&"idx_news_trending_metric_window_rank"));
    assert!(manifest.indexes.contains(&"idx_news_comment_item_status_time"));
    assert!(manifest.indexes.contains(&"idx_news_user_interest_signal_user_target"));
    assert!(manifest.indexes.contains(&"idx_news_feed_candidate_stream_score"));
    assert!(manifest.indexes.contains(&"idx_news_item_metric_snapshot_hot"));
    assert!(manifest.indexes.contains(&"idx_news_search_suggestion_query_rank"));
    assert!(manifest.indexes.contains(&"idx_news_search_event_query_time"));
    assert_eq!(manifest.migration_plan[0].name, "0001_news_foundation.sql");
    assert_eq!(manifest.migration_plan[1].name, "0002_news_industry_foundation.sql");
    assert_eq!(manifest.migration_plan[2].name, "0003_news_personalization_foundation.sql");
    assert!(manifest.migration_plan[0].sql.contains("CREATE TABLE news_item"));
    assert!(manifest.migration_plan[1].sql.contains("CREATE TABLE news_channel"));
    assert!(manifest.migration_plan[2].sql.contains("CREATE TABLE news_feed_candidate"));
}

#[test]
fn news_storage_repositories_bind_to_news_tables() {
    let manifest = news_storage_capability_manifest();
    let names = manifest
        .repository_bindings
        .iter()
        .map(|binding| binding.repository_name)
        .collect::<Vec<_>>();
    assert_eq!(names, vec![
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
    ]);
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
        .publish_item("tenant_1", "item_release", "user_editor", "2026-06-06T00:02:00Z")
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
        .publish_item("tenant_1", "item_world", "user_editor", "2026-06-06T00:02:00Z")
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

    sqlx::query(
        "UPDATE news_channel_item SET status = 'inactive', updated_at = ? WHERE id = ?",
    )
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
        .list_feed_candidates("tenant_1", Some("user_1"), "for_you", "2026-06-06T01:02:00Z", 10)
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
