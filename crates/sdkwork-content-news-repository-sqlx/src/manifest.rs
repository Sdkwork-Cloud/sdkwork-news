use super::models::*;

pub fn news_database_tables() -> Vec<&'static str> {
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
        "news_story",
        "news_story_item",
        "news_story_timeline",
        "news_body_block",
        "news_item_rights",
        "news_item_c2pa_provenance",
        "news_editorial_assignment",
        "news_editorial_review_task",
        "news_import_job",
        "news_export_job",
        "news_schema_org_projection",
        "news_api_operation_audit",
        "news_external_feed",
        "news_external_feed_item",
        "news_newsletter",
        "news_newsletter_item",
        "news_paywall_policy",
        "news_metered_access_event",
        "news_syndication_partner",
        "news_syndication_delivery",
        "news_translation_memory",
        "news_retention_policy",
        "news_legal_hold",
        "news_cdn_invalidation",
        "news_homepage_layout",
    ]
}

pub fn news_database_indexes() -> Vec<&'static str> {
    vec![
        "idx_news_category_tenant_priority",
        "idx_news_item_tenant_status_published_at",
        "idx_news_item_tenant_slug",
        "idx_news_item_tenant_category_status",
        "idx_news_item_tenant_featured_priority",
        "idx_news_tag_tenant_slug",
        "idx_news_item_tag_tag",
        "idx_news_publication_event_item",
        "idx_news_read_state_user_item",
        "idx_news_editorial_audit_item",
        "idx_news_source_tenant_status",
        "idx_news_author_tenant_source",
        "idx_news_item_version_item",
        "idx_news_media_asset_tenant_kind",
        "idx_news_item_media_item_role",
        "idx_news_topic_tenant_status_priority",
        "idx_news_item_topic_topic",
        "idx_news_channel_tenant_status_priority",
        "idx_news_channel_item_channel_rank",
        "idx_news_feed_stream_tenant_type",
        "idx_news_feed_cursor_user_stream",
        "idx_news_recommendation_event_user_time",
        "idx_news_recommendation_event_item_type",
        "idx_news_user_feedback_user_target",
        "idx_news_trending_metric_window_rank",
        "idx_news_search_projection_status",
        "idx_news_experiment_surface_status",
        "idx_news_experiment_assignment_user",
        "idx_news_comment_item_status_time",
        "idx_news_comment_parent",
        "idx_news_comment_moderation_comment",
        "idx_news_reaction_user_item",
        "idx_news_favorite_user_time",
        "idx_news_share_event_item_time",
        "idx_news_follow_user_target",
        "idx_news_report_target_status",
        "idx_news_moderation_case_status_priority",
        "idx_news_content_risk_signal_target",
        "idx_news_takedown_event_item_time",
        "idx_news_user_interest_signal_user_target",
        "idx_news_feed_candidate_stream_score",
        "idx_news_feed_candidate_user_stream_score",
        "idx_news_item_metric_snapshot_hot",
        "idx_news_search_suggestion_query_rank",
        "idx_news_search_event_query_time",
        "idx_news_search_event_user_time",
        "idx_news_notification_subscription_user_target",
        "idx_news_notification_subscription_target",
        "idx_news_breaking_alert_status_time",
        "idx_news_breaking_alert_target",
        "idx_news_digest_issue_status_time",
        "idx_news_digest_item_digest_rank",
        "idx_news_source_trust_profile_score",
        "idx_news_fact_check_item_status",
        "idx_news_fact_check_verdict_status",
        "idx_news_correction_notice_item_status",
        "idx_news_item_trust_snapshot_risk",
        "idx_news_live_event_status_priority",
        "idx_news_live_event_slug",
        "idx_news_live_update_event_status_time",
        "idx_news_live_update_item",
        "idx_news_live_event_item_event_rank",
        "idx_news_story_status_priority",
        "idx_news_story_item_story_rank",
        "idx_news_story_timeline_story_time",
        "idx_news_body_block_item_order",
        "idx_news_editorial_assignment_item",
        "idx_news_editorial_review_task_item",
        "idx_news_import_job_status",
        "idx_news_export_job_status",
        "idx_news_api_operation_audit_operation",
        "idx_news_external_feed_status",
        "idx_news_external_feed_item_status",
        "idx_news_newsletter_status",
        "idx_news_metered_access_event_user",
        "idx_news_syndication_delivery_status",
        "idx_news_cdn_invalidation_status",
    ]
}

pub fn news_migration_names() -> Vec<&'static str> {
    vec![
        "0001_news_foundation.sql",
        "0002_news_industry_foundation.sql",
        "0003_news_personalization_foundation.sql",
        "0004_news_alert_digest_foundation.sql",
        "0005_news_trust_correction_foundation.sql",
        "0006_news_live_coverage_foundation.sql",
        "0007_news_professional_newsroom_foundation.sql",
    ]
}

