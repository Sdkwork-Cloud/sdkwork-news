import { describe, expect, it } from "vitest";
import {
  buildNewsOverview,
  collectRelatedNewsItems,
  createNewsDetailRouteIntent,
  createNewsEditorRouteIntent,
  createNewsFeedRouteIntent,
  createNewsItemDigest,
  createNewsWorkspaceManifest,
  evaluateNewsEditorialReadiness,
  filterNewsItems,
  selectFeaturedNewsItem,
  summarizeNewsItemDigests,
} from "../src/index.ts";

const categories = [
  {
    description: "Product releases and roadmap updates.",
    id: "product",
    priority: 1,
    title: "Product",
  },
  {
    description: "Engineering and model infrastructure.",
    id: "tech",
    priority: 2,
    title: "Tech",
  },
  {
    description: "Community stories and case studies.",
    id: "community",
    priority: 3,
    title: "Community",
  },
  {
    description: "Launch events and summits.",
    id: "event",
    priority: 4,
    title: "Event",
  },
  {
    description: "Disabled experimental stream.",
    enabled: false,
    id: "labs",
    priority: 5,
    title: "Labs",
  },
] as const;

const items = [
  {
    authorName: "Product Team",
    categoryId: "product",
    estimatedReadMinutes: 6,
    featured: true,
    id: "vibe-release",
    priority: 1,
    publishedAt: "2026-03-28T08:00:00.000Z",
    slug: "vibe-coding-team-assets",
    status: "published",
    summary: "Vibe Coding now connects shared team assets and release pipelines.",
    tags: ["release", "vibe", "team"],
    title: "Vibe Coding unlocks team asset delivery",
    updatedAt: "2026-03-29T09:00:00.000Z",
  },
  {
    authorName: "Desktop Team",
    categoryId: "product",
    estimatedReadMinutes: 7,
    id: "sdkwork-shell-update",
    priority: 2,
    publishedAt: "2026-03-22T08:00:00.000Z",
    slug: "sdkwork-shell-editorial-refresh",
    status: "published",
    summary: "The desktop shell now ships a cleaner newsroom composition surface.",
    tags: ["release", "sdkwork", "desktop"],
    title: "Sdkwork shell refines the editorial workspace",
    updatedAt: "2026-03-23T09:00:00.000Z",
  },
  {
    authorName: "AI Infra Team",
    categoryId: "tech",
    estimatedReadMinutes: 5,
    id: "tech-ops-brief",
    priority: 1,
    publishedAt: "2026-03-25T08:00:00.000Z",
    slug: "model-ops-latency-brief",
    status: "published",
    summary: "The model operations team reduced routing latency for production inference.",
    tags: ["release", "latency", "infra"],
    title: "Model ops lowers inference latency",
    updatedAt: "2026-03-26T09:00:00.000Z",
  },
  {
    authorName: "IoT Engineering",
    categoryId: "tech",
    estimatedReadMinutes: 4,
    id: "aiot-optimizations",
    priority: 2,
    publishedAt: "2026-03-20T08:00:00.000Z",
    slug: "aiot-edge-routing-optimizations",
    status: "published",
    summary: "Edge routing updates improved AIoT deployment stability.",
    tags: ["release", "edge", "iot"],
    title: "AIoT edge routing gains a stability pass",
    updatedAt: "2026-03-21T09:00:00.000Z",
  },
  {
    authorName: "Developer Relations",
    categoryId: "community",
    estimatedReadMinutes: 8,
    id: "community-case-study",
    priority: 1,
    publishedAt: "2026-03-18T08:00:00.000Z",
    slug: "enterprise-agent-case-study",
    status: "published",
    summary: "An enterprise support team scaled issue triage with one agent workspace.",
    tags: ["case-study", "enterprise"],
    title: "Enterprise agent rollout shortens support queues",
    updatedAt: "2026-03-19T09:00:00.000Z",
  },
  {
    authorName: "Events Team",
    categoryId: "event",
    estimatedReadMinutes: 9,
    id: "roadmap-summit",
    priority: 1,
    publishedAt: "2026-04-10T08:00:00.000Z",
    slug: "spring-roadmap-summit",
    status: "scheduled",
    summary: "The next roadmap summit will preview the future appbase stack.",
    tags: ["summit", "roadmap"],
    title: "Spring roadmap summit opens registration",
    updatedAt: "2026-04-01T08:00:00.000Z",
  },
  {
    authorName: "Creative Studio",
    categoryId: "product",
    estimatedReadMinutes: 11,
    id: "draft-music-tooling",
    priority: 3,
    slug: "music-tooling-preview",
    status: "draft",
    summary: "A draft announcement for the next creative tooling release.",
    tags: ["music", "preview"],
    title: "Music tooling prepares its next release",
    updatedAt: "2026-04-02T08:00:00.000Z",
  },
  {
    authorName: "Labs Team",
    categoryId: "labs",
    estimatedReadMinutes: 3,
    id: "labs-note",
    priority: 1,
    publishedAt: "2026-03-15T08:00:00.000Z",
    slug: "labs-experiment-note",
    status: "published",
    summary: "Experimental notes that should not appear in enabled overviews.",
    tags: ["experiment"],
    title: "Labs note",
    updatedAt: "2026-03-16T09:00:00.000Z",
  },
] as const;

