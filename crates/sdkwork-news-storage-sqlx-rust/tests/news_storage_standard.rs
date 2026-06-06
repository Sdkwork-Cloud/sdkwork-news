use sdkwork_news_storage_sqlx::{
    news_database_tables, news_migration_names, news_storage_capability_manifest,
    NewNewsCategory, NewNewsItem, SqliteNewsStore,
};
use sqlx::sqlite::SqlitePoolOptions;

#[test]
fn news_storage_manifest_declares_complete_news_tables_and_migrations() {
    let manifest = news_storage_capability_manifest();
    assert_eq!(manifest.name, "sdkwork-news-storage-sqlx");
    assert_eq!(manifest.schema_version, "news.storage.v1");
    assert_eq!(news_database_tables(), manifest.tables);
    assert_eq!(news_migration_names(), manifest.migrations);
    assert_eq!(
        manifest.tables,
        vec![
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
        ],
    );
    assert!(manifest.indexes.contains(&"idx_news_item_tenant_status_published_at"));
    assert!(manifest.indexes.contains(&"idx_news_item_tenant_slug"));
    assert_eq!(manifest.migration_plan[0].name, "0001_news_foundation.sql");
    assert!(manifest.migration_plan[0].sql.contains("CREATE TABLE news_item"));
}

#[test]
fn news_storage_repositories_bind_to_news_tables() {
    let manifest = news_storage_capability_manifest();
    let names = manifest
        .repository_bindings
        .iter()
        .map(|binding| binding.repository_name)
        .collect::<Vec<_>>();
    assert_eq!(names, vec!["news.category.repository", "news.item.repository", "news.read_state.repository", "news.audit.repository"]);
}

#[tokio::test]
async fn sqlite_news_store_migrates_creates_publishes_and_reads_news() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    let store = SqliteNewsStore::new(pool);
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
