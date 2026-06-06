import { describe, expect, it } from "vitest";
import {
  NEWS_APP_API_ROUTES,
  NEWS_BACKEND_API_ROUTES,
  NEWS_OPEN_API_ROUTES,
  NEWS_DOMAIN,
  NEWS_OWNER,
  NEWS_STATUS_VALUES,
  NEWS_TAG,
  createNewsFeedEventDigest,
  createNewsItemDigest,
  evaluateNewsEditorialReadiness,
  filterNewsItems,
  type SdkworkNewsBreakingAlert,
  type SdkworkNewsChannel,
  type SdkworkNewsCorrectionNotice,
  type SdkworkNewsDigestIssue,
  type SdkworkNewsFactCheck,
  type SdkworkNewsLiveEvent,
  type SdkworkNewsLiveEventItem,
  type SdkworkNewsLiveUpdate,
  type SdkworkNewsNotificationSubscription,
  type SdkworkNewsRecommendationEvent,
  type SdkworkNewsItem,
  type SdkworkNewsItemTrustSnapshot,
  type SdkworkNewsSourceTrustProfile,
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
      "channels.list",
      "channels.feed.list",
      "topics.list",
      "topics.items.list",
      "feed.personalized.list",
      "items.related.list",
      "trending.list",
      "search.list",
      "search.suggestions.list",
      "events.create",
      "favorites.list",
      "favorites.create",
      "favorites.delete",
      "reactions.upsert",
      "comments.list",
      "comments.create",
      "reports.create",
      "feedback.create",
      "history.list",
      "follows.list",
      "follows.create",
      "follows.delete",
      "interests.list",
      "interests.upsert",
      "notification.subscriptions.list",
      "notification.subscriptions.upsert",
      "notification.subscriptions.delete",
      "alerts.breaking.list",
      "digests.list",
      "trust.item.retrieve",
      "factChecks.list",
      "corrections.list",
      "live.events.list",
      "live.events.retrieve",
      "live.updates.list",
    ]);
    expect(NEWS_APP_API_ROUTES.every((route) => route.public === false)).toBe(true);
    expect(NEWS_OPEN_API_ROUTES.map((route) => route.operationId)).toEqual([
      "items.list",
      "items.retrieve",
      "items.bySlug.retrieve",
      "channels.list",
      "channels.feed.list",
      "topics.list",
      "topics.items.list",
      "items.related.list",
      "trending.list",
      "search.list",
      "search.suggestions.list",
      "alerts.breaking.list",
      "digests.list",
      "trust.item.retrieve",
      "factChecks.list",
      "corrections.list",
      "live.events.list",
      "live.events.retrieve",
      "live.updates.list",
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
      "sources.management.list",
      "sources.create",
      "sources.update",
      "sources.delete",
      "authors.management.list",
      "authors.create",
      "authors.update",
      "authors.delete",
      "channels.management.list",
      "channels.create",
      "channels.update",
      "channels.delete",
      "topics.management.list",
      "topics.create",
      "topics.update",
      "topics.delete",
      "items.versions.list",
      "items.versions.create",
      "items.media.list",
      "items.media.attach",
      "items.media.delete",
      "moderation.cases.list",
      "moderation.cases.retrieve",
      "moderation.cases.update",
      "comments.moderation.list",
      "comments.moderation.update",
      "reports.management.list",
      "reports.update",
      "trending.metrics.list",
      "trending.metrics.upsert",
      "items.metrics.list",
      "items.metrics.retrieve",
      "items.metrics.rebuild",
      "feed.candidates.list",
      "feed.candidates.upsert",
      "feed.candidates.delete",
      "interests.management.list",
      "interests.rebuild",
      "interests.delete",
      "search.suggestions.management.list",
      "search.suggestions.upsert",
      "search.suggestions.delete",
      "search.events.list",
      "search.projections.rebuild",
      "experiments.management.list",
      "experiments.create",
      "experiments.update",
      "experiments.archive",
      "notification.subscriptions.management.list",
      "notification.subscriptions.delete",
      "alerts.breaking.management.list",
      "alerts.breaking.create",
      "alerts.breaking.update",
      "alerts.breaking.publish",
      "alerts.breaking.cancel",
      "digests.management.list",
      "digests.create",
      "digests.publish",
      "digests.items.attach",
      "trust.sources.management.list",
      "trust.sources.upsert",
      "trust.items.retrieve",
      "trust.items.upsert",
      "factChecks.management.list",
      "factChecks.create",
      "factChecks.publish",
      "factChecks.archive",
      "corrections.management.list",
      "corrections.create",
      "corrections.publish",
      "corrections.archive",
      "live.events.management.list",
      "live.events.create",
      "live.events.update",
      "live.events.publish",
      "live.events.close",
      "live.updates.create",
      "live.updates.update",
      "live.updates.publish",
      "live.items.attach",
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

  it("models industry news channels and recommendation events", () => {
    const channel: SdkworkNewsChannel = {
      id: "channel_top",
      slug: "top",
      status: "active",
      tenantId: "tenant_1",
      title: "Top News",
      type: "editorial",
    };
    const event: SdkworkNewsRecommendationEvent = {
      eventType: "impression",
      id: "event_1",
      itemId: "item_1",
      occurredAt: "2026-06-06T08:00:00.000Z",
      tenantId: "tenant_1",
      userId: "user_1",
    };

    expect(channel.type).toBe("editorial");
    expect(createNewsFeedEventDigest(event)).toEqual("impression:item_1:user_1");
  });

  it("models news-owned subscriptions, breaking alerts, and digests", () => {
    const subscription: SdkworkNewsNotificationSubscription = {
      channel: "push",
      frequency: "breaking",
      id: "subscription_1",
      status: "active",
      targetId: "topic_ai",
      targetType: "topic",
      tenantId: "tenant_1",
      updatedAt: "2026-06-06T08:00:00.000Z",
      userId: "user_1",
    };
    const alert: SdkworkNewsBreakingAlert = {
      audienceType: "all",
      id: "alert_1",
      priority: 1,
      severity: "breaking",
      status: "published",
      summary: "Important update",
      tenantId: "tenant_1",
      title: "Breaking",
      updatedAt: "2026-06-06T08:01:00.000Z",
    };
    const digest: SdkworkNewsDigestIssue = {
      digestKey: "daily-2026-06-06",
      digestType: "daily",
      id: "digest_1",
      status: "published",
      tenantId: "tenant_1",
      title: "Daily briefing",
      updatedAt: "2026-06-06T08:02:00.000Z",
    };

    expect(subscription.channel).toBe("push");
    expect(alert.severity).toBe("breaking");
    expect(digest.digestType).toBe("daily");
  });

  it("models news trust, fact checks, and correction notices", () => {
    const sourceTrust: SdkworkNewsSourceTrustProfile = {
      correctionCount: 1,
      credibilityStatus: "verified",
      id: "trust_source_1",
      reviewedAt: "2026-06-06T08:03:00.000Z",
      sourceId: "source_main",
      tenantId: "tenant_1",
      trustScore: 92,
      trustTier: "verified",
    };
    const factCheck: SdkworkNewsFactCheck = {
      claim: "AI benchmark claim",
      id: "fact_check_1",
      status: "published",
      summary: "Mostly true with caveats",
      tenantId: "tenant_1",
      updatedAt: "2026-06-06T08:04:00.000Z",
      verdict: "mostly_true",
    };
    const correction: SdkworkNewsCorrectionNotice = {
      body: "Clarified the benchmark scope.",
      correctionType: "clarification",
      id: "correction_1",
      itemId: "item_1",
      status: "published",
      tenantId: "tenant_1",
      title: "Clarification",
      updatedAt: "2026-06-06T08:05:00.000Z",
    };
    const itemTrust: SdkworkNewsItemTrustSnapshot = {
      computedAt: "2026-06-06T08:06:00.000Z",
      correctionCount: 1,
      itemId: "item_1",
      riskLevel: "low",
      tenantId: "tenant_1",
      trustScore: 88,
    };

    expect(sourceTrust.credibilityStatus).toBe("verified");
    expect(factCheck.verdict).toBe("mostly_true");
    expect(correction.correctionType).toBe("clarification");
    expect(itemTrust.riskLevel).toBe("low");
  });

  it("models live coverage events, timeline updates, and linked items", () => {
    const liveEvent: SdkworkNewsLiveEvent = {
      eventType: "developing_story",
      id: "live_event_1",
      priority: 1,
      publishedAt: "2026-06-06T08:00:00.000Z",
      slug: "election-night",
      status: "published",
      summary: "Minute-by-minute election coverage",
      tenantId: "tenant_1",
      title: "Election night live",
      updatedAt: "2026-06-06T08:00:00.000Z",
    };
    const liveUpdate: SdkworkNewsLiveUpdate = {
      body: "First official projections are coming in.",
      id: "live_update_1",
      importance: 90,
      liveEventId: "live_event_1",
      publishedAt: "2026-06-06T08:10:00.000Z",
      status: "published",
      tenantId: "tenant_1",
      title: "First projections",
      updateType: "text",
    };
    const liveItem: SdkworkNewsLiveEventItem = {
      itemId: "item_projection",
      rank: 1,
      relationType: "source_article",
    };

    expect(liveEvent.eventType).toBe("developing_story");
    expect(liveUpdate.importance).toBe(90);
    expect(liveItem.relationType).toBe("source_article");
  });
});
