export const NEWS_STANDARD_DOMAIN = "content" as const;
export const NEWS_CAPABILITY = "news" as const;

export type NewsTableImplementationStatus = "implemented" | "planned";
export type NewsTableFamily =
  | "api"
  | "distribution"
  | "editorial"
  | "engagement"
  | "integration"
  | "media"
  | "metrics"
  | "personalization"
  | "publishing"
  | "search"
  | "system"
  | "trust";
export type NewsTableProfile =
  | "audit_log"
  | "core_entity"
  | "dictionary_entity"
  | "event_log"
  | "projection"
  | "relation_entity"
  | "snapshot"
  | "tenant_entity"
  | "user_entity";
export type NewsColumnLogicalType =
  | "boolean"
  | "decimal"
  | "instant"
  | "int32"
  | "json"
  | "string"
  | "text";

export interface NewsColumnDefinition {
  readonly name: string;
  readonly logicalType: NewsColumnLogicalType;
  readonly nullable: boolean;
  readonly primaryKey?: boolean;
  readonly references?: string;
  readonly todo: string;
}

export interface NewsIndexDefinition {
  readonly columns: readonly string[];
  readonly name: string;
  readonly unique?: boolean;
  readonly todo: string;
}

export interface NewsTableDefinition {
  readonly columns: readonly NewsColumnDefinition[];
  readonly complianceLevel: "L2" | "L3";
  readonly family: NewsTableFamily;
  readonly indexes: readonly NewsIndexDefinition[];
  readonly lifecycle: "append_only" | "projection_rebuildable" | "soft_delete" | "stateful";
  readonly name: string;
  readonly profile: NewsTableProfile;
  readonly readConsumers: readonly string[];
  readonly source: "migration" | "professional-blueprint";
  readonly status: NewsTableImplementationStatus;
  readonly systemOfRecord: boolean;
  readonly todo: string;
  readonly writeOwner: string;
}

const implementedTableNames = [
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
] as const;

function inferColumnType(name: string): NewsColumnLogicalType {
  if (name.endsWith("_at") || name.endsWith("_for") || name.endsWith("_until") || name === "occurred_at") {
    return "instant";
  }
  if (
    name.endsWith("_count") ||
    name.endsWith("_score") ||
    name.endsWith("_rank") ||
    name.endsWith("_priority") ||
    name.endsWith("_seconds") ||
    name.endsWith("_days") ||
    name.endsWith("_limit") ||
    name === "version" ||
    name === "version_no" ||
    name === "allocation" ||
    name === "importance" ||
    name === "severity"
  ) {
    return "int32";
  }
  if (name.endsWith("_json") || name === "filter_json" || name === "resource_snapshot") {
    return "json";
  }
  if (name.startsWith("is_") || name === "enabled" || name === "featured" || name === "pinned") {
    return "boolean";
  }
  if (name === "body" || name === "body_markdown" || name === "json_ld" || name === "usage_terms") {
    return "text";
  }
  if (name === "duration_seconds") {
    return "decimal";
  }
  return "string";
}

function column(name: string, overrides: Partial<NewsColumnDefinition> = {}): NewsColumnDefinition {
  const inferredNullable =
    name.endsWith("_at") ||
    name.endsWith("_by") ||
    name.endsWith("_url") ||
    name.endsWith("_uri") ||
    name.endsWith("_json") ||
    name.startsWith("optional_");

  return {
    logicalType: inferColumnType(name),
    name,
    nullable: overrides.nullable ?? inferredNullable,
    todo: overrides.todo ?? `TODO(news-db): implement validation, serialization, and migration parity for ${name}.`,
    ...overrides,
  };
}

function columns(names: readonly string[], required: readonly string[] = ["id", "tenant_id"]): readonly NewsColumnDefinition[] {
  const requiredNames = new Set(required);
  return names.map((name) =>
    column(name, {
      nullable: !requiredNames.has(name),
      primaryKey: name === "id" || name === "item_id" && names.length <= 5,
    }),
  );
}

function index(name: string, columnsValue: readonly string[], unique = false): NewsIndexDefinition {
  return {
    columns: columnsValue,
    name,
    todo: `TODO(news-db): verify query plan and migration DDL for ${name}.`,
    ...(unique ? { unique } : {}),
  };
}

function table(
  status: NewsTableImplementationStatus,
  name: string,
  family: NewsTableFamily,
  profile: NewsTableProfile,
  columnNames: readonly string[],
  indexes: readonly NewsIndexDefinition[],
  options: Partial<Pick<NewsTableDefinition, "complianceLevel" | "lifecycle" | "readConsumers" | "systemOfRecord" | "writeOwner">> = {},
): NewsTableDefinition {
  return {
    columns: columns(columnNames),
    complianceLevel: options.complianceLevel ?? "L2",
    family,
    indexes,
    lifecycle: options.lifecycle ?? (profile === "projection" ? "projection_rebuildable" : profile === "audit_log" || profile === "event_log" ? "append_only" : "stateful"),
    name,
    profile,
    readConsumers: options.readConsumers ?? ["open-api", "app-api", "backend-api"],
    source: status === "implemented" ? "migration" : "professional-blueprint",
    status,
    systemOfRecord: options.systemOfRecord ?? (profile !== "projection" && profile !== "snapshot"),
    todo:
      status === "implemented"
        ? `TODO(news-db): keep ${name} synchronized with existing SQLx migrations and generated API DTOs.`
        : `TODO(news-db): create migration, repository methods, OpenAPI DTO mapping, and backfill plan for ${name}.`,
    writeOwner: options.writeOwner ?? "sdkwork-content-news-service",
  };
}