pub fn news_initial_migration_sql() -> &'static str {
    include_str!("../migrations/0001_news_foundation.sql")
}

pub fn news_industry_migration_sql() -> &'static str {
    include_str!("../migrations/0002_news_industry_foundation.sql")
}

pub fn news_personalization_migration_sql() -> &'static str {
    include_str!("../migrations/0003_news_personalization_foundation.sql")
}

pub fn news_alert_digest_migration_sql() -> &'static str {
    include_str!("../migrations/0004_news_alert_digest_foundation.sql")
}

pub fn news_trust_correction_migration_sql() -> &'static str {
    include_str!("../migrations/0005_news_trust_correction_foundation.sql")
}

pub fn news_live_coverage_migration_sql() -> &'static str {
    include_str!("../migrations/0006_news_live_coverage_foundation.sql")
}

pub fn news_professional_migration_sql() -> &'static str {
    include_str!("../migrations/0007_news_professional_newsroom_foundation.sql")
}

pub fn news_migration_plan() -> Vec<NewsStorageMigration> {
    vec![
        migration(
            1,
            "0001_news_foundation.sql",
            "news",
            "migrations/0001_news_foundation.sql",
            news_initial_migration_sql(),
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
        ),
        migration(
            2,
            "0002_news_industry_foundation.sql",
            "news",
            "migrations/0002_news_industry_foundation.sql",
            news_industry_migration_sql(),
            vec![
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
            ],
        ),
        migration(
            3,
            "0003_news_personalization_foundation.sql",
            "news",
            "migrations/0003_news_personalization_foundation.sql",
            news_personalization_migration_sql(),
            vec![
                "news_user_interest_signal",
                "news_feed_candidate",
                "news_item_metric_snapshot",
                "news_search_suggestion",
                "news_search_event",
            ],
        ),
        migration(
            4,
            "0004_news_alert_digest_foundation.sql",
            "news",
            "migrations/0004_news_alert_digest_foundation.sql",
            news_alert_digest_migration_sql(),
            vec![
                "news_notification_subscription",
                "news_breaking_alert",
                "news_digest_issue",
                "news_digest_item",
            ],
        ),
        migration(
            5,
            "0005_news_trust_correction_foundation.sql",
            "news",
            "migrations/0005_news_trust_correction_foundation.sql",
            news_trust_correction_migration_sql(),
            vec![
                "news_source_trust_profile",
                "news_fact_check",
                "news_correction_notice",
                "news_item_trust_snapshot",
            ],
        ),
        migration(
            6,
            "0006_news_live_coverage_foundation.sql",
            "news",
            "migrations/0006_news_live_coverage_foundation.sql",
            news_live_coverage_migration_sql(),
            vec![
                "news_live_event",
                "news_live_update",
                "news_live_event_item",
            ],
        ),
        migration(
            7,
            "0007_news_professional_newsroom_foundation.sql",
            "news",
            "migrations/0007_news_professional_newsroom_foundation.sql",
            news_professional_migration_sql(),
            vec![
                "news_story",
                "news_story_item",
                "news_story_timeline",
                "news_body_block",
                "news_item_rights",
                "news_item_c2pa_provenance",
                "news_editorial_assignment",
                "news_editorial_review_task",
                "news_import_job",
                "news_export_job",
                "news_schema_org_projection",
                "news_api_operation_audit",
                "news_external_feed",
                "news_external_feed_item",
                "news_newsletter",
                "news_newsletter_item",
                "news_paywall_policy",
                "news_metered_access_event",
                "news_syndication_partner",
                "news_syndication_delivery",
                "news_translation_memory",
                "news_retention_policy",
                "news_legal_hold",
                "news_cdn_invalidation",
                "news_homepage_layout",
            ],
        ),
    ]
}

