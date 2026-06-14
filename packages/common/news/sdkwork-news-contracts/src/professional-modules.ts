export type NewsProfessionalModuleLayer =
  | "api-handler"
  | "integration-adapter"
  | "repository"
  | "sdk-port"
  | "service"
  | "worker";

export interface NewsProfessionalModuleMethodDefinition {
  readonly name: string;
  readonly operationIds?: readonly string[];
  readonly signature: string;
  readonly tables?: readonly string[];
  readonly todo: string;
}

export interface NewsProfessionalModuleDefinition {
  readonly className: string;
  readonly dependsOn: readonly string[];
  readonly filePath: string;
  readonly layer: NewsProfessionalModuleLayer;
  readonly methods: readonly NewsProfessionalModuleMethodDefinition[];
  readonly ownedTables?: readonly string[];
  readonly todo: string;
}

function method(
  name: string,
  signature: string,
  todo: string,
  options: Partial<Pick<NewsProfessionalModuleMethodDefinition, "operationIds" | "tables">> = {},
): NewsProfessionalModuleMethodDefinition {
  return {
    name,
    signature,
    todo,
    ...options,
  };
}

function module(
  layer: NewsProfessionalModuleLayer,
  filePath: string,
  className: string,
  methods: readonly NewsProfessionalModuleMethodDefinition[],
  options: Partial<Pick<NewsProfessionalModuleDefinition, "dependsOn" | "ownedTables" | "todo">> = {},
): NewsProfessionalModuleDefinition {
  return {
    className,
    dependsOn: options.dependsOn ?? [],
    filePath,
    layer,
    methods,
    todo: options.todo ?? `TODO(news-module): create ${className} in ${filePath} and wire it through the SDKWork service boundary.`,
    ...(options.ownedTables ? { ownedTables: options.ownedTables } : {}),
  };
}

