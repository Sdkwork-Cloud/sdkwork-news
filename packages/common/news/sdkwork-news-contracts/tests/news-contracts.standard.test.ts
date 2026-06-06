import { describe, expect, it } from "vitest";
import {
  NEWS_APP_API_ROUTES,
  NEWS_BACKEND_API_ROUTES,
  NEWS_OPEN_API_ROUTES,
  NEWS_DOMAIN,
  NEWS_OWNER,
  NEWS_STATUS_VALUES,
  NEWS_TAG,
  createNewsItemDigest,
  evaluateNewsEditorialReadiness,
  filterNewsItems,
  type SdkworkNewsItem,
} from "../src/index.ts";

const items: SdkworkNewsItem[] = [
  {
    authorName: "Product Team",
    body: "Full release body",
    categoryId: "product",
    estimatedReadMinutes: 6,
    featured: true,
    id: "item_1",
    priority: 1,
    publishedAt: "2026-06-01T08:00:00.000Z",
    slug: "platform-release",
    status: "published",
    summary: "Platform release summary",
    tags: ["release", "platform"],
    tenantId: "tenant_1",
    title: "Platform release",
    updatedAt: "2026-06-01T09:00:00.000Z",
  },
  {
    body: "Draft body",
    categoryId: "product",
    id: "item_2",
    priority: 2,
    slug: "draft-roadmap",
    status: "draft",
    summary: "Roadmap draft",
    tags: ["roadmap"],
    tenantId: "tenant_1",
    title: "Roadmap draft",
  },
];

describe("sdkwork-news contracts", () => {
  it("declares canonical owner, domain, statuses, and API routes", () => {
    expect(NEWS_OWNER).toBe("sdkwork-news");
    expect(NEWS_DOMAIN).toBe("news");
    expect(NEWS_TAG).toBe("news");
    expect(NEWS_STATUS_VALUES).toEqual(["draft", "published", "scheduled", "archived"]);
    expect(NEWS_APP_API_ROUTES.map((route) => route.operationId)).toEqual([
      "categories.list",
      "items.list",
      "items.retrieve",
      "items.bySlug.retrieve",
      "overview.retrieve",
    ]);
    expect(NEWS_APP_API_ROUTES.every((route) => route.public === false)).toBe(true);
    expect(NEWS_OPEN_API_ROUTES.map((route) => route.operationId)).toEqual([
      "items.list",
      "items.retrieve",
      "items.bySlug.retrieve",
    ]);
    expect(NEWS_OPEN_API_ROUTES.every((route) => route.public === true)).toBe(true);
    expect(NEWS_BACKEND_API_ROUTES.map((route) => route.operationId)).toEqual([
      "categories.management.list",
      "categories.create",
      "categories.update",
      "categories.delete",
      "items.management.list",
      "items.create",
      "items.update",
      "items.delete",
      "items.publish",
      "items.schedule",
      "items.archive",
      "items.feature",
      "items.editorialReadiness.retrieve",
    ]);
  });

  it("filters, digests, and evaluates editorial readiness for news items", () => {
    expect(filterNewsItems(items, { statuses: ["published"], q: "release" }).map((item) => item.id)).toEqual(["item_1"]);
    expect(createNewsItemDigest(items[0]!, { basePath: "/news", now: "2026-06-03T00:00:00.000Z" })).toEqual({
      authorName: "Product Team",
      categoryId: "product",
      estimatedReadMinutes: 6,
      id: "item_1",
      isFeatured: true,
      isFresh: true,
      publishedAt: "2026-06-01T08:00:00.000Z",
      route: "/news/platform-release",
      slug: "platform-release",
      status: "published",
      tagCount: 2,
      title: "Platform release",
      updatedAt: "2026-06-01T09:00:00.000Z",
    });
    expect(evaluateNewsEditorialReadiness(items[1]!, { action: "publish", minimumTags: 1 })).toEqual({
      canArchive: false,
      canFeature: false,
      canPublish: true,
      canSchedule: false,
      issues: [],
      ready: true,
    });
  });
});
