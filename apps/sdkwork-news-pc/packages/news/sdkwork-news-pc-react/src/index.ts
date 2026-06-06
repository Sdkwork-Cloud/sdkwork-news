export type SdkworkNewsItemStatus = "draft" | "published" | "scheduled" | "archived";
export type SdkworkNewsEditorMode = "topic" | "url";

export interface SdkworkNewsCategory {
  description?: string;
  enabled?: boolean;
  id: string;
  priority: number;
  tenantId?: string;
  title: string;
}

export interface SdkworkNewsItem {
  authorName?: string;
  body?: string;
  categoryId: string;
  estimatedReadMinutes?: number;
  featured?: boolean;
  id: string;
  priority: number;
  publishedAt?: string;
  scheduledFor?: string;
  slug: string;
  status: SdkworkNewsItemStatus;
  summary: string;
  tags?: readonly string[];
  tenantId?: string;
  title: string;
  updatedAt?: string;
}

export interface FilterNewsItemsOptions {
  categoryId?: string;
  includeFeatured?: boolean;
  q?: string;
  query?: string;
  statuses?: readonly SdkworkNewsItemStatus[];
}

export interface SelectFeaturedNewsItemOptions {
  categoryId?: string;
  preferredItemId?: string;
}

export interface CollectRelatedNewsItemsOptions {
  limit?: number;
}

export interface SdkworkNewsCategorySummary {
  draftItemIds: string[];
  id: string;
  itemIds: string[];
  priority: number;
  publishedItemIds: string[];
  scheduledItemIds: string[];
  title: string;
}

export interface SdkworkNewsOverview {
  categorySummaries: SdkworkNewsCategorySummary[];
  draftItemIds: string[];
  featuredItemId?: string;
  feedItemIds: string[];
  recentItemIds: string[];
  scheduledItemIds: string[];
  totalPublishedItems: number;
}

export interface BuildNewsOverviewInput {
  categories: readonly SdkworkNewsCategory[];
  items: readonly SdkworkNewsItem[];
}

export type SdkworkNewsItemDigestStatus =
  | "current"
  | "draft"
  | "featured"
  | "live"
  | "restricted"
  | "scheduled";

export interface CreateNewsItemDigestOptions {
  activeCategoryId?: string;
  activeItemId?: string;
  basePath?: string;
  categories?: readonly SdkworkNewsCategory[];
  now?: string;
  recentWindowDays?: number;
}

export interface SdkworkNewsItemDigest {
  authorName?: string;
  categoryId: string;
  categoryTitle?: string;
  digestStatus: SdkworkNewsItemDigestStatus;
  estimatedReadMinutes: number;
  id: string;
  isCurrent: boolean;
  isFeatured: boolean;
  isFresh: boolean;
  isRestricted: boolean;
  matchesCategory: boolean;
  publishedAt?: string;
  route: string;
  scheduledFor?: string;
  slug: string;
  status: SdkworkNewsItemStatus;
  tagCount: number;
  title: string;
  updatedAt?: string;
}

export interface SdkworkNewsItemDigestSummary {
  currentItems: number;
  draftItems: number;
  featuredItems: number;
  freshItems: number;
  liveItems: number;
  restrictedItems: number;
  scheduledItems: number;
  totalEstimatedReadMinutes: number;
  totalItems: number;
}

export type SdkworkNewsEditorialAction = "archive" | "feature" | "open-detail" | "publish" | "schedule";

export type SdkworkNewsEditorialIssue =
  | "category-disabled"
  | "category-mismatch"
  | "missing-body"
  | "missing-summary"
  | "missing-tags"
  | "missing-title"
  | "scheduled-date-missing"
  | "unpublished";

export interface EvaluateNewsEditorialReadinessOptions {
  action?: SdkworkNewsEditorialAction;
  activeCategoryId?: string;
  categories?: readonly SdkworkNewsCategory[];
  hasBody?: boolean;
  minimumTags?: number;
  scheduledFor?: string;
}

export interface SdkworkNewsEditorialChecklist {
  hasBody: boolean;
  hasCategory: boolean;
  hasMinimumTags: boolean;
  hasScheduleDate: boolean;
  hasSummary: boolean;
  hasTitle: boolean;
}

