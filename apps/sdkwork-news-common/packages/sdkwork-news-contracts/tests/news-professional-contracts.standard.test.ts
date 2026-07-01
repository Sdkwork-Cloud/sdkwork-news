import { describe, expect, it } from "vitest";
import {
  NEWS_CAPABILITY,
  NEWS_NEWSROOM_INTEGRATION_CAPABILITIES,
  NEWS_PROFESSIONAL_API_OPERATIONS,
  NEWS_PROFESSIONAL_MODULES,
  NEWS_PROFESSIONAL_TABLES,
  NEWS_STANDARD_DOMAIN,
  createNewsProfessionalImplementationChecklist,
} from "../src/index.ts";

describe("sdkwork-news professional contract blueprint", () => {
  it("declares the content/news bounded context without breaking the legacy news SDK namespace", () => {
    expect(NEWS_STANDARD_DOMAIN).toBe("content");
    expect(NEWS_CAPABILITY).toBe("news");
  });

  it("defines implemented and planned database tables for a professional newsroom system", () => {
    const tableNames = new Set(NEWS_PROFESSIONAL_TABLES.map((table) => table.name));

    expect(NEWS_PROFESSIONAL_TABLES.length).toBeGreaterThanOrEqual(84);
    expect(tableNames.size).toBe(NEWS_PROFESSIONAL_TABLES.length);
    expect([...tableNames]).toEqual(
      expect.arrayContaining([
        "news_item",
        "news_item_body",
        "news_media_asset",
        "news_source",
        "news_author",
        "news_live_event",
        "news_story",
        "news_story_item",
        "news_body_block",
        "news_item_rights",
        "news_source_external_identity",
        "news_author_external_identity",
        "news_editorial_assignment",
        "news_review_task",
        "news_import_job",
        "news_export_job",
        "news_schema_org_projection",
        "news_c2pa_provenance",
        "news_api_operation_audit",
        "news_homepage_layout",
        "news_homepage_slot",
        "news_external_feed",
        "news_external_feed_item",
        "news_syndication_partner",
        "news_syndication_delivery",
        "news_newsletter",
        "news_newsletter_issue",
        "news_newsletter_delivery",
        "news_paywall_rule",
        "news_metered_access_event",
        "news_cdn_invalidation_job",
        "news_translation_job",
        "news_translation_memory_entry",
        "news_legal_hold",
        "news_retention_policy",
      ]),
    );

    const itemTable = NEWS_PROFESSIONAL_TABLES.find((table) => table.name === "news_item");
    expect(itemTable?.status).toBe("implemented");
    expect(itemTable?.columns.map((column) => column.name)).toEqual(
      expect.arrayContaining(["id", "tenant_id", "category_id", "slug", "title", "summary", "status", "created_at", "updated_at"]),
    );

    const storyTable = NEWS_PROFESSIONAL_TABLES.find((table) => table.name === "news_story");
    expect(storyTable?.status).toBe("planned");
    expect(storyTable?.columns.map((column) => column.name)).toEqual(
      expect.arrayContaining(["id", "tenant_id", "slug", "title", "story_type", "status", "created_at", "updated_at", "version"]),
    );
    expect(storyTable?.todo).toContain("TODO");
  });

  it("defines complete API operations for open, app, and backend news surfaces", () => {
    const operationKeys = new Set(
      NEWS_PROFESSIONAL_API_OPERATIONS.map((operation) => `${operation.surface} ${operation.method} ${operation.path}`),
    );

    expect(NEWS_PROFESSIONAL_API_OPERATIONS.length).toBeGreaterThanOrEqual(198);
    expect([...operationKeys]).toEqual(
      expect.arrayContaining([
        "open-api GET /open/v3/api/news/stories",
        "open-api GET /open/v3/api/news/stories/{storyId}",
        "open-api GET /open/v3/api/news/items/{itemId}/schema_org",
        "app-api GET /app/v3/api/news/feed/following",
        "app-api GET /app/v3/api/news/feed/latest",
        "app-api POST /app/v3/api/news/items/{itemId}/share_events",
        "backend-api POST /backend/v3/api/news/stories",
        "backend-api POST /backend/v3/api/news/imports/ninjs",
        "backend-api POST /backend/v3/api/news/imports/newsml_g2",
        "backend-api POST /backend/v3/api/news/exports/schema_org",
        "backend-api PUT /backend/v3/api/news/items/{itemId}/c2pa_provenance",
      ]),
    );

    const openOperations = NEWS_PROFESSIONAL_API_OPERATIONS.filter((operation) => operation.surface === "open-api");
    const protectedOperations = NEWS_PROFESSIONAL_API_OPERATIONS.filter((operation) => operation.surface !== "open-api");

    expect(openOperations.every((operation) => operation.authMode === "anonymous" && operation.public)).toBe(true);
    expect(protectedOperations.every((operation) => operation.authMode === "dual-token" && !operation.public)).toBe(true);

    const createStory = NEWS_PROFESSIONAL_API_OPERATIONS.find((operation) => operation.operationId === "stories.create");
    expect(createStory).toMatchObject({
      auditEvent: "content.news.story.created",
      idempotent: true,
      permission: "content.news.stories.write",
      surface: "backend-api",
    });
  });

  it("defines integration capabilities and TODO implementation handoff items", () => {
    expect(NEWS_NEWSROOM_INTEGRATION_CAPABILITIES.map((capability) => capability.key)).toEqual(
      expect.arrayContaining([
        "drive-media",
        "appbase-iam",
        "search-index",
        "notification-delivery",
        "analytics-warehouse",
        "newsml-g2",
        "ninjs",
        "schema-org",
        "c2pa-provenance",
        "external-feed",
        "syndication-delivery",
        "newsletter-delivery",
        "paywall-entitlement",
        "cdn-cache",
        "translation-localization",
        "moderation-ai",
        "privacy-compliance",
      ]),
    );

    const checklist = createNewsProfessionalImplementationChecklist();
    expect(checklist.length).toBeGreaterThanOrEqual(10);
    expect(checklist.every((item) => item.todo.startsWith("TODO"))).toBe(true);
  });

  it("defines implementation module files, class names, and TODO method interfaces for handoff agents", () => {
    expect(NEWS_PROFESSIONAL_MODULES.length).toBeGreaterThanOrEqual(18);
    expect(NEWS_PROFESSIONAL_MODULES.map((module) => module.className)).toEqual(
      expect.arrayContaining([
        "NewsStoryService",
        "NewsEditorialWorkflowService",
        "NewsProfessionalRepository",
        "NewsProfessionalBackendApiHandler",
        "NewsSearchProjectionWorker",
        "NewsIndustryFormatAdapter",
        "NewsCompliancePolicyService",
      ]),
    );
    expect(NEWS_PROFESSIONAL_MODULES.every((module) => module.filePath.startsWith("crates/") || module.filePath.startsWith("packages/") || module.filePath.startsWith("jobs/"))).toBe(true);
    expect(NEWS_PROFESSIONAL_MODULES.every((module) => module.methods.length > 0)).toBe(true);
    expect(NEWS_PROFESSIONAL_MODULES.flatMap((module) => module.methods).every((method) => method.todo.startsWith("TODO"))).toBe(true);
  });
});