export const NEWS_IMPLEMENTED_TABLE_NAMES: readonly string[] = implementedTableNames;

export const NEWS_PROFESSIONAL_TABLES: readonly NewsTableDefinition[] = [
  table("implemented", "news_category", "publishing", "dictionary_entity", ["id", "tenant_id", "slug", "title", "description", "priority", "enabled", "created_at", "updated_at"], [
    index("uk_news_category_tenant_slug", ["tenant_id", "slug"], true),
    index("idx_news_category_tenant_priority", ["tenant_id", "enabled", "priority"]),
  ]),
  table("implemented", "news_item", "publishing", "tenant_entity", ["id", "tenant_id", "category_id", "slug", "title", "summary", "status", "author_user_id", "author_name", "featured", "priority", "estimated_read_minutes", "published_at", "scheduled_for", "archived_at", "created_at", "updated_at"], [
    index("uk_news_item_tenant_slug", ["tenant_id", "slug"], true),
    index("idx_news_item_tenant_status_published_at", ["tenant_id", "status", "published_at"]),
    index("idx_news_item_tenant_category_status", ["tenant_id", "category_id", "status"]),
    index("idx_news_item_tenant_featured_priority", ["tenant_id", "featured", "priority"]),
  ], { complianceLevel: "L3" }),
  table("implemented", "news_item_body", "publishing", "tenant_entity", ["item_id", "body_markdown", "body_format", "content_checksum", "updated_at"], [
    index("pk_news_item_body_item", ["item_id"], true),
  ], { complianceLevel: "L3" }),
  table("implemented", "news_tag", "publishing", "dictionary_entity", ["id", "tenant_id", "slug", "title", "created_at"], [
    index("uk_news_tag_tenant_slug", ["tenant_id", "slug"], true),
    index("idx_news_tag_tenant_slug", ["tenant_id", "slug"]),
  ]),
  table("implemented", "news_item_tag", "publishing", "relation_entity", ["item_id", "tag_id"], [
    index("pk_news_item_tag", ["item_id", "tag_id"], true),
    index("idx_news_item_tag_tag", ["tag_id", "item_id"]),
  ]),
  table("implemented", "news_publication_event", "publishing", "event_log", ["id", "tenant_id", "item_id", "event_type", "actor_user_id", "scheduled_for", "occurred_at"], [
    index("idx_news_publication_event_item", ["tenant_id", "item_id", "occurred_at"]),
  ], { lifecycle: "append_only", complianceLevel: "L3" }),
  table("implemented", "news_read_state", "engagement", "user_entity", ["id", "tenant_id", "item_id", "user_id", "read_at"], [
    index("uk_news_read_state_tenant_item_user", ["tenant_id", "item_id", "user_id"], true),
    index("idx_news_read_state_user_item", ["tenant_id", "user_id", "item_id"]),
  ]),
  table("implemented", "news_editorial_audit", "editorial", "audit_log", ["id", "tenant_id", "item_id", "action", "actor_user_id", "before_json", "after_json", "created_at"], [
    index("idx_news_editorial_audit_item", ["tenant_id", "item_id", "created_at"]),
  ], { complianceLevel: "L3" }),
  table("implemented", "news_schema_version", "system", "event_log", ["sequence", "name", "checksum", "applied_at"], [
    index("pk_news_schema_version", ["sequence"], true),
  ], { readConsumers: ["repository"], writeOwner: "sdkwork-content-news-repository-sqlx" }),
  table("implemented", "news_migration_lock", "system", "tenant_entity", ["lock_name", "lock_owner", "locked_until", "heartbeat_at", "created_at", "updated_at"], [
    index("pk_news_migration_lock", ["lock_name"], true),
  ], { readConsumers: ["repository"], writeOwner: "sdkwork-content-news-repository-sqlx" }),
  table("implemented", "news_source", "editorial", "tenant_entity", ["id", "tenant_id", "organization_id", "slug", "title", "source_type", "trust_tier", "locale", "region", "homepage_url", "status", "created_at", "updated_at", "version", "deleted_at", "deleted_by"], [
    index("uk_news_source_tenant_slug", ["tenant_id", "slug"], true),
    index("idx_news_source_tenant_status", ["tenant_id", "status", "title"]),
  ], { complianceLevel: "L3" }),
  table("implemented", "news_author", "editorial", "tenant_entity", ["id", "tenant_id", "organization_id", "source_id", "user_id", "slug", "display_name", "bio", "status", "created_at", "updated_at", "version", "deleted_at", "deleted_by"], [
    index("uk_news_author_tenant_slug", ["tenant_id", "slug"], true),
    index("idx_news_author_tenant_source", ["tenant_id", "source_id", "status"]),
  ]),
  table("implemented", "news_item_version", "editorial", "snapshot", ["id", "tenant_id", "item_id", "version_no", "title", "summary", "body_markdown", "content_checksum", "review_status", "actor_user_id", "created_at"], [
    index("uk_news_item_version_item_no", ["tenant_id", "item_id", "version_no"], true),
    index("idx_news_item_version_item", ["tenant_id", "item_id", "version_no"]),
  ], { lifecycle: "append_only", complianceLevel: "L3" }),
  table("implemented", "news_media_asset", "media", "tenant_entity", ["id", "tenant_id", "organization_id", "media_kind", "media_source", "uri", "url", "public_url", "mime_type", "size_bytes", "width", "height", "duration_seconds", "alt_text", "title", "metadata_json", "status", "created_at", "updated_at", "version", "deleted_at", "deleted_by"], [
    index("idx_news_media_asset_tenant_kind", ["tenant_id", "media_kind", "status"]),
  ], { complianceLevel: "L3" }),
  table("implemented", "news_item_media", "media", "relation_entity", ["id", "tenant_id", "item_id", "media_id", "media_role", "sort_order", "created_at"], [
    index("uk_news_item_media_role", ["tenant_id", "item_id", "media_id", "media_role"], true),
    index("idx_news_item_media_item_role", ["tenant_id", "item_id", "media_role", "sort_order"]),
  ]),
  table("implemented", "news_topic", "publishing", "dictionary_entity", ["id", "tenant_id", "organization_id", "slug", "title", "description", "status", "priority", "created_at", "updated_at", "version", "deleted_at", "deleted_by"], [
    index("uk_news_topic_tenant_slug", ["tenant_id", "slug"], true),
    index("idx_news_topic_tenant_status_priority", ["tenant_id", "status", "priority"]),
  ]),
  table("implemented", "news_item_topic", "publishing", "relation_entity", ["item_id", "topic_id", "tenant_id", "created_at"], [
    index("pk_news_item_topic", ["item_id", "topic_id"], true),
    index("idx_news_item_topic_topic", ["tenant_id", "topic_id", "item_id"]),
  ]),
  table("implemented", "news_channel", "distribution", "dictionary_entity", ["id", "tenant_id", "organization_id", "slug", "title", "description", "channel_type", "status", "priority", "created_at", "updated_at", "version", "deleted_at", "deleted_by"], [
    index("uk_news_channel_tenant_slug", ["tenant_id", "slug"], true),
    index("idx_news_channel_tenant_status_priority", ["tenant_id", "status", "priority"]),
  ]),
  table("implemented", "news_channel_item", "distribution", "relation_entity", ["id", "tenant_id", "channel_id", "item_id", "rank", "reason", "pinned", "status", "starts_at", "ends_at", "created_at", "updated_at"], [
    index("uk_news_channel_item", ["tenant_id", "channel_id", "item_id"], true),
    index("idx_news_channel_item_channel_rank", ["tenant_id", "channel_id", "status", "rank", "updated_at"]),
  ]),
  table("implemented", "news_feed_stream", "distribution", "dictionary_entity", ["id", "tenant_id", "organization_id", "stream_key", "stream_type", "title", "status", "created_at", "updated_at", "version"], [
    index("uk_news_feed_stream_key", ["tenant_id", "stream_key"], true),
    index("idx_news_feed_stream_tenant_type", ["tenant_id", "stream_type", "status"]),
  ]),
  table("implemented", "news_feed_cursor", "distribution", "user_entity", ["id", "tenant_id", "user_id", "stream_key", "cursor_value", "updated_at"], [
    index("uk_news_feed_cursor_user_stream", ["tenant_id", "user_id", "stream_key"], true),
    index("idx_news_feed_cursor_user_stream", ["tenant_id", "user_id", "stream_key"]),
  ]),
  table("implemented", "news_recommendation_event", "personalization", "event_log", ["id", "tenant_id", "user_id", "item_id", "channel_id", "event_type", "dwell_ms", "trace_id", "occurred_at", "idempotency_key", "payload_hash"], [
    index("uk_news_recommendation_event_idempotency", ["tenant_id", "idempotency_key"], true),
    index("idx_news_recommendation_event_user_time", ["tenant_id", "user_id", "occurred_at"]),
    index("idx_news_recommendation_event_item_type", ["tenant_id", "item_id", "event_type", "occurred_at"]),
  ], { lifecycle: "append_only", complianceLevel: "L3" }),
  table("implemented", "news_user_feedback", "personalization", "event_log", ["id", "tenant_id", "user_id", "target_type", "target_id", "feedback_type", "reason", "created_at"], [
    index("idx_news_user_feedback_user_target", ["tenant_id", "user_id", "target_type", "target_id"]),
  ]),
  table("implemented", "news_trending_metric", "metrics", "snapshot", ["id", "tenant_id", "item_id", "metric_window", "score", "rank", "computed_at"], [
    index("uk_news_trending_metric", ["tenant_id", "item_id", "metric_window"], true),
    index("idx_news_trending_metric_window_rank", ["tenant_id", "metric_window", "rank", "score"]),
  ], { systemOfRecord: false }),
  table("implemented", "news_search_projection", "search", "projection", ["id", "tenant_id", "item_id", "locale", "title_text", "summary_text", "tag_text", "topic_text", "status", "source_version", "rebuilt_at"], [
    index("uk_news_search_projection", ["tenant_id", "item_id", "locale"], true),
    index("idx_news_search_projection_status", ["tenant_id", "status", "rebuilt_at"]),
  ], { systemOfRecord: false, writeOwner: "news.search.indexer" }),
  table("implemented", "news_experiment", "personalization", "tenant_entity", ["id", "tenant_id", "experiment_key", "title", "surface", "status", "allocation", "starts_at", "ends_at", "created_at", "updated_at", "version", "archived_at"], [
    index("uk_news_experiment_key", ["tenant_id", "experiment_key"], true),
    index("idx_news_experiment_surface_status", ["tenant_id", "surface", "status"]),
  ]),
  table("implemented", "news_experiment_assignment", "personalization", "relation_entity", ["id", "tenant_id", "experiment_id", "user_id", "variant_key", "assigned_at"], [
    index("uk_news_experiment_assignment", ["tenant_id", "experiment_id", "user_id"], true),
    index("idx_news_experiment_assignment_user", ["tenant_id", "user_id", "experiment_id"]),
  ]),
  table("implemented", "news_comment", "engagement", "user_entity", ["id", "tenant_id", "item_id", "parent_id", "user_id", "body", "moderation_status", "status", "like_count", "reply_count", "created_at", "updated_at", "version", "deleted_at", "deleted_by"], [
    index("idx_news_comment_item_status_time", ["tenant_id", "item_id", "moderation_status", "created_at"]),
    index("idx_news_comment_parent", ["tenant_id", "parent_id", "created_at"]),
  ]),
  table("implemented", "news_comment_moderation", "engagement", "audit_log", ["id", "tenant_id", "comment_id", "action", "actor_user_id", "reason", "created_at"], [
    index("idx_news_comment_moderation_comment", ["tenant_id", "comment_id", "created_at"]),
  ]),
  table("implemented", "news_reaction", "engagement", "user_entity", ["id", "tenant_id", "user_id", "item_id", "reaction_type", "status", "created_at", "updated_at"], [
    index("uk_news_reaction_user_item", ["tenant_id", "user_id", "item_id"], true),
    index("idx_news_reaction_user_item", ["tenant_id", "user_id", "item_id"]),
  ]),
  table("implemented", "news_favorite", "engagement", "user_entity", ["id", "tenant_id", "user_id", "item_id", "status", "created_at", "deleted_at"], [
    index("uk_news_favorite_user_item", ["tenant_id", "user_id", "item_id"], true),
    index("idx_news_favorite_user_time", ["tenant_id", "user_id", "created_at"]),
  ]),
  table("implemented", "news_share_event", "engagement", "event_log", ["id", "tenant_id", "user_id", "item_id", "channel", "trace_id", "occurred_at"], [
    index("idx_news_share_event_item_time", ["tenant_id", "item_id", "occurred_at"]),
  ], { lifecycle: "append_only" }),
  table("implemented", "news_follow", "engagement", "user_entity", ["id", "tenant_id", "user_id", "target_type", "target_id", "status", "created_at", "deleted_at"], [
    index("uk_news_follow_user_target", ["tenant_id", "user_id", "target_type", "target_id"], true),
    index("idx_news_follow_user_target", ["tenant_id", "user_id", "target_type", "target_id"]),
  ]),
  table("implemented", "news_report", "engagement", "event_log", ["id", "tenant_id", "user_id", "target_type", "target_id", "reason", "status", "created_at", "updated_at", "resolved_at"], [
    index("idx_news_report_target_status", ["tenant_id", "target_type", "target_id", "status"]),
  ]),
  table("implemented", "news_moderation_case", "trust", "tenant_entity", ["id", "tenant_id", "target_type", "target_id", "reason", "priority", "status", "assignee_user_id", "created_at", "updated_at", "resolved_at", "version"], [
    index("idx_news_moderation_case_status_priority", ["tenant_id", "status", "priority", "created_at"]),
  ], { complianceLevel: "L3" }),
  table("implemented", "news_content_risk_signal", "trust", "event_log", ["id", "tenant_id", "target_type", "target_id", "signal_type", "severity", "source", "metadata_json", "created_at"], [
    index("idx_news_content_risk_signal_target", ["tenant_id", "target_type", "target_id", "severity"]),
  ], { lifecycle: "append_only", complianceLevel: "L3" }),
  table("implemented", "news_takedown_event", "trust", "audit_log", ["id", "tenant_id", "item_id", "action", "reason", "actor_user_id", "occurred_at"], [
    index("idx_news_takedown_event_item_time", ["tenant_id", "item_id", "occurred_at"]),
  ], { lifecycle: "append_only", complianceLevel: "L3" }),
  table("implemented", "news_user_interest_signal", "personalization", "user_entity", ["id", "tenant_id", "user_id", "target_type", "target_id", "affinity_score", "confidence", "source", "status", "created_at", "updated_at", "version", "deleted_at"], [
    index("uk_news_user_interest_signal", ["tenant_id", "user_id", "target_type", "target_id"], true),
    index("idx_news_user_interest_signal_user_target", ["tenant_id", "user_id", "status", "affinity_score", "updated_at"]),
  ]),
  table("implemented", "news_feed_candidate", "personalization", "projection", ["id", "tenant_id", "user_id", "stream_key", "item_id", "score", "reason_code", "trace_id", "status", "generated_at", "expires_at", "updated_at"], [
    index("uk_news_feed_candidate", ["tenant_id", "user_id", "stream_key", "item_id"], true),
    index("idx_news_feed_candidate_stream_score", ["tenant_id", "stream_key", "status", "score", "generated_at"]),
    index("idx_news_feed_candidate_user_stream_score", ["tenant_id", "user_id", "stream_key", "status", "score"]),
  ], { systemOfRecord: false, writeOwner: "news.recommendation.worker" }),
  table("implemented", "news_item_metric_snapshot", "metrics", "snapshot", ["id", "tenant_id", "item_id", "impression_count", "click_count", "share_count", "comment_count", "favorite_count", "reaction_count", "report_count", "hot_score", "computed_at", "updated_at"], [
    index("uk_news_item_metric_snapshot", ["tenant_id", "item_id"], true),
    index("idx_news_item_metric_snapshot_hot", ["tenant_id", "hot_score", "computed_at"]),
  ], { systemOfRecord: false }),
  table("implemented", "news_search_suggestion", "search", "projection", ["id", "tenant_id", "normalized_query", "display_query", "suggestion_type", "rank", "score", "locale", "status", "computed_at", "updated_at"], [
    index("uk_news_search_suggestion", ["tenant_id", "normalized_query", "suggestion_type", "locale"], true),
    index("idx_news_search_suggestion_query_rank", ["tenant_id", "status", "normalized_query", "rank", "score"]),
  ], { systemOfRecord: false, writeOwner: "news.search.indexer" }),
  table("implemented", "news_search_event", "search", "event_log", ["id", "tenant_id", "user_id", "normalized_query", "display_query", "result_count", "clicked_item_id", "trace_id", "occurred_at", "idempotency_key", "payload_hash"], [
    index("idx_news_search_event_query_time", ["tenant_id", "normalized_query", "occurred_at"]),
    index("idx_news_search_event_user_time", ["tenant_id", "user_id", "occurred_at"]),
  ], { lifecycle: "append_only" }),
  table("implemented", "news_notification_subscription", "distribution", "user_entity", ["id", "tenant_id", "user_id", "target_type", "target_id", "channel", "frequency", "status", "quiet_start", "quiet_end", "locale", "created_at", "updated_at", "version", "deleted_at"], [
    index("uk_news_notification_subscription", ["tenant_id", "user_id", "target_type", "target_id", "channel"], true),
    index("idx_news_notification_subscription_user_target", ["tenant_id", "user_id", "status", "target_type", "target_id"]),
    index("idx_news_notification_subscription_target", ["tenant_id", "target_type", "target_id", "status", "frequency"]),
  ]),
  table("implemented", "news_breaking_alert", "distribution", "tenant_entity", ["id", "tenant_id", "organization_id", "item_id", "title", "summary", "severity", "audience_type", "target_type", "target_id", "priority", "status", "scheduled_at", "published_at", "expires_at", "created_at", "updated_at", "version", "cancelled_at"], [
    index("idx_news_breaking_alert_status_time", ["tenant_id", "status", "priority", "published_at", "scheduled_at"]),
    index("idx_news_breaking_alert_target", ["tenant_id", "target_type", "target_id", "status"]),
  ], { complianceLevel: "L3" }),
  table("implemented", "news_digest_issue", "distribution", "tenant_entity", ["id", "tenant_id", "digest_key", "title", "summary", "digest_type", "audience_type", "locale", "status", "scheduled_at", "published_at", "created_at", "updated_at", "version", "archived_at"], [
    index("uk_news_digest_issue_key", ["tenant_id", "digest_key"], true),
    index("idx_news_digest_issue_status_time", ["tenant_id", "status", "published_at", "digest_key"]),
  ]),
  table("implemented", "news_digest_item", "distribution", "relation_entity", ["id", "tenant_id", "digest_id", "item_id", "rank", "section", "reason", "created_at"], [
    index("uk_news_digest_item", ["tenant_id", "digest_id", "item_id"], true),
    index("idx_news_digest_item_digest_rank", ["tenant_id", "digest_id", "rank"]),
  ]),
  table("implemented", "news_source_trust_profile", "trust", "snapshot", ["id", "tenant_id", "source_id", "trust_score", "trust_tier", "credibility_status", "fact_check_rating", "correction_count", "reviewer_user_id", "notes", "reviewed_at", "updated_at", "version"], [
    index("uk_news_source_trust_profile", ["tenant_id", "source_id"], true),
    index("idx_news_source_trust_profile_score", ["tenant_id", "credibility_status", "trust_score", "reviewed_at"]),
  ], { complianceLevel: "L3" }),
  table("implemented", "news_fact_check", "trust", "tenant_entity", ["id", "tenant_id", "item_id", "claim", "verdict", "summary", "evidence_url", "reviewer_user_id", "status", "published_at", "archived_at", "created_at", "updated_at", "version"], [
    index("idx_news_fact_check_item_status", ["tenant_id", "item_id", "status", "published_at"]),
    index("idx_news_fact_check_verdict_status", ["tenant_id", "verdict", "status", "published_at"]),
  ], { complianceLevel: "L3" }),
  table("implemented", "news_correction_notice", "trust", "tenant_entity", ["id", "tenant_id", "item_id", "correction_type", "title", "body", "actor_user_id", "status", "published_at", "archived_at", "created_at", "updated_at", "version"], [
    index("idx_news_correction_notice_item_status", ["tenant_id", "item_id", "status", "published_at"]),
  ], { complianceLevel: "L3" }),
  table("implemented", "news_item_trust_snapshot", "trust", "snapshot", ["id", "tenant_id", "item_id", "trust_score", "source_trust_score", "fact_check_verdict", "correction_count", "risk_level", "computed_at", "updated_at", "version"], [
    index("uk_news_item_trust_snapshot", ["tenant_id", "item_id"], true),
    index("idx_news_item_trust_snapshot_risk", ["tenant_id", "risk_level", "trust_score", "computed_at"]),
  ], { complianceLevel: "L3", systemOfRecord: false }),
  table("implemented", "news_live_event", "distribution", "tenant_entity", ["id", "tenant_id", "organization_id", "slug", "title", "summary", "event_type", "priority", "status", "region", "locale", "started_at", "published_at", "closed_at", "created_at", "updated_at", "version"], [
    index("uk_news_live_event_slug", ["tenant_id", "slug"], true),
    index("idx_news_live_event_status_priority", ["tenant_id", "status", "priority", "published_at", "started_at"]),
    index("idx_news_live_event_slug", ["tenant_id", "slug"]),
  ]),
  table("implemented", "news_live_update", "distribution", "event_log", ["id", "tenant_id", "live_event_id", "title", "body", "update_type", "importance", "source_id", "author_id", "item_id", "status", "published_at", "created_at", "updated_at", "version"], [
    index("idx_news_live_update_event_status_time", ["tenant_id", "live_event_id", "status", "published_at", "importance"]),
    index("idx_news_live_update_item", ["tenant_id", "item_id", "status", "published_at"]),
  ], { complianceLevel: "L3" }),
  table("implemented", "news_live_event_item", "distribution", "relation_entity", ["id", "tenant_id", "live_event_id", "item_id", "relation_type", "rank", "note", "created_at"], [
    index("uk_news_live_event_item", ["tenant_id", "live_event_id", "item_id", "relation_type"], true),
    index("idx_news_live_event_item_event_rank", ["tenant_id", "live_event_id", "rank", "item_id"]),
  ]),
  table("planned", "news_story", "editorial", "tenant_entity", ["id", "tenant_id", "organization_id", "slug", "title", "summary", "story_type", "status", "canonical_item_id", "locale", "region", "priority", "published_at", "closed_at", "created_at", "updated_at", "version", "deleted_at", "deleted_by"], [
    index("uk_news_story_tenant_slug", ["tenant_id", "slug"], true),
    index("idx_news_story_status_priority", ["tenant_id", "status", "priority", "published_at"]),
  ], { complianceLevel: "L3" }),
  table("planned", "news_story_item", "editorial", "relation_entity", ["id", "tenant_id", "story_id", "item_id", "relation_type", "rank", "pinned", "note", "created_at", "updated_at"], [
    index("uk_news_story_item", ["tenant_id", "story_id", "item_id", "relation_type"], true),
    index("idx_news_story_item_story_rank", ["tenant_id", "story_id", "rank"]),
  ], { complianceLevel: "L3" }),
  table("planned", "news_story_timeline", "editorial", "event_log", ["id", "tenant_id", "story_id", "timeline_type", "title", "body", "occurred_at", "source_id", "item_id", "status", "created_at", "updated_at"], [
    index("idx_news_story_timeline_story_time", ["tenant_id", "story_id", "occurred_at"]),
  ]),
  table("planned", "news_body_block", "editorial", "tenant_entity", ["id", "tenant_id", "item_id", "version_id", "block_type", "block_order", "body", "data_json", "media_id", "content_checksum", "created_at", "updated_at"], [
    index("idx_news_body_block_item_order", ["tenant_id", "item_id", "block_order"]),
  ], { complianceLevel: "L3" }),
  table("planned", "news_item_rights", "trust", "tenant_entity", ["id", "tenant_id", "item_id", "rights_status", "copyright_holder", "license_code", "embargo_until", "usage_terms", "geography_scope", "created_at", "updated_at", "version"], [
    index("uk_news_item_rights_item", ["tenant_id", "item_id"], true),
  ], { complianceLevel: "L3" }),
  table("planned", "news_source_external_identity", "integration", "relation_entity", ["id", "tenant_id", "source_id", "provider", "external_id", "external_url", "verification_status", "last_seen_at", "created_at", "updated_at"], [
    index("uk_news_source_external_identity", ["tenant_id", "provider", "external_id"], true),
    index("idx_news_source_external_identity_source", ["tenant_id", "source_id", "provider"]),
  ]),
  table("planned", "news_author_external_identity", "integration", "relation_entity", ["id", "tenant_id", "author_id", "provider", "external_id", "external_url", "verification_status", "last_seen_at", "created_at", "updated_at"], [
    index("uk_news_author_external_identity", ["tenant_id", "provider", "external_id"], true),
    index("idx_news_author_external_identity_author", ["tenant_id", "author_id", "provider"]),
  ]),
  table("planned", "news_editorial_assignment", "editorial", "tenant_entity", ["id", "tenant_id", "item_id", "story_id", "assignee_user_id", "assignment_role", "status", "due_at", "completed_at", "created_by_user_id", "created_at", "updated_at", "version"], [
    index("idx_news_editorial_assignment_assignee", ["tenant_id", "assignee_user_id", "status", "due_at"]),
    index("idx_news_editorial_assignment_target", ["tenant_id", "item_id", "story_id", "status"]),
  ], { complianceLevel: "L3" }),
  table("planned", "news_review_task", "editorial", "tenant_entity", ["id", "tenant_id", "target_type", "target_id", "review_type", "status", "reviewer_user_id", "decision", "decision_reason", "due_at", "completed_at", "created_at", "updated_at", "version"], [
    index("idx_news_review_task_reviewer", ["tenant_id", "reviewer_user_id", "status", "due_at"]),
    index("idx_news_review_task_target", ["tenant_id", "target_type", "target_id", "review_type"]),
  ], { complianceLevel: "L3" }),
  table("planned", "news_import_job", "integration", "event_log", ["id", "tenant_id", "organization_id", "source_id", "import_format", "provider", "status", "idempotency_key", "provider_event_id", "provider_payload_hash", "item_count", "error_count", "started_at", "completed_at", "created_at", "updated_at"], [
    index("uk_news_import_job_idempotency", ["tenant_id", "idempotency_key"], true),
    index("idx_news_import_job_status_time", ["tenant_id", "status", "created_at"]),
  ], { lifecycle: "append_only", complianceLevel: "L3" }),
  table("planned", "news_import_item", "integration", "event_log", ["id", "tenant_id", "import_job_id", "external_item_id", "item_id", "status", "error_message", "payload_hash", "created_at", "updated_at"], [
    index("idx_news_import_item_job_status", ["tenant_id", "import_job_id", "status"]),
  ], { lifecycle: "append_only" }),
  table("planned", "news_export_job", "integration", "event_log", ["id", "tenant_id", "organization_id", "export_format", "status", "filter_json", "destination_uri", "item_count", "error_count", "requested_by_user_id", "started_at", "completed_at", "created_at", "updated_at"], [
    index("idx_news_export_job_status_time", ["tenant_id", "status", "created_at"]),
  ], { lifecycle: "append_only", complianceLevel: "L3" }),
  table("planned", "news_schema_org_projection", "search", "projection", ["id", "tenant_id", "item_id", "schema_type", "json_ld", "source_version", "rebuilt_at", "status", "created_at", "updated_at"], [
    index("uk_news_schema_org_projection_item", ["tenant_id", "item_id", "schema_type"], true),
  ], { systemOfRecord: false, writeOwner: "news.schema-org.projector" }),
  table("planned", "news_c2pa_provenance", "trust", "snapshot", ["id", "tenant_id", "item_id", "media_id", "provenance_status", "manifest_uri", "manifest_hash", "signer", "verified_at", "created_at", "updated_at"], [
    index("idx_news_c2pa_provenance_item", ["tenant_id", "item_id", "provenance_status"]),
    index("idx_news_c2pa_provenance_media", ["tenant_id", "media_id", "provenance_status"]),
  ], { complianceLevel: "L3" }),
  table("planned", "news_api_operation_audit", "api", "audit_log", ["id", "tenant_id", "organization_id", "surface", "operation_id", "method", "path", "actor_user_id", "auth_mode", "request_id", "trace_id", "status_code", "idempotency_key", "occurred_at", "metadata_json"], [
    index("idx_news_api_operation_audit_operation", ["tenant_id", "surface", "operation_id", "occurred_at"]),
    index("idx_news_api_operation_audit_request", ["tenant_id", "request_id"]),
  ], { lifecycle: "append_only", complianceLevel: "L3", readConsumers: ["backend-api", "audit-export"] }),
  table("planned", "news_localization_variant", "editorial", "tenant_entity", ["id", "tenant_id", "item_id", "locale", "title", "summary", "body_markdown", "translator_user_id", "status", "published_at", "created_at", "updated_at", "version"], [
    index("uk_news_localization_variant_item_locale", ["tenant_id", "item_id", "locale"], true),
  ]),
  table("planned", "news_canonical_url", "publishing", "projection", ["id", "tenant_id", "target_type", "target_id", "canonical_url", "hreflang", "status", "created_at", "updated_at"], [
    index("uk_news_canonical_url_target_lang", ["tenant_id", "target_type", "target_id", "hreflang"], true),
  ], { systemOfRecord: false, writeOwner: "news.seo.projector" }),
  table("planned", "news_homepage_layout", "distribution", "tenant_entity", ["id", "tenant_id", "organization_id", "layout_key", "title", "locale", "status", "starts_at", "ends_at", "created_at", "updated_at", "version", "deleted_at", "deleted_by"], [
    index("uk_news_homepage_layout_key", ["tenant_id", "layout_key", "locale"], true),
    index("idx_news_homepage_layout_status_time", ["tenant_id", "status", "starts_at", "ends_at"]),
  ], { complianceLevel: "L3" }),
  table("planned", "news_homepage_slot", "distribution", "relation_entity", ["id", "tenant_id", "layout_id", "slot_key", "slot_type", "item_id", "story_id", "channel_id", "rank", "pinned", "starts_at", "ends_at", "created_at", "updated_at"], [
    index("uk_news_homepage_slot_rank", ["tenant_id", "layout_id", "slot_key", "rank"], true),
    index("idx_news_homepage_slot_layout", ["tenant_id", "layout_id", "slot_key", "rank"]),
  ], { complianceLevel: "L3" }),
  table("planned", "news_external_feed", "integration", "tenant_entity", ["id", "tenant_id", "source_id", "provider", "feed_url", "feed_format", "poll_interval_seconds", "etag", "last_modified_at", "last_polled_at", "status", "created_at", "updated_at", "version", "deleted_at"], [
    index("uk_news_external_feed_source_url", ["tenant_id", "source_id", "feed_url"], true),
    index("idx_news_external_feed_status_poll", ["tenant_id", "status", "last_polled_at"]),
  ]),
  table("planned", "news_external_feed_item", "integration", "event_log", ["id", "tenant_id", "external_feed_id", "external_id", "item_id", "provider_payload_hash", "status", "first_seen_at", "last_seen_at", "created_at", "updated_at"], [
    index("uk_news_external_feed_item_external", ["tenant_id", "external_feed_id", "external_id"], true),
    index("idx_news_external_feed_item_job_status", ["tenant_id", "external_feed_id", "status", "last_seen_at"]),
  ], { lifecycle: "append_only" }),
  table("planned", "news_syndication_partner", "integration", "tenant_entity", ["id", "tenant_id", "partner_key", "title", "delivery_mode", "status", "api_key_reference", "created_at", "updated_at", "version", "deleted_at"], [
    index("uk_news_syndication_partner_key", ["tenant_id", "partner_key"], true),
    index("idx_news_syndication_partner_status", ["tenant_id", "status", "delivery_mode"]),
  ], { complianceLevel: "L3" }),
  table("planned", "news_syndication_delivery", "integration", "event_log", ["id", "tenant_id", "partner_id", "item_id", "story_id", "delivery_format", "status", "attempt_count", "last_error", "delivered_at", "created_at", "updated_at", "idempotency_key", "payload_hash"], [
    index("uk_news_syndication_delivery_idempotency", ["tenant_id", "idempotency_key"], true),
    index("idx_news_syndication_delivery_partner_status", ["tenant_id", "partner_id", "status", "created_at"]),
  ], { lifecycle: "append_only", complianceLevel: "L3" }),
  table("planned", "news_newsletter", "distribution", "tenant_entity", ["id", "tenant_id", "newsletter_key", "title", "description", "locale", "frequency", "status", "created_at", "updated_at", "version", "deleted_at"], [
    index("uk_news_newsletter_key", ["tenant_id", "newsletter_key", "locale"], true),
    index("idx_news_newsletter_status_frequency", ["tenant_id", "status", "frequency"]),
  ]),
  table("planned", "news_newsletter_issue", "distribution", "tenant_entity", ["id", "tenant_id", "newsletter_id", "issue_key", "title", "summary", "status", "scheduled_at", "published_at", "created_at", "updated_at", "version"], [
    index("uk_news_newsletter_issue_key", ["tenant_id", "newsletter_id", "issue_key"], true),
    index("idx_news_newsletter_issue_status_time", ["tenant_id", "newsletter_id", "status", "scheduled_at", "published_at"]),
  ]),
  table("planned", "news_newsletter_delivery", "distribution", "event_log", ["id", "tenant_id", "newsletter_issue_id", "user_id", "delivery_channel", "status", "provider", "provider_message_id", "delivered_at", "opened_at", "clicked_at", "created_at", "updated_at", "idempotency_key"], [
    index("uk_news_newsletter_delivery_idempotency", ["tenant_id", "idempotency_key"], true),
    index("idx_news_newsletter_delivery_issue_status", ["tenant_id", "newsletter_issue_id", "status", "created_at"]),
  ], { lifecycle: "append_only" }),
  table("planned", "news_paywall_rule", "distribution", "tenant_entity", ["id", "tenant_id", "rule_key", "target_type", "target_id", "entitlement_code", "meter_limit", "window_days", "status", "starts_at", "ends_at", "created_at", "updated_at", "version"], [
    index("uk_news_paywall_rule_key", ["tenant_id", "rule_key"], true),
    index("idx_news_paywall_rule_target", ["tenant_id", "target_type", "target_id", "status"]),
  ], { complianceLevel: "L3" }),
  table("planned", "news_metered_access_event", "engagement", "event_log", ["id", "tenant_id", "user_id", "anonymous_id", "item_id", "rule_id", "access_result", "occurred_at", "idempotency_key", "payload_hash"], [
    index("uk_news_metered_access_event_idempotency", ["tenant_id", "idempotency_key"], true),
    index("idx_news_metered_access_event_user_time", ["tenant_id", "user_id", "occurred_at"]),
  ], { lifecycle: "append_only", complianceLevel: "L3" }),
  table("planned", "news_cdn_invalidation_job", "distribution", "event_log", ["id", "tenant_id", "target_type", "target_id", "provider", "cache_key", "status", "attempt_count", "last_error", "requested_by_user_id", "created_at", "completed_at"], [
    index("idx_news_cdn_invalidation_job_target", ["tenant_id", "target_type", "target_id", "status"]),
    index("idx_news_cdn_invalidation_job_status_time", ["tenant_id", "status", "created_at"]),
  ], { lifecycle: "append_only" }),
  table("planned", "news_translation_job", "editorial", "event_log", ["id", "tenant_id", "item_id", "source_locale", "target_locale", "provider", "status", "requested_by_user_id", "started_at", "completed_at", "created_at", "updated_at", "payload_hash"], [
    index("idx_news_translation_job_item_locale", ["tenant_id", "item_id", "target_locale", "status"]),
    index("idx_news_translation_job_status_time", ["tenant_id", "status", "created_at"]),
  ], { lifecycle: "append_only" }),
  table("planned", "news_translation_memory_entry", "editorial", "tenant_entity", ["id", "tenant_id", "source_locale", "target_locale", "source_hash", "source_text", "translated_text", "provider", "quality_score", "created_at", "updated_at", "version"], [
    index("uk_news_translation_memory_source", ["tenant_id", "source_locale", "target_locale", "source_hash"], true),
    index("idx_news_translation_memory_locale", ["tenant_id", "source_locale", "target_locale", "quality_score"]),
  ]),
  table("planned", "news_legal_hold", "trust", "audit_log", ["id", "tenant_id", "target_type", "target_id", "hold_reason", "case_reference", "status", "starts_at", "ends_at", "created_by_user_id", "created_at", "updated_at"], [
    index("idx_news_legal_hold_target", ["tenant_id", "target_type", "target_id", "status"]),
    index("idx_news_legal_hold_case", ["tenant_id", "case_reference", "status"]),
  ], { complianceLevel: "L3" }),
  table("planned", "news_retention_policy", "system", "dictionary_entity", ["id", "tenant_id", "policy_key", "target_type", "retention_days", "delete_mode", "legal_hold_required", "status", "created_at", "updated_at", "version"], [
    index("uk_news_retention_policy_key", ["tenant_id", "policy_key"], true),
    index("idx_news_retention_policy_target", ["tenant_id", "target_type", "status"]),
  ], { complianceLevel: "L3", writeOwner: "sdkwork-content-news-service" }),
];