export const NEWS_PROFESSIONAL_MODULES: readonly NewsProfessionalModuleDefinition[] = [
  module("service", "crates/sdkwork-content-news-service/src/service/story_service.rs", "NewsStoryService", [
    method("create_story", "fn create_story(command: CreateNewsStoryCommand) -> Result<NewsStory, NewsServiceError>", "TODO(news-service): validate tenant context, slug uniqueness, canonical item linkage, and audit events.", { operationIds: ["stories.create"], tables: ["news_story"] }),
    method("update_story", "fn update_story(story_id: &str, command: UpdateNewsStoryCommand) -> Result<NewsStory, NewsServiceError>", "TODO(news-service): enforce optimistic version checks and status transition policy.", { operationIds: ["stories.update"], tables: ["news_story"] }),
    method("publish_story", "fn publish_story(story_id: &str, command: PublishNewsStoryCommand) -> Result<NewsStory, NewsServiceError>", "TODO(news-service): publish story, update canonical URLs, and enqueue search/CDN projection jobs.", { operationIds: ["stories.publish"], tables: ["news_story", "news_canonical_url", "news_cdn_invalidation_job"] }),
    method("attach_story_item", "fn attach_story_item(story_id: &str, command: AttachStoryItemCommand) -> Result<(), NewsServiceError>", "TODO(news-service): persist ranked story item relation and rebuild public story projection.", { operationIds: ["stories.items.attach"], tables: ["news_story_item"] }),
    method("create_story_timeline", "fn create_story_timeline(story_id: &str, command: CreateStoryTimelineCommand) -> Result<NewsStoryTimeline, NewsServiceError>", "TODO(news-service): append timeline entry and link source or item evidence.", { operationIds: ["stories.timeline.create"], tables: ["news_story_timeline"] }),
  ], { dependsOn: ["NewsProfessionalRepository", "NewsSearchProjectionWorker"] }),
  module("service", "crates/sdkwork-content-news-service/src/service/editorial_workflow_service.rs", "NewsEditorialWorkflowService", [
    method("create_assignment", "fn create_assignment(command: CreateEditorialAssignmentCommand) -> Result<NewsEditorialAssignment, NewsServiceError>", "TODO(news-service): check editor permissions and create assignment with due date policy.", { operationIds: ["editorial.assignments.create"], tables: ["news_editorial_assignment"] }),
    method("update_assignment", "fn update_assignment(assignment_id: &str, command: UpdateEditorialAssignmentCommand) -> Result<NewsEditorialAssignment, NewsServiceError>", "TODO(news-service): enforce assignee ownership, workflow status transitions, and audit writes.", { operationIds: ["editorial.assignments.update"], tables: ["news_editorial_assignment"] }),
    method("list_review_tasks", "fn list_review_tasks(query: ReviewTaskQuery) -> Result<ReviewTaskPage, NewsServiceError>", "TODO(news-service): apply tenant, organization, reviewer, and status filters.", { operationIds: ["editorial.reviewTasks.list"], tables: ["news_review_task"] }),
    method("decide_review_task", "fn decide_review_task(task_id: &str, command: ReviewDecisionCommand) -> Result<NewsReviewTask, NewsServiceError>", "TODO(news-service): persist decision reason and emit review audit facts.", { operationIds: ["editorial.reviewTasks.update"], tables: ["news_review_task", "news_editorial_audit"] }),
  ], { dependsOn: ["NewsProfessionalRepository", "AppbaseIamPolicyPort"] }),
  module("service", "crates/sdkwork-content-news-service/src/service/trust_service.rs", "NewsTrustService", [
    method("upsert_item_rights", "fn upsert_item_rights(item_id: &str, command: UpsertNewsItemRightsCommand) -> Result<NewsItemRights, NewsServiceError>", "TODO(news-trust): validate license, embargo, and geography scope before persistence.", { operationIds: ["items.rights.upsert"], tables: ["news_item_rights"] }),
    method("upsert_c2pa_provenance", "fn upsert_c2pa_provenance(item_id: &str, command: UpsertC2paProvenanceCommand) -> Result<NewsC2paProvenance, NewsServiceError>", "TODO(news-trust): verify manifest hash and signer before updating provenance state.", { operationIds: ["items.c2paProvenance.upsert"], tables: ["news_c2pa_provenance"] }),
    method("recompute_item_trust", "fn recompute_item_trust(item_id: &str) -> Result<NewsItemTrustSnapshot, NewsServiceError>", "TODO(news-trust): combine source trust, fact checks, corrections, risk signals, and provenance.", { operationIds: ["trust.items.upsert"], tables: ["news_item_trust_snapshot", "news_source_trust_profile", "news_fact_check", "news_correction_notice"] }),
  ], { dependsOn: ["NewsProfessionalRepository", "NewsModerationAiIntegrationPort"] }),
  module("service", "crates/sdkwork-content-news-service/src/service/import_export_service.rs", "NewsImportExportService", [
    method("import_ninjs", "fn import_ninjs(command: ImportNinjsCommand) -> Result<NewsImportJob, NewsServiceError>", "TODO(news-integration): parse ninjs, deduplicate payload hash, and create normalized story/item/media facts.", { operationIds: ["imports.ninjs.create"], tables: ["news_import_job", "news_import_item"] }),
    method("import_newsml_g2", "fn import_newsml_g2(command: ImportNewsmlG2Command) -> Result<NewsImportJob, NewsServiceError>", "TODO(news-integration): parse NewsML-G2 packages and preserve provider identities.", { operationIds: ["imports.newsmlG2.create"], tables: ["news_import_job", "news_import_item"] }),
    method("export_ninjs", "fn export_ninjs(command: ExportNinjsCommand) -> Result<NewsExportJob, NewsServiceError>", "TODO(news-integration): export published item/story projections with privacy-safe fields only.", { operationIds: ["exports.ninjs.create"], tables: ["news_export_job"] }),
    method("export_schema_org", "fn export_schema_org(command: ExportSchemaOrgCommand) -> Result<NewsExportJob, NewsServiceError>", "TODO(news-integration): export JSON-LD snapshots for NewsArticle, LiveBlogPosting, and ClaimReview.", { operationIds: ["exports.schemaOrg.create"], tables: ["news_export_job", "news_schema_org_projection"] }),
  ], { dependsOn: ["NewsIndustryFormatAdapter", "NewsProfessionalRepository"] }),
  module("service", "crates/sdkwork-content-news-service/src/service/feed_personalization_service.rs", "NewsFeedPersonalizationService", [
    method("list_following_feed", "fn list_following_feed(query: FeedQuery) -> Result<NewsFeedPage, NewsServiceError>", "TODO(news-service): combine followed source/topic/channel graph with candidate scoring.", { operationIds: ["feed.following.list"], tables: ["news_follow", "news_feed_candidate"] }),
    method("list_latest_feed", "fn list_latest_feed(query: FeedQuery) -> Result<NewsFeedPage, NewsServiceError>", "TODO(news-service): return cursor-paginated latest published items with tenant filters.", { operationIds: ["feed.latest.list"], tables: ["news_item"] }),
    method("list_local_feed", "fn list_local_feed(query: FeedQuery) -> Result<NewsFeedPage, NewsServiceError>", "TODO(news-service): apply region and locale targeting from request context.", { operationIds: ["feed.local.list"], tables: ["news_item", "news_live_event"] }),
    method("record_share_event", "fn record_share_event(item_id: &str, command: RecordShareEventCommand) -> Result<(), NewsServiceError>", "TODO(news-service): write append-only share event and update item metric projection.", { operationIds: ["items.shareEvents.create"], tables: ["news_share_event", "news_item_metric_snapshot"] }),
  ], { dependsOn: ["NewsProfessionalRepository"] }),
  module("service", "crates/sdkwork-content-news-service/src/service/media_attachment_service.rs", "NewsMediaAttachmentService", [
    method("attach_drive_media", "fn attach_drive_media(item_id: &str, command: AttachDriveMediaCommand) -> Result<MediaResource, NewsServiceError>", "TODO(news-media): accept Drive references only and never persist presigned URLs as identity.", { operationIds: ["items.media.attach"], tables: ["news_media_asset", "news_item_media"] }),
    method("resolve_media_resource", "fn resolve_media_resource(media_id: &str) -> Result<MediaResource, NewsServiceError>", "TODO(news-media): request fresh Drive grants and redact provider object keys.", { operationIds: ["items.media.list"], tables: ["news_media_asset"] }),
  ], { dependsOn: ["NewsDriveMediaIntegrationPort"] }),
  module("service", "crates/sdkwork-content-news-service/src/service/compliance_policy_service.rs", "NewsCompliancePolicyService", [
    method("apply_legal_hold", "fn apply_legal_hold(command: ApplyLegalHoldCommand) -> Result<NewsLegalHold, NewsServiceError>", "TODO(news-compliance): persist legal hold, prevent destructive changes, and emit audit evidence.", { tables: ["news_legal_hold"] }),
    method("evaluate_retention_policy", "fn evaluate_retention_policy(command: RetentionPolicyCommand) -> Result<NewsRetentionDecision, NewsServiceError>", "TODO(news-compliance): evaluate retention policy, legal hold, archive, and deletion eligibility.", { tables: ["news_retention_policy", "news_legal_hold"] }),
  ], { dependsOn: ["NewsComplianceIntegrationPort"] }),
  module("repository", "crates/sdkwork-content-news-repository-sqlx/src/repository/professional_repository.rs", "NewsProfessionalRepository", [
    method("create_story", "async fn create_story(command: CreateStoryRow) -> Result<(), sqlx::Error>", "TODO(news-repository): insert news_story with tenant slug uniqueness and optimistic version defaults.", { tables: ["news_story"] }),
    method("attach_story_item", "async fn attach_story_item(command: StoryItemRow) -> Result<(), sqlx::Error>", "TODO(news-repository): insert relation with rank uniqueness and tenant predicate.", { tables: ["news_story_item"] }),
    method("record_api_operation_audit", "async fn record_api_operation_audit(row: ApiOperationAuditRow) -> Result<(), sqlx::Error>", "TODO(news-repository): append operation audit without leaking request payload or credentials.", { tables: ["news_api_operation_audit"] }),
  ], { ownedTables: ["news_story", "news_story_item", "news_story_timeline", "news_api_operation_audit"] }),
  module("repository", "crates/sdkwork-content-news-repository-sqlx/src/repository/external_feed_repository.rs", "NewsExternalFeedRepository", [
    method("claim_due_feed", "async fn claim_due_feed(now: &str) -> Result<Option<ExternalFeedRow>, sqlx::Error>", "TODO(news-repository): claim feed polling work with lock-safe status transition.", { tables: ["news_external_feed"] }),
    method("upsert_external_feed_item", "async fn upsert_external_feed_item(row: ExternalFeedItemRow) -> Result<(), sqlx::Error>", "TODO(news-repository): dedupe by external feed and provider external id.", { tables: ["news_external_feed_item"] }),
  ], { ownedTables: ["news_external_feed", "news_external_feed_item"] }),
  module("repository", "crates/sdkwork-content-news-repository-sqlx/src/repository/newsletter_repository.rs", "NewsNewsletterRepository", [
    method("create_newsletter_issue", "async fn create_newsletter_issue(row: NewsletterIssueRow) -> Result<(), sqlx::Error>", "TODO(news-repository): create issue with status, schedule, and publication timestamps.", { tables: ["news_newsletter_issue"] }),
    method("record_newsletter_delivery", "async fn record_newsletter_delivery(row: NewsletterDeliveryRow) -> Result<(), sqlx::Error>", "TODO(news-repository): write idempotent delivery event and provider message id.", { tables: ["news_newsletter_delivery"] }),
  ], { ownedTables: ["news_newsletter", "news_newsletter_issue", "news_newsletter_delivery"] }),
  module("repository", "crates/sdkwork-content-news-repository-sqlx/src/repository/paywall_repository.rs", "NewsPaywallRepository", [
    method("find_matching_rule", "async fn find_matching_rule(query: PaywallRuleQuery) -> Result<Option<PaywallRuleRow>, sqlx::Error>", "TODO(news-repository): query active rule by target and time window using tenant predicate.", { tables: ["news_paywall_rule"] }),
    method("record_metered_access_event", "async fn record_metered_access_event(row: MeteredAccessEventRow) -> Result<(), sqlx::Error>", "TODO(news-repository): append idempotent access event for user or anonymous visitor.", { tables: ["news_metered_access_event"] }),
  ], { ownedTables: ["news_paywall_rule", "news_metered_access_event"] }),
  module("api-handler", "crates/sdkwork-router-news-backend-api/src/handlers/professional_handlers.rs", "NewsProfessionalBackendApiHandler", [
    method("create_story", "async fn create_story(state: NewsState, context: NewsRequestContext, body: NewsStoryCommand) -> NewsHttpResult", "TODO(news-api): decode request, consume typed context, call NewsStoryService, and map problem details.", { operationIds: ["stories.create"] }),
    method("create_import_job", "async fn create_import_job(state: NewsState, context: NewsRequestContext, body: NewsImportCommand) -> NewsHttpResult", "TODO(news-api): require idempotency and call import/export service without parsing raw headers.", { operationIds: ["imports.ninjs.create", "imports.newsmlG2.create"] }),
    method("list_api_operation_audits", "async fn list_api_operation_audits(state: NewsState, context: NewsRequestContext, query: AuditQuery) -> NewsHttpResult", "TODO(news-api): enforce backend-admin audit permission and bounded pagination.", { operationIds: ["apiOperationAudits.list"] }),
  ]),
  module("api-handler", "crates/sdkwork-router-news-app-api/src/handlers/professional_handlers.rs", "NewsProfessionalAppApiHandler", [
    method("list_following_feed", "async fn list_following_feed(state: NewsState, context: NewsRequestContext, query: FeedQuery) -> NewsHttpResult", "TODO(news-api): call feed service with dual-token user context.", { operationIds: ["feed.following.list"] }),
    method("record_reading_progress", "async fn record_reading_progress(state: NewsState, context: NewsRequestContext, body: ReadingProgressCommand) -> NewsHttpResult", "TODO(news-api): record user progress without client-supplied request id.", { operationIds: ["items.readingProgress.upsert"] }),
  ]),
  module("api-handler", "crates/sdkwork-router-news-open-api/src/handlers/professional_handlers.rs", "NewsProfessionalOpenApiHandler", [
    method("retrieve_story", "async fn retrieve_story(state: NewsState, path: StoryPath) -> NewsHttpResult", "TODO(news-api): return public story projection with anonymous security and cache policy.", { operationIds: ["stories.retrieve"] }),
    method("retrieve_schema_org", "async fn retrieve_schema_org(state: NewsState, path: ItemPath) -> NewsHttpResult", "TODO(news-api): return JSON-LD projection without leaking backend-only fields.", { operationIds: ["items.schemaOrg.retrieve"] }),
  ]),
  module("worker", "crates/sdkwork-content-news-worker/src/jobs/search_projection_job.rs", "NewsSearchProjectionWorker", [
    method("rebuild_item_projection", "async fn rebuild_item_projection(item_id: &str) -> Result<(), NewsWorkerError>", "TODO(news-worker): rebuild search, schema.org, canonical URL, and CDN invalidation facts.", { tables: ["news_search_projection", "news_schema_org_projection", "news_canonical_url", "news_cdn_invalidation_job"] }),
    method("verify_projection_drift", "async fn verify_projection_drift(batch: ProjectionDriftBatch) -> Result<(), NewsWorkerError>", "TODO(news-worker): compare projection checksums with source versions and alert on drift.", { tables: ["news_search_projection", "news_schema_org_projection"] }),
  ]),
  module("worker", "crates/sdkwork-content-news-worker/src/jobs/external_feed_polling_job.rs", "NewsExternalFeedPollingWorker", [
    method("poll_due_feeds", "async fn poll_due_feeds(now: &str) -> Result<(), NewsWorkerError>", "TODO(news-worker): claim due feeds, call external feed adapter, and persist import jobs.", { tables: ["news_external_feed", "news_external_feed_item", "news_import_job"] }),
    method("retry_failed_feed_items", "async fn retry_failed_feed_items(batch: RetryBatch) -> Result<(), NewsWorkerError>", "TODO(news-worker): retry bounded failures without duplicating imported items.", { tables: ["news_external_feed_item"] }),
  ]),
  module("integration-adapter", "packages/common/news/sdkwork-news-contracts/src/professional-integrations.ts", "NewsIndustryFormatAdapter", [
    method("import_ninjs", "importNinjs(command: unknown): Promise<unknown>", "TODO(news-integration): parse ninjs into normalized source, author, story, item, media, rights, and trust commands."),
    method("import_newsml_g2", "importNewsmlG2(command: unknown): Promise<unknown>", "TODO(news-integration): parse NewsML-G2 with provider identity and idempotent payload hash."),
    method("export_schema_org", "exportSchemaOrg(command: unknown): Promise<unknown>", "TODO(news-integration): produce JSON-LD with reviewed public fields only."),
  ]),
  module("sdk-port", "packages/common/news/sdkwork-news-sdk-ports/src/professional.ts", "NewsProfessionalSdkPort", [
    method("bind_open_sdk", "bindOpenSdk(client: GeneratedNewsOpenSdk): SdkworkNewsProfessionalOpenSdkPort", "TODO(news-sdk): bind generated open SDK resource tree to professional open port."),
    method("bind_app_sdk", "bindAppSdk(client: GeneratedNewsAppSdk): SdkworkNewsProfessionalAppSdkPort", "TODO(news-sdk): bind generated app SDK resource tree to professional app port."),
    method("bind_backend_sdk", "bindBackendSdk(client: GeneratedNewsBackendSdk): SdkworkNewsProfessionalBackendSdkPort", "TODO(news-sdk): bind generated backend SDK resource tree to backend-admin professional port."),
  ]),
];

export function createNewsProfessionalModuleChecklist(): readonly string[] {
  return NEWS_PROFESSIONAL_MODULES.map(
    (item) => `TODO(news-module): implement ${item.className} at ${item.filePath} with ${item.methods.length} method interface(s).`,
  );
}