describe("sdkwork-news-pc-react", () => {
  it("filters published news by category, search query, and featured visibility with stable ordering", () => {
    expect(
      filterNewsItems(items, {
        categoryId: "tech",
        query: "release",
      }).map((item) => item.id),
    ).toEqual(["tech-ops-brief", "aiot-optimizations"]);

    expect(
      filterNewsItems(items, {
        categoryId: "product",
        includeFeatured: false,
        query: "release",
      }).map((item) => item.id),
    ).toEqual(["sdkwork-shell-update"]);
  });

  it("selects a featured news item using visible preference, explicit featured flags, and category fallback", () => {
    expect(
      selectFeaturedNewsItem(items, {
        preferredItemId: "tech-ops-brief",
      })?.id,
    ).toBe("tech-ops-brief");

    expect(
      selectFeaturedNewsItem(items, {
        categoryId: "product",
      })?.id,
    ).toBe("vibe-release");

    expect(
      selectFeaturedNewsItem(items, {
        categoryId: "community",
      })?.id,
    ).toBe("community-case-study");

    expect(
      selectFeaturedNewsItem(items, {
        categoryId: "event",
      }),
    ).toBeUndefined();
  });

  it("collects related published news using category matches before shared-tag fallbacks", () => {
    expect(
      collectRelatedNewsItems(items, "vibe-release").map((item) => item.id),
    ).toEqual(["sdkwork-shell-update", "tech-ops-brief", "aiot-optimizations"]);
  });

  it("builds a news overview with category summaries, featured selection, and editorial state buckets", () => {
    expect(
      buildNewsOverview({
        categories,
        items,
      }),
    ).toEqual({
      categorySummaries: [
        {
          draftItemIds: ["draft-music-tooling"],
          id: "product",
          itemIds: ["vibe-release", "sdkwork-shell-update", "draft-music-tooling"],
          priority: 1,
          publishedItemIds: ["vibe-release", "sdkwork-shell-update"],
          scheduledItemIds: [],
          title: "Product",
        },
        {
          draftItemIds: [],
          id: "tech",
          itemIds: ["tech-ops-brief", "aiot-optimizations"],
          priority: 2,
          publishedItemIds: ["tech-ops-brief", "aiot-optimizations"],
          scheduledItemIds: [],
          title: "Tech",
        },
        {
          draftItemIds: [],
          id: "community",
          itemIds: ["community-case-study"],
          priority: 3,
          publishedItemIds: ["community-case-study"],
          scheduledItemIds: [],
          title: "Community",
        },
        {
          draftItemIds: [],
          id: "event",
          itemIds: ["roadmap-summit"],
          priority: 4,
          publishedItemIds: [],
          scheduledItemIds: ["roadmap-summit"],
          title: "Event",
        },
      ],
      draftItemIds: ["draft-music-tooling"],
      featuredItemId: "vibe-release",
      feedItemIds: [
        "tech-ops-brief",
        "sdkwork-shell-update",
        "aiot-optimizations",
        "community-case-study",
      ],
      recentItemIds: [
        "vibe-release",
        "tech-ops-brief",
        "sdkwork-shell-update",
        "aiot-optimizations",
        "community-case-study",
      ],
      scheduledItemIds: ["roadmap-summit"],
      totalPublishedItems: 5,
    });
  });

  it("creates item digests and summarizes newsroom state", () => {
    expect(
      createNewsItemDigest(items[0], {
        activeCategoryId: "product",
        activeItemId: "vibe-release",
        categories,
        now: "2026-04-02T12:00:00.000Z",
        recentWindowDays: 7,
      }),
    ).toEqual({
      authorName: "Product Team",
      categoryId: "product",
      categoryTitle: "Product",
      digestStatus: "current",
      estimatedReadMinutes: 6,
      id: "vibe-release",
      isCurrent: true,
      isFeatured: true,
      isFresh: true,
      isRestricted: false,
      matchesCategory: true,
      publishedAt: "2026-03-28T08:00:00.000Z",
      route: "/news/vibe-coding-team-assets",
      slug: "vibe-coding-team-assets",
      status: "published",
      tagCount: 3,
      title: "Vibe Coding unlocks team asset delivery",
      updatedAt: "2026-03-29T09:00:00.000Z",
    });

    expect(
      createNewsItemDigest(items[5], {
        activeCategoryId: "product",
        activeItemId: "vibe-release",
        categories,
        now: "2026-04-02T12:00:00.000Z",
        recentWindowDays: 7,
      }),
    ).toEqual({
      authorName: "Events Team",
      categoryId: "event",
      categoryTitle: "Event",
      digestStatus: "scheduled",
      estimatedReadMinutes: 9,
      id: "roadmap-summit",
      isCurrent: false,
      isFeatured: false,
      isFresh: true,
      isRestricted: false,
      matchesCategory: false,
      publishedAt: "2026-04-10T08:00:00.000Z",
      route: "/news/spring-roadmap-summit",
      slug: "spring-roadmap-summit",
      status: "scheduled",
      tagCount: 2,
      title: "Spring roadmap summit opens registration",
      updatedAt: "2026-04-01T08:00:00.000Z",
    });

    expect(
      createNewsItemDigest(items[7], {
        categories,
        now: "2026-04-02T12:00:00.000Z",
        recentWindowDays: 7,
      }),
    ).toEqual({
      authorName: "Labs Team",
      categoryId: "labs",
      categoryTitle: "Labs",
      digestStatus: "restricted",
      estimatedReadMinutes: 3,
      id: "labs-note",
      isCurrent: false,
      isFeatured: false,
      isFresh: false,
      isRestricted: true,
      matchesCategory: true,
      publishedAt: "2026-03-15T08:00:00.000Z",
      route: "/news/labs-experiment-note",
      slug: "labs-experiment-note",
      status: "published",
      tagCount: 1,
      title: "Labs note",
      updatedAt: "2026-03-16T09:00:00.000Z",
    });

    expect(
      summarizeNewsItemDigests(
        items.map((item) =>
          createNewsItemDigest(item, {
            activeCategoryId: "product",
            activeItemId: "vibe-release",
            categories,
            now: "2026-04-02T12:00:00.000Z",
            recentWindowDays: 7,
          }),
        ),
      ),
    ).toEqual({
      currentItems: 1,
      draftItems: 1,
      featuredItems: 1,
      freshItems: 3,
      liveItems: 5,
      restrictedItems: 1,
      scheduledItems: 1,
      totalEstimatedReadMinutes: 53,
      totalItems: 8,
    });
  });

  it("evaluates editorial readiness for healthy, degraded, and blocked newsroom actions", () => {
    expect(
      evaluateNewsEditorialReadiness(items[6], {
        action: "publish",
        activeCategoryId: "product",
        categories,
        hasBody: true,
        minimumTags: 2,
      }),
    ).toEqual({
      capabilities: {
        canOpenDetail: false,
        canPublish: true,
        canSchedule: false,
      },
      checklist: {
        hasBody: true,
        hasCategory: true,
        hasMinimumTags: true,
        hasScheduleDate: false,
        hasSummary: true,
        hasTitle: true,
      },
      degraded: false,
      issues: [],
      ready: true,
    });

    expect(
      evaluateNewsEditorialReadiness(items[0], {
        action: "publish",
        activeCategoryId: "tech",
        categories,
        hasBody: true,
        minimumTags: 2,
      }),
    ).toEqual({
      capabilities: {
        canOpenDetail: true,
        canPublish: true,
        canSchedule: false,
      },
      checklist: {
        hasBody: true,
        hasCategory: true,
        hasMinimumTags: true,
        hasScheduleDate: false,
        hasSummary: true,
        hasTitle: true,
      },
      degraded: true,
      issues: ["category-mismatch"],
      ready: true,
    });

    expect(
      evaluateNewsEditorialReadiness(items[5], {
        action: "open-detail",
        categories,
      }),
    ).toEqual({
      capabilities: {
        canOpenDetail: false,
        canPublish: false,
        canSchedule: false,
      },
      checklist: {
        hasBody: false,
        hasCategory: true,
        hasMinimumTags: true,
        hasScheduleDate: false,
        hasSummary: true,
        hasTitle: true,
      },
      degraded: false,
      issues: ["unpublished"],
      ready: false,
    });

    expect(
      evaluateNewsEditorialReadiness(items[6], {
        action: "schedule",
        activeCategoryId: "product",
        categories,
        hasBody: true,
        minimumTags: 2,
      }),
    ).toEqual({
      capabilities: {
        canOpenDetail: false,
        canPublish: true,
        canSchedule: false,
      },
      checklist: {
        hasBody: true,
        hasCategory: true,
        hasMinimumTags: true,
        hasScheduleDate: false,
        hasSummary: true,
        hasTitle: true,
      },
      degraded: false,
      issues: ["scheduled-date-missing"],
      ready: false,
    });

    expect(
      evaluateNewsEditorialReadiness(items[7], {
        action: "publish",
        categories,
        hasBody: true,
      }),
    ).toEqual({
      capabilities: {
        canOpenDetail: false,
        canPublish: false,
        canSchedule: false,
      },
      checklist: {
        hasBody: true,
        hasCategory: false,
        hasMinimumTags: true,
        hasScheduleDate: false,
        hasSummary: true,
        hasTitle: true,
      },
      degraded: false,
      issues: ["category-disabled"],
      ready: false,
    });
  });

  it("builds news workspace manifests and route intents", () => {
    expect(
      createNewsWorkspaceManifest({
        packageNames: [
          "@sdkwork/news-pc-react",
          "@sdkwork/home-pc-react",
          "@sdkwork/news-pc-react",
        ],
        title: "News",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "news",
      description: "News workspace for editorial feeds, featured stories, and AI-assisted publishing entry points.",
      detailRoutePattern: "/news/:itemSlug",
      editorRoutePath: "/news/editor",
      host: "tauri",
      id: "sdkwork-news",
      packageNames: [
        "@sdkwork/news-pc-react",
        "@sdkwork/home-pc-react",
      ],
      routePath: "/news",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "News",
    });

    expect(
      createNewsFeedRouteIntent({
        categoryId: "tech",
        query: "release",
      }),
    ).toEqual({
      categoryId: "tech",
      focusWindow: true,
      query: "release",
      route: "/news?category=tech&query=release",
      source: "news-workspace",
      type: "news-feed-route-intent",
    });

    expect(
      createNewsDetailRouteIntent("vibe-coding-team-assets"),
    ).toEqual({
      focusWindow: true,
      itemSlug: "vibe-coding-team-assets",
      route: "/news/vibe-coding-team-assets",
      source: "news-workspace",
      type: "news-detail-route-intent",
    });

    expect(
      createNewsEditorRouteIntent({
        draftId: "draft-music-tooling",
        mode: "url",
        seed: "https://sdkwork.com/releases/edge-routing",
      }),
    ).toEqual({
      draftId: "draft-music-tooling",
      focusWindow: true,
      mode: "url",
      route: "/news/editor?mode=url&draftId=draft-music-tooling&seed=https%3A%2F%2Fsdkwork.com%2Freleases%2Fedge-routing",
      seed: "https://sdkwork.com/releases/edge-routing",
      source: "news-workspace",
      type: "news-editor-route-intent",
    });
  });
});
