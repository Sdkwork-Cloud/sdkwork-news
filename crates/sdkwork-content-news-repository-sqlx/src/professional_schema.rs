#[derive(Clone, Debug, Eq, PartialEq)]
pub enum NewsTableImplementationStatus {
    Implemented,
    Planned,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsProfessionalColumn {
    pub name: &'static str,
    pub logical_type: &'static str,
    pub nullable: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsProfessionalTable {
    pub name: &'static str,
    pub status: NewsTableImplementationStatus,
    pub columns: Vec<NewsProfessionalColumn>,
    pub todo: &'static str,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsProfessionalSchemaRegistry {
    pub domain: &'static str,
    pub capability: &'static str,
    pub tables: Vec<NewsProfessionalTable>,
}

pub trait NewsProfessionalRepositoryPort {
    fn create_story(&self) -> Result<(), NewsProfessionalRepositoryTodoError>;
    fn attach_story_item(&self) -> Result<(), NewsProfessionalRepositoryTodoError>;
    fn create_import_job(&self) -> Result<(), NewsProfessionalRepositoryTodoError>;
    fn create_export_job(&self) -> Result<(), NewsProfessionalRepositoryTodoError>;
    fn record_api_operation_audit(&self) -> Result<(), NewsProfessionalRepositoryTodoError>;
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NewsProfessionalRepositoryTodoError {
    pub message: &'static str,
}

pub fn news_professional_schema_registry() -> NewsProfessionalSchemaRegistry {
    let mut tables = crate::news_database_tables()
        .into_iter()
        .map(|name| {
            table(
                name,
                NewsTableImplementationStatus::Implemented,
                implemented_columns(name),
            )
        })
        .collect::<Vec<_>>();
    tables.extend(planned_tables());

    NewsProfessionalSchemaRegistry {
        domain: "content",
        capability: "news",
        tables,
    }
}

fn planned_tables() -> Vec<NewsProfessionalTable> {
    vec![
        table(
            "news_story",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("slug", "string", false),
                column("title", "string", false),
                column("story_type", "string", false),
                column("status", "string", false),
                column("created_at", "instant", false),
                column("updated_at", "instant", false),
                column("version", "int32", false),
            ],
        ),
        table(
            "news_story_item",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("story_id", "string", false),
                column("item_id", "string", false),
                column("relation_type", "string", false),
                column("rank", "int32", false),
            ],
        ),
        table(
            "news_story_timeline",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("story_id", "string", false),
                column("timeline_type", "string", false),
                column("occurred_at", "instant", false),
            ],
        ),
        table(
            "news_body_block",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("item_id", "string", false),
                column("block_type", "string", false),
                column("block_order", "int32", false),
                column("data_json", "json", true),
            ],
        ),
        table(
            "news_item_rights",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("item_id", "string", false),
                column("rights_status", "string", false),
                column("license_code", "string", true),
                column("embargo_until", "instant", true),
            ],
        ),
        table(
            "news_source_external_identity",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("source_id", "string", false),
                column("provider", "string", false),
                column("external_id", "string", false),
            ],
        ),
        table(
            "news_author_external_identity",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("author_id", "string", false),
                column("provider", "string", false),
                column("external_id", "string", false),
            ],
        ),
        table(
            "news_editorial_assignment",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("assignee_user_id", "string", false),
                column("assignment_role", "string", false),
                column("status", "string", false),
                column("due_at", "instant", true),
            ],
        ),
        table(
            "news_review_task",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("target_type", "string", false),
                column("target_id", "string", false),
                column("review_type", "string", false),
                column("status", "string", false),
            ],
        ),
        table(
            "news_import_job",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("import_format", "string", false),
                column("provider", "string", false),
                column("status", "string", false),
                column("provider_payload_hash", "string", false),
            ],
        ),
        table(
            "news_import_item",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("import_job_id", "string", false),
                column("external_item_id", "string", true),
                column("status", "string", false),
            ],
        ),
        table(
            "news_export_job",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("export_format", "string", false),
                column("status", "string", false),
                column("destination_uri", "string", true),
            ],
        ),
        table(
            "news_schema_org_projection",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("item_id", "string", false),
                column("schema_type", "string", false),
                column("json_ld", "json", false),
            ],
        ),
        table(
            "news_c2pa_provenance",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("item_id", "string", false),
                column("provenance_status", "string", false),
                column("manifest_hash", "string", true),
            ],
        ),
        table(
            "news_api_operation_audit",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("surface", "string", false),
                column("operation_id", "string", false),
                column("request_id", "string", false),
                column("occurred_at", "instant", false),
            ],
        ),
        table(
            "news_localization_variant",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("item_id", "string", false),
                column("locale", "string", false),
                column("status", "string", false),
            ],
        ),
        table(
            "news_canonical_url",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("target_type", "string", false),
                column("target_id", "string", false),
                column("canonical_url", "string", false),
            ],
        ),
        table(
            "news_homepage_layout",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("organization_id", "string", true),
                column("layout_key", "string", false),
                column("title", "string", false),
                column("locale", "string", true),
                column("status", "string", false),
                column("starts_at", "instant", true),
                column("ends_at", "instant", true),
                column("version", "int32", false),
            ],
        ),
        table(
            "news_homepage_slot",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("layout_id", "string", false),
                column("slot_key", "string", false),
                column("slot_type", "string", false),
                column("item_id", "string", true),
                column("story_id", "string", true),
                column("channel_id", "string", true),
                column("rank", "int32", false),
                column("pinned", "boolean", false),
            ],
        ),
        table(
            "news_external_feed",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("source_id", "string", false),
                column("provider", "string", false),
                column("feed_url", "string", false),
                column("feed_format", "string", false),
                column("poll_interval_seconds", "int32", false),
                column("etag", "string", true),
                column("last_polled_at", "instant", true),
                column("status", "string", false),
            ],
        ),
        table(
            "news_external_feed_item",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("external_feed_id", "string", false),
                column("external_id", "string", false),
                column("item_id", "string", true),
                column("provider_payload_hash", "string", false),
                column("status", "string", false),
                column("first_seen_at", "instant", false),
                column("last_seen_at", "instant", false),
            ],
        ),
        table(
            "news_syndication_partner",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("partner_key", "string", false),
                column("title", "string", false),
                column("delivery_mode", "string", false),
                column("status", "string", false),
                column("api_key_reference", "string", true),
                column("version", "int32", false),
            ],
        ),
        table(
            "news_syndication_delivery",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("partner_id", "string", false),
                column("item_id", "string", true),
                column("story_id", "string", true),
                column("delivery_format", "string", false),
                column("status", "string", false),
                column("attempt_count", "int32", false),
                column("idempotency_key", "string", false),
                column("payload_hash", "string", false),
            ],
        ),
        table(
            "news_newsletter",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("newsletter_key", "string", false),
                column("title", "string", false),
                column("description", "string", true),
                column("locale", "string", true),
                column("frequency", "string", false),
                column("status", "string", false),
                column("version", "int32", false),
            ],
        ),
        table(
            "news_newsletter_issue",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("newsletter_id", "string", false),
                column("issue_key", "string", false),
                column("title", "string", false),
                column("summary", "string", true),
                column("status", "string", false),
                column("scheduled_at", "instant", true),
                column("published_at", "instant", true),
                column("version", "int32", false),
            ],
        ),
        table(
            "news_newsletter_delivery",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("newsletter_issue_id", "string", false),
                column("user_id", "string", false),
                column("delivery_channel", "string", false),
                column("status", "string", false),
                column("provider", "string", true),
                column("provider_message_id", "string", true),
                column("idempotency_key", "string", false),
            ],
        ),
        table(
            "news_paywall_rule",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("rule_key", "string", false),
                column("target_type", "string", false),
                column("target_id", "string", true),
                column("entitlement_code", "string", false),
                column("meter_limit", "int32", true),
                column("window_days", "int32", true),
                column("status", "string", false),
                column("version", "int32", false),
            ],
        ),
        table(
            "news_metered_access_event",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("user_id", "string", true),
                column("anonymous_id", "string", true),
                column("item_id", "string", false),
                column("rule_id", "string", true),
                column("access_result", "string", false),
                column("occurred_at", "instant", false),
                column("idempotency_key", "string", false),
                column("payload_hash", "string", false),
            ],
        ),
        table(
            "news_cdn_invalidation_job",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("target_type", "string", false),
                column("target_id", "string", false),
                column("provider", "string", false),
                column("cache_key", "string", false),
                column("status", "string", false),
                column("attempt_count", "int32", false),
                column("requested_by_user_id", "string", true),
            ],
        ),
        table(
            "news_translation_job",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("item_id", "string", false),
                column("source_locale", "string", false),
                column("target_locale", "string", false),
                column("provider", "string", false),
                column("status", "string", false),
                column("requested_by_user_id", "string", true),
                column("payload_hash", "string", false),
            ],
        ),
        table(
            "news_translation_memory_entry",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("source_locale", "string", false),
                column("target_locale", "string", false),
                column("source_hash", "string", false),
                column("source_text", "text", false),
                column("translated_text", "text", false),
                column("provider", "string", true),
                column("quality_score", "int32", true),
                column("version", "int32", false),
            ],
        ),
        table(
            "news_legal_hold",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("target_type", "string", false),
                column("target_id", "string", false),
                column("hold_reason", "string", false),
                column("case_reference", "string", false),
                column("status", "string", false),
                column("starts_at", "instant", false),
                column("ends_at", "instant", true),
                column("created_by_user_id", "string", false),
            ],
        ),
        table(
            "news_retention_policy",
            NewsTableImplementationStatus::Planned,
            vec![
                column("id", "string", false),
                column("tenant_id", "string", false),
                column("policy_key", "string", false),
                column("target_type", "string", false),
                column("retention_days", "int32", false),
                column("delete_mode", "string", false),
                column("legal_hold_required", "boolean", false),
                column("status", "string", false),
                column("version", "int32", false),
            ],
        ),
    ]
}