pub fn news_repository_bindings() -> Vec<NewsRepositoryBinding> {
    vec![
        binding("news", "news.category.repository", vec!["news_category"]),
        binding(
            "news",
            "news.item.repository",
            vec![
                "news_item",
                "news_item_body",
                "news_tag",
                "news_item_tag",
                "news_publication_event",
            ],
        ),
        binding(
            "news",
            "news.read_state.repository",
            vec!["news_read_state"],
        ),
        binding(
            "news",
            "news.audit.repository",
            vec!["news_editorial_audit"],
        ),
        binding(
            "news",
            "news.channel.repository",
            vec!["news_channel", "news_channel_item"],
        ),
        binding(
            "news",
            "news.topic.repository",
            vec!["news_topic", "news_item_topic"],
        ),
        binding(
            "news",
            "news.media.repository",
            vec!["news_media_asset", "news_item_media"],
        ),
        binding(
            "news",
            "news.feed.repository",
            vec![
                "news_feed_stream",
                "news_feed_cursor",
                "news_recommendation_event",
                "news_user_feedback",
                "news_trending_metric",
                "news_search_projection",
            ],
        ),
        binding(
            "news",
            "news.engagement.repository",
            vec![
                "news_comment",
                "news_comment_moderation",
                "news_reaction",
                "news_favorite",
                "news_share_event",
                "news_follow",
                "news_report",
            ],
        ),
        binding(
            "news",
            "news.moderation.repository",
            vec![
                "news_moderation_case",
                "news_content_risk_signal",
                "news_takedown_event",
            ],
        ),
        binding(
            "news",
            "news.experiment.repository",
            vec!["news_experiment", "news_experiment_assignment"],
        ),
        binding(
            "news",
            "news.personalization.repository",
            vec!["news_user_interest_signal", "news_feed_candidate"],
        ),
        binding(
            "news",
            "news.metrics.repository",
            vec!["news_item_metric_snapshot"],
        ),
        binding(
            "news",
            "news.search.repository",
            vec![
                "news_search_projection",
                "news_search_suggestion",
                "news_search_event",
            ],
        ),
        binding(
            "news",
            "news.notification.repository",
            vec!["news_notification_subscription"],
        ),
        binding("news", "news.alert.repository", vec!["news_breaking_alert"]),
        binding(
            "news",
            "news.digest.repository",
            vec!["news_digest_issue", "news_digest_item"],
        ),
        binding(
            "news",
            "news.trust.repository",
            vec![
                "news_source_trust_profile",
                "news_fact_check",
                "news_correction_notice",
                "news_item_trust_snapshot",
            ],
        ),
        binding(
            "news",
            "news.live.repository",
            vec![
                "news_live_event",
                "news_live_update",
                "news_live_event_item",
            ],
        ),
        binding(
            "news",
            "news.story.repository",
            vec!["news_story", "news_story_item", "news_story_timeline"],
        ),
        binding(
            "news",
            "news.body_block.repository",
            vec!["news_body_block"],
        ),
        binding(
            "news",
            "news.rights.repository",
            vec!["news_item_rights", "news_item_c2pa_provenance"],
        ),
        binding(
            "news",
            "news.editorial.repository",
            vec!["news_editorial_assignment", "news_editorial_review_task"],
        ),
        binding(
            "news",
            "news.import_export.repository",
            vec!["news_import_job", "news_export_job"],
        ),
        binding(
            "news",
            "news.schema_org.repository",
            vec!["news_schema_org_projection"],
        ),
        binding(
            "news",
            "news.api_audit.repository",
            vec!["news_api_operation_audit"],
        ),
        binding(
            "news",
            "news.external_feed.repository",
            vec!["news_external_feed", "news_external_feed_item"],
        ),
        binding(
            "news",
            "news.newsletter.repository",
            vec!["news_newsletter", "news_newsletter_item"],
        ),
        binding(
            "news",
            "news.paywall.repository",
            vec!["news_paywall_policy", "news_metered_access_event"],
        ),
        binding(
            "news",
            "news.syndication.repository",
            vec!["news_syndication_partner", "news_syndication_delivery"],
        ),
        binding(
            "news",
            "news.translation.repository",
            vec!["news_translation_memory"],
        ),
        binding(
            "news",
            "news.compliance.repository",
            vec!["news_retention_policy", "news_legal_hold"],
        ),
        binding("news", "news.cdn.repository", vec!["news_cdn_invalidation"]),
        binding(
            "news",
            "news.homepage.repository",
            vec!["news_homepage_layout"],
        ),
    ]
}

pub fn news_storage_capability_manifest() -> NewsStorageCapabilityManifest {
    NewsStorageCapabilityManifest {
        name: "sdkwork-content-news-repository-sqlx",
        schema_version: "news.storage.v7",
        tables: news_database_tables(),
        indexes: news_database_indexes(),
        migrations: news_migration_names(),
        migration_plan: news_migration_plan(),
        repository_bindings: news_repository_bindings(),
    }
}

fn binding(
    domain: &'static str,
    repository_name: &'static str,
    tables: Vec<&'static str>,
) -> NewsRepositoryBinding {
    NewsRepositoryBinding {
        domain,
        repository_name,
        tables,
        requires_transaction: true,
    }
}

fn migration(
    sequence: u32,
    name: &'static str,
    domain: &'static str,
    source_path: &'static str,
    sql: &'static str,
    required_tables: Vec<&'static str>,
) -> NewsStorageMigration {
    NewsStorageMigration {
        sequence,
        name,
        domain,
        source_path,
        sql,
        checksum: migration_checksum(name, sql),
        required_tables,
    }
}

fn migration_checksum(name: &str, sql: &str) -> String {
    let mut hash = 0xcbf29ce484222325u64;
    for byte in name.bytes().chain(sql.bytes()) {
        hash ^= u64::from(byte);
        hash = hash.wrapping_mul(0x100000001b3);
    }
    format!("news-migration-checksum:{hash:016x}")
}