export interface SdkworkNewsEditorialCapabilities {
  canOpenDetail: boolean;
  canPublish: boolean;
  canSchedule: boolean;
}

export interface SdkworkNewsEditorialReadiness {
  capabilities: SdkworkNewsEditorialCapabilities;
  checklist: SdkworkNewsEditorialChecklist;
  degraded: boolean;
  issues: SdkworkNewsEditorialIssue[];
  ready: boolean;
}

export interface SdkworkNewsWorkspaceManifest {
  architecture: "pc-react";
  capability: "news";
  description?: string;
  detailRoutePattern: string;
  editorRoutePath: string;
  host: "browser" | "server" | "tauri";
  id: string;
  packageNames: string[];
  routePath: string;
  theme: {
    color: "lobster";
    preset: "sdkwork";
    selection: "system";
  };
  title: string;
}

export interface CreateNewsWorkspaceManifestOptions {
  description?: string;
  host?: "browser" | "server" | "tauri";
  id?: string;
  packageNames?: readonly string[];
  routePath?: string;
  title?: string;
}

export interface SdkworkNewsFeedRouteIntent {
  categoryId?: string;
  focusWindow: boolean;
  query?: string;
  route: string;
  source: "news-workspace";
  type: "news-feed-route-intent";
}

export interface CreateNewsFeedRouteIntentOptions {
  basePath?: string;
  categoryId?: string;
  focusWindow?: boolean;
  query?: string;
}

export interface SdkworkNewsDetailRouteIntent {
  focusWindow: boolean;
  itemSlug: string;
  route: string;
  source: "news-workspace";
  type: "news-detail-route-intent";
}

export interface CreateNewsDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

export interface SdkworkNewsEditorRouteIntent {
  draftId?: string;
  focusWindow: boolean;
  mode?: SdkworkNewsEditorMode;
  route: string;
  seed?: string;
  source: "news-workspace";
  type: "news-editor-route-intent";
}

export interface CreateNewsEditorRouteIntentOptions {
  basePath?: string;
  draftId?: string;
  focusWindow?: boolean;
  mode?: SdkworkNewsEditorMode;
  seed?: string;
}

export const NEWS_OWNER = "sdkwork-news" as const;
export const NEWS_DOMAIN = "news" as const;

const NEWS_STATUS_ORDER: readonly SdkworkNewsItemStatus[] = [
  "published",
  "scheduled",
  "draft",
  "archived",
];

function isEnabled(value: { enabled?: boolean }): boolean {
  return value.enabled !== false;
}