fn implemented_columns(table_name: &str) -> Vec<NewsProfessionalColumn> {
    match table_name {
        "news_item" => vec![
            column("id", "string", false),
            column("tenant_id", "string", false),
            column("category_id", "string", false),
            column("slug", "string", false),
            column("title", "string", false),
            column("summary", "string", false),
            column("status", "string", false),
            column("created_at", "instant", false),
            column("updated_at", "instant", false),
        ],
        "news_item_body" => vec![
            column("item_id", "string", false),
            column("body_markdown", "text", false),
            column("body_format", "string", false),
            column("content_checksum", "string", true),
            column("updated_at", "instant", false),
        ],
        _ => vec![
            column("id", "string", false),
            column("tenant_id", "string", false),
            column("created_at", "instant", true),
            column("updated_at", "instant", true),
        ],
    }
}

fn table(
    name: &'static str,
    status: NewsTableImplementationStatus,
    columns: Vec<NewsProfessionalColumn>,
) -> NewsProfessionalTable {
    NewsProfessionalTable {
        name,
        status,
        columns,
        todo: "TODO(news-db): implement or verify migration, repository method, API DTO mapping, tenant indexes, and drift checks.",
    }
}

fn column(
    name: &'static str,
    logical_type: &'static str,
    nullable: bool,
) -> NewsProfessionalColumn {
    NewsProfessionalColumn {
        name,
        logical_type,
        nullable,
    }
}