function comparePriorityTitle(
  left: { priority: number; title: string },
  right: { priority: number; title: string },
): number {
  if (left.priority !== right.priority) {
    return left.priority - right.priority;
  }
  return left.title.localeCompare(right.title);
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function parseTimestamp(value: string | undefined): number {
  if (!value) {
    return 0;
  }
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getPrimaryTimestamp(item: SdkworkNewsItem): number {
  if (item.status === "draft") {
    return parseTimestamp(item.updatedAt);
  }
  return Math.max(parseTimestamp(item.publishedAt), parseTimestamp(item.scheduledFor), parseTimestamp(item.updatedAt));
}

function compareTimestampDesc(left: SdkworkNewsItem, right: SdkworkNewsItem): number {
  const primaryDifference = getPrimaryTimestamp(right) - getPrimaryTimestamp(left);
  if (primaryDifference !== 0) {
    return primaryDifference;
  }
  const priorityDifference = comparePriorityTitle(left, right);
  if (priorityDifference !== 0) {
    return priorityDifference;
  }
  const updatedDifference = parseTimestamp(right.updatedAt) - parseTimestamp(left.updatedAt);
  if (updatedDifference !== 0) {
    return updatedDifference;
  }
  return left.slug.localeCompare(right.slug);
}

function compareOverviewItems(left: SdkworkNewsItem, right: SdkworkNewsItem): number {
  const statusDifference =
    NEWS_STATUS_ORDER.indexOf(left.status) - NEWS_STATUS_ORDER.indexOf(right.status);
  if (statusDifference !== 0) {
    return statusDifference;
  }
  return compareTimestampDesc(left, right);
}

function sortNewsItems(items: readonly SdkworkNewsItem[]): SdkworkNewsItem[] {
  return [...items].sort(compareTimestampDesc);
}

function sortNewsItemsForOverview(items: readonly SdkworkNewsItem[]): SdkworkNewsItem[] {
  return [...items].sort(compareOverviewItems);
}

function toUniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/news").trim();
  if (!normalized || normalized === "/") {
    return "/news";
  }
  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

function findNewsCategory(
  categories: readonly SdkworkNewsCategory[] | undefined,
  categoryId: string,
): SdkworkNewsCategory | undefined {
  return categories?.find((category) => category.id === categoryId);
}

function isNewsCategoryEnabled(
  categories: readonly SdkworkNewsCategory[] | undefined,
  categoryId: string,
): boolean {
  if (!categories) {
    return true;
  }
  const category = findNewsCategory(categories, categoryId);
  return category ? isEnabled(category) : false;
}

function isNewsItemFresh(
  item: SdkworkNewsItem,
  options: Pick<CreateNewsItemDigestOptions, "categories" | "now" | "recentWindowDays">,
): boolean {
  if (!isNewsCategoryEnabled(options.categories, item.categoryId)) {
    return false;
  }

  const primaryTimestamp = getPrimaryTimestamp(item);
  const updatedAtTimestamp = parseTimestamp(item.updatedAt);
  const freshnessTimestamp =
    primaryTimestamp > 0 && updatedAtTimestamp > 0
      ? Math.min(primaryTimestamp, updatedAtTimestamp)
      : Math.max(primaryTimestamp, updatedAtTimestamp);

  if (freshnessTimestamp <= 0) {
    return false;
  }
  const nowTimestamp = options.now ? parseTimestamp(options.now) : Date.now();
  if (nowTimestamp <= 0 || freshnessTimestamp > nowTimestamp) {
    return false;
  }
  const recentWindowDays = Math.max(0, options.recentWindowDays ?? 7);
  return nowTimestamp - freshnessTimestamp <= recentWindowDays * 24 * 60 * 60 * 1000;
}

function resolveNewsItemDigestStatus(
  item: SdkworkNewsItem,
  options: Pick<CreateNewsItemDigestOptions, "activeItemId" | "categories">,
): SdkworkNewsItemDigestStatus {
  if (!isNewsCategoryEnabled(options.categories, item.categoryId)) {
    return "restricted";
  }
  if (item.id === options.activeItemId) {
    return "current";
  }
  if (item.featured === true && item.status === "published") {
    return "featured";
  }
  if (item.status === "scheduled") {
    return "scheduled";
  }
  if (item.status === "draft") {
    return "draft";
  }
  return "live";
}

function toUniqueNewsEditorialIssues(
  issues: readonly SdkworkNewsEditorialIssue[],
): SdkworkNewsEditorialIssue[] {
  return Array.from(new Set(issues));
}

function matchesQuery(item: SdkworkNewsItem, query: string): boolean {
  if (!query) {
    return true;
  }
  const tagText = item.tags?.join(" ").toLowerCase() ?? "";
  return (
    item.title.toLowerCase().includes(query) ||
    item.summary.toLowerCase().includes(query) ||
    tagText.includes(query)
  );
}

function sharedTagCount(left: readonly string[] | undefined, right: readonly string[] | undefined): number {
  if (!left?.length || !right?.length) {
    return 0;
  }
  const rightTags = new Set(right.map((tag) => tag.trim().toLowerCase()).filter(Boolean));
  return left.reduce((count, tag) => {
    const normalizedTag = tag.trim().toLowerCase();
    return normalizedTag && rightTags.has(normalizedTag) ? count + 1 : count;
  }, 0);
}

export function filterNewsItems(
  items: readonly SdkworkNewsItem[],
  options: FilterNewsItemsOptions = {},
): SdkworkNewsItem[] {
  const statuses = options.statuses?.length ? new Set(options.statuses) : new Set<SdkworkNewsItemStatus>(["published"]);
  const normalizedQuery = normalizeQuery(options.query ?? options.q);

  return sortNewsItems(
    items.filter((item) => {
      if (!statuses.has(item.status)) {
        return false;
      }
      if (options.categoryId && item.categoryId !== options.categoryId) {
        return false;
      }
      if (options.includeFeatured === false && item.featured === true) {
        return false;
      }
      return matchesQuery(item, normalizedQuery);
    }),
  );
}

export function selectFeaturedNewsItem(
  items: readonly SdkworkNewsItem[],
  options: SelectFeaturedNewsItemOptions = {},
): SdkworkNewsItem | undefined {
  const visibleItems = filterNewsItems(items, {
    ...(options.categoryId ? { categoryId: options.categoryId } : {}),
    statuses: ["published"],
  });

  if (options.preferredItemId) {
    const preferredItem = visibleItems.find((item) => item.id === options.preferredItemId);
    if (preferredItem) {
      return preferredItem;
    }
  }

  const featuredItem = sortNewsItems(
    visibleItems.filter((item) => item.featured === true),
  )[0];
  if (featuredItem) {
    return featuredItem;
  }
  return visibleItems[0];
}

export function collectRelatedNewsItems(
  items: readonly SdkworkNewsItem[],
  currentItemId: string,
  options: CollectRelatedNewsItemsOptions = {},
): SdkworkNewsItem[] {
  const currentItem = items.find((item) => item.id === currentItemId);
  if (!currentItem) {
    return [];
  }
  const limit = options.limit ?? 3;
  return [...items]
    .filter((item) => item.status === "published" && item.id !== currentItemId)
    .sort((left, right) => {
      const leftScore =
        (left.categoryId === currentItem.categoryId ? 100 : 0) +
        sharedTagCount(left.tags, currentItem.tags) * 10;
      const rightScore =
        (right.categoryId === currentItem.categoryId ? 100 : 0) +
        sharedTagCount(right.tags, currentItem.tags) * 10;

      if (leftScore !== rightScore) {
        return rightScore - leftScore;
      }
      return compareTimestampDesc(left, right);
    })
    .slice(0, limit);
}

export function createNewsItemDigest(
  item: SdkworkNewsItem,
  options: CreateNewsItemDigestOptions = {},
): SdkworkNewsItemDigest {
  const category = findNewsCategory(options.categories, item.categoryId);
  return {
    ...(item.authorName ? { authorName: item.authorName } : {}),
    categoryId: item.categoryId,
    ...(category ? { categoryTitle: category.title } : {}),
    digestStatus: resolveNewsItemDigestStatus(item, options),
    estimatedReadMinutes: item.estimatedReadMinutes ?? 0,
    id: item.id,
    isCurrent: item.id === options.activeItemId,
    isFeatured: item.featured === true,
    isFresh: isNewsItemFresh(item, options),
    isRestricted: !isNewsCategoryEnabled(options.categories, item.categoryId),
    matchesCategory: options.activeCategoryId ? options.activeCategoryId === item.categoryId : true,
    ...(item.publishedAt ? { publishedAt: item.publishedAt } : {}),
    route: `${normalizeBasePath(options.basePath)}/${item.slug}`,
    ...(item.scheduledFor ? { scheduledFor: item.scheduledFor } : {}),
    slug: item.slug,
    status: item.status,
    tagCount: item.tags?.length ?? 0,
    title: item.title,
    ...(item.updatedAt ? { updatedAt: item.updatedAt } : {}),
  };
}

export function summarizeNewsItemDigests(
  digests: readonly SdkworkNewsItemDigest[],
): SdkworkNewsItemDigestSummary {
  let currentItems = 0;
  let draftItems = 0;
  let featuredItems = 0;
  let freshItems = 0;
  let liveItems = 0;
  let restrictedItems = 0;
  let scheduledItems = 0;
  let totalEstimatedReadMinutes = 0;

  for (const digest of digests) {
    if (digest.isCurrent) {
      currentItems += 1;
    }
    if (digest.status === "draft") {
      draftItems += 1;
    }
    if (digest.isFeatured) {
      featuredItems += 1;
    }
    if (digest.isFresh) {
      freshItems += 1;
    }
    if (digest.status === "published" && !digest.isRestricted) {
      liveItems += 1;
    }
    if (digest.isRestricted) {
      restrictedItems += 1;
    }
    if (digest.status === "scheduled") {
      scheduledItems += 1;
    }
    totalEstimatedReadMinutes += digest.estimatedReadMinutes;
  }

  return {
    currentItems,
    draftItems,
    featuredItems,
    freshItems,
    liveItems,
    restrictedItems,
    scheduledItems,
    totalEstimatedReadMinutes,
    totalItems: digests.length,
  };
}

export function evaluateNewsEditorialReadiness(
  item: SdkworkNewsItem,
  options: EvaluateNewsEditorialReadinessOptions = {},
): SdkworkNewsEditorialReadiness {
  const action = options.action ?? "publish";
  const minimumTags = Math.max(0, options.minimumTags ?? 1);
  const tagCount = item.tags?.map((tag) => tag.trim()).filter(Boolean).length ?? 0;
  const hasBody = options.hasBody === true || Boolean(item.body?.trim());
  const checklist: SdkworkNewsEditorialChecklist = {
    hasBody,
    hasCategory: isNewsCategoryEnabled(options.categories, item.categoryId),
    hasMinimumTags: tagCount >= minimumTags,
    hasScheduleDate: parseTimestamp(options.scheduledFor ?? item.scheduledFor) > 0,
    hasSummary: item.summary.trim().length > 0,
    hasTitle: item.title.trim().length > 0,
  };
  const capabilities: SdkworkNewsEditorialCapabilities = {
    canOpenDetail: checklist.hasCategory && item.status === "published",
    canPublish:
      checklist.hasCategory &&
      checklist.hasBody &&
      checklist.hasMinimumTags &&
      checklist.hasSummary &&
      checklist.hasTitle,
    canSchedule:
      checklist.hasCategory &&
      checklist.hasBody &&
      checklist.hasMinimumTags &&
      checklist.hasScheduleDate &&
      checklist.hasSummary &&
      checklist.hasTitle,
  };
  const issues = toUniqueNewsEditorialIssues([
    ...(checklist.hasCategory ? [] : ["category-disabled" as const]),
    ...(options.activeCategoryId && options.activeCategoryId !== item.categoryId
      ? ["category-mismatch" as const]
      : []),
    ...(action === "open-detail" && item.status !== "published" ? ["unpublished" as const] : []),
    ...((action === "publish" || action === "schedule") && !checklist.hasTitle
      ? ["missing-title" as const]
      : []),
    ...((action === "publish" || action === "schedule") && !checklist.hasSummary
      ? ["missing-summary" as const]
      : []),
    ...((action === "publish" || action === "schedule") && !checklist.hasBody
      ? ["missing-body" as const]
      : []),
    ...((action === "publish" || action === "schedule") && !checklist.hasMinimumTags
      ? ["missing-tags" as const]
      : []),
    ...(action === "schedule" && !checklist.hasScheduleDate ? ["scheduled-date-missing" as const] : []),
    ...(action === "archive" && item.status !== "published" ? ["unpublished" as const] : []),
  ]);
  const blockedIssues = new Set<SdkworkNewsEditorialIssue>([
    "category-disabled",
    ...(action === "open-detail" || action === "archive" ? (["unpublished"] as const) : []),
    ...(action === "publish" || action === "schedule"
      ? (["missing-body", "missing-summary", "missing-tags", "missing-title"] as const)
      : []),
    ...(action === "schedule" ? (["scheduled-date-missing"] as const) : []),
  ]);

  return {
    capabilities,
    checklist,
    degraded: issues.length > 0 && issues.every((issue) => !blockedIssues.has(issue)),
    issues,
    ready: issues.every((issue) => !blockedIssues.has(issue)),
  };
}

export function buildNewsOverview(
  input: BuildNewsOverviewInput,
): SdkworkNewsOverview {
  const activeCategories = input.categories
    .filter((category) => isEnabled(category))
    .sort(comparePriorityTitle);
  const activeCategoryIds = new Set(activeCategories.map((category) => category.id));
  const activeItems = input.items.filter((item) => activeCategoryIds.has(item.categoryId));
  const publishedItems = sortNewsItems(
    activeItems.filter((item) => item.status === "published"),
  );
  const scheduledItems = sortNewsItems(
    activeItems.filter((item) => item.status === "scheduled"),
  );
  const draftItems = sortNewsItems(
    activeItems.filter((item) => item.status === "draft"),
  );
  const featuredItem = selectFeaturedNewsItem(publishedItems);

  return {
    categorySummaries: activeCategories.map((category) => {
      const categoryItems = sortNewsItemsForOverview(
        activeItems.filter((item) => item.categoryId === category.id),
      );
      return {
        draftItemIds: categoryItems
          .filter((item) => item.status === "draft")
          .map((item) => item.id),
        id: category.id,
        itemIds: categoryItems.map((item) => item.id),
        priority: category.priority,
        publishedItemIds: categoryItems
          .filter((item) => item.status === "published")
          .map((item) => item.id),
        scheduledItemIds: categoryItems
          .filter((item) => item.status === "scheduled")
          .map((item) => item.id),
        title: category.title,
      } satisfies SdkworkNewsCategorySummary;
    }),
    draftItemIds: draftItems.map((item) => item.id),
    ...(featuredItem ? { featuredItemId: featuredItem.id } : {}),
    feedItemIds: publishedItems
      .filter((item) => item.id !== featuredItem?.id)
      .map((item) => item.id),
    recentItemIds: publishedItems.map((item) => item.id),
    scheduledItemIds: scheduledItems.map((item) => item.id),
    totalPublishedItems: publishedItems.length,
  };
}

export function createNewsWorkspaceManifest({
  description = "News workspace for editorial feeds, featured stories, and AI-assisted publishing entry points.",
  host = "tauri",
  id = "sdkwork-news",
  packageNames = [
    "@sdkwork/news-pc-react",
    "@sdkwork/home-pc-react",
  ],
  routePath = "/news",
  title = "News",
}: CreateNewsWorkspaceManifestOptions = {}): SdkworkNewsWorkspaceManifest {
  return {
    architecture: "pc-react",
    capability: "news",
    description,
    detailRoutePattern: `${routePath}/:itemSlug`,
    editorRoutePath: `${routePath}/editor`,
    host,
    id,
    packageNames: toUniqueStrings(packageNames),
    routePath,
    theme: {
      color: "lobster",
      preset: "sdkwork",
      selection: "system",
    },
    title,
  };
}

export function createNewsFeedRouteIntent(
  options: CreateNewsFeedRouteIntentOptions = {},
): SdkworkNewsFeedRouteIntent {
  const queryParams = new URLSearchParams();
  if (options.categoryId) {
    queryParams.set("category", options.categoryId);
  }
  if (options.query) {
    queryParams.set("query", options.query);
  }
  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    ...(options.categoryId ? { categoryId: options.categoryId } : {}),
    focusWindow: options.focusWindow !== false,
    ...(options.query ? { query: options.query } : {}),
    route: `${normalizeBasePath(options.basePath)}${querySuffix}`,
    source: "news-workspace",
    type: "news-feed-route-intent",
  };
}

export function createNewsDetailRouteIntent(
  itemSlug: string,
  options: CreateNewsDetailRouteIntentOptions = {},
): SdkworkNewsDetailRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    itemSlug,
    route: `${normalizeBasePath(options.basePath)}/${itemSlug}`,
    source: "news-workspace",
    type: "news-detail-route-intent",
  };
}

export function createNewsEditorRouteIntent(
  options: CreateNewsEditorRouteIntentOptions = {},
): SdkworkNewsEditorRouteIntent {
  const queryParams = new URLSearchParams();
  if (options.mode) {
    queryParams.set("mode", options.mode);
  }
  if (options.draftId) {
    queryParams.set("draftId", options.draftId);
  }
  if (options.seed) {
    queryParams.set("seed", options.seed);
  }

  const routeBase = `${normalizeBasePath(options.basePath)}/editor`;
  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    ...(options.draftId ? { draftId: options.draftId } : {}),
    focusWindow: options.focusWindow !== false,
    ...(options.mode ? { mode: options.mode } : {}),
    route: `${routeBase}${querySuffix}`,
    ...(options.seed ? { seed: options.seed } : {}),
    source: "news-workspace",
    type: "news-editor-route-intent",
  };
}

export const newsPackageMeta = {
  architecture: "pc-react",
  domain: NEWS_DOMAIN,
  package: "@sdkwork/news-pc-react",
  status: "ready",
} as const;

export type NewsPackageMeta = typeof newsPackageMeta;
