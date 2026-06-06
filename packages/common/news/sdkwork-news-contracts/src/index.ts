export const NEWS_OWNER = "sdkwork-news" as const;
export const NEWS_DOMAIN = "news" as const;
export const NEWS_TAG = "news" as const;

export const NEWS_STATUS_VALUES = ["draft", "published", "scheduled", "archived"] as const;

export type SdkworkNewsItemStatus = (typeof NEWS_STATUS_VALUES)[number];
export type SdkworkNewsEditorMode = "topic" | "url";
export type SdkworkNewsEditorialAction = "archive" | "feature" | "publish" | "schedule";

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
  tenantId: string;
  title: string;
  updatedAt?: string;
}

export interface SdkworkNewsApiRoute {
  method: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
  operationId: string;
  path: string;
  public: boolean;
  tag: typeof NEWS_TAG;
}

export interface FilterNewsItemsOptions {
  categoryId?: string;
  includeFeatured?: boolean;
  q?: string;
  statuses?: readonly SdkworkNewsItemStatus[];
}

export interface CreateNewsItemDigestOptions {
  basePath?: string;
  now?: string;
  recentWindowDays?: number;
}

export interface SdkworkNewsItemDigest {
  authorName?: string;
  categoryId: string;
  estimatedReadMinutes: number;
  id: string;
  isFeatured: boolean;
  isFresh: boolean;
  publishedAt?: string;
  route: string;
  scheduledFor?: string;
  slug: string;
  status: SdkworkNewsItemStatus;
  tagCount: number;
  title: string;
  updatedAt?: string;
}

export interface SdkworkNewsEditorialReadiness {
  canArchive: boolean;
  canFeature: boolean;
  canPublish: boolean;
  canSchedule: boolean;
  issues: string[];
  ready: boolean;
}

export const NEWS_APP_API_ROUTES: readonly SdkworkNewsApiRoute[] = [
  route("GET", "/app/v3/api/news/categories", "categories.list", false),
  route("GET", "/app/v3/api/news/items", "items.list", false),
  route("GET", "/app/v3/api/news/items/{itemId}", "items.retrieve", false),
  route("GET", "/app/v3/api/news/items/by_slug/{slug}", "items.bySlug.retrieve", false),
  route("GET", "/app/v3/api/news/overview", "overview.retrieve", false),
];

export const NEWS_OPEN_API_ROUTES: readonly SdkworkNewsApiRoute[] = [
  route("GET", "/open/v3/api/news/items", "items.list", true),
  route("GET", "/open/v3/api/news/items/{itemId}", "items.retrieve", true),
  route("GET", "/open/v3/api/news/items/by_slug/{slug}", "items.bySlug.retrieve", true),
];

export const NEWS_BACKEND_API_ROUTES: readonly SdkworkNewsApiRoute[] = [
  route("GET", "/backend/v3/api/news/categories", "categories.management.list", false),
  route("POST", "/backend/v3/api/news/categories", "categories.create", false),
  route("PATCH", "/backend/v3/api/news/categories/{categoryId}", "categories.update", false),
  route("DELETE", "/backend/v3/api/news/categories/{categoryId}", "categories.delete", false),
  route("GET", "/backend/v3/api/news/items", "items.management.list", false),
  route("POST", "/backend/v3/api/news/items", "items.create", false),
  route("PATCH", "/backend/v3/api/news/items/{itemId}", "items.update", false),
  route("DELETE", "/backend/v3/api/news/items/{itemId}", "items.delete", false),
  route("POST", "/backend/v3/api/news/items/{itemId}/publish", "items.publish", false),
  route("POST", "/backend/v3/api/news/items/{itemId}/schedule", "items.schedule", false),
  route("POST", "/backend/v3/api/news/items/{itemId}/archive", "items.archive", false),
  route("POST", "/backend/v3/api/news/items/{itemId}/feature", "items.feature", false),
  route("GET", "/backend/v3/api/news/items/{itemId}/editorial_readiness", "items.editorialReadiness.retrieve", false),
];

function route(
  method: SdkworkNewsApiRoute["method"],
  path: string,
  operationId: string,
  isPublic: boolean,
): SdkworkNewsApiRoute {
  return {
    method,
    operationId,
    path,
    public: isPublic,
    tag: NEWS_TAG,
  };
}

function parseTimestamp(value: string | undefined): number {
  if (!value) {
    return 0;
  }
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function primaryTimestamp(item: SdkworkNewsItem): number {
  if (item.status === "draft") {
    return parseTimestamp(item.updatedAt);
  }
  return Math.max(parseTimestamp(item.publishedAt), parseTimestamp(item.scheduledFor), parseTimestamp(item.updatedAt));
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function matchesQuery(item: SdkworkNewsItem, q: string): boolean {
  if (!q) {
    return true;
  }
  const tags = item.tags?.join(" ").toLowerCase() ?? "";
  return item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q) || tags.includes(q);
}

function compareItems(left: SdkworkNewsItem, right: SdkworkNewsItem): number {
  const timestampDifference = primaryTimestamp(right) - primaryTimestamp(left);
  if (timestampDifference !== 0) {
    return timestampDifference;
  }
  if (left.priority !== right.priority) {
    return left.priority - right.priority;
  }
  return left.slug.localeCompare(right.slug);
}

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/news").trim();
  if (!normalized || normalized === "/") {
    return "/news";
  }
  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

export function filterNewsItems(
  items: readonly SdkworkNewsItem[],
  options: FilterNewsItemsOptions = {},
): SdkworkNewsItem[] {
  const statuses = new Set(options.statuses?.length ? options.statuses : ["published"]);
  const q = normalizeQuery(options.q);
  return [...items]
    .filter((item) => statuses.has(item.status))
    .filter((item) => (options.categoryId ? item.categoryId === options.categoryId : true))
    .filter((item) => (options.includeFeatured === false ? item.featured !== true : true))
    .filter((item) => matchesQuery(item, q))
    .sort(compareItems);
}

export function createNewsItemDigest(
  item: SdkworkNewsItem,
  options: CreateNewsItemDigestOptions = {},
): SdkworkNewsItemDigest {
  const freshnessTimestamp = Math.max(parseTimestamp(item.publishedAt), parseTimestamp(item.updatedAt));
  const now = options.now ? parseTimestamp(options.now) : Date.now();
  const recentWindowDays = Math.max(0, options.recentWindowDays ?? 7);
  const isFresh =
    freshnessTimestamp > 0 &&
    now > 0 &&
    freshnessTimestamp <= now &&
    now - freshnessTimestamp <= recentWindowDays * 24 * 60 * 60 * 1000;

  return {
    ...(item.authorName ? { authorName: item.authorName } : {}),
    categoryId: item.categoryId,
    estimatedReadMinutes: item.estimatedReadMinutes ?? 0,
    id: item.id,
    isFeatured: item.featured === true,
    isFresh,
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

export function evaluateNewsEditorialReadiness(
  item: SdkworkNewsItem,
  options: { action?: SdkworkNewsEditorialAction; minimumTags?: number; scheduledFor?: string } = {},
): SdkworkNewsEditorialReadiness {
  const action = options.action ?? "publish";
  const minimumTags = Math.max(0, options.minimumTags ?? 1);
  const issues = [
    ...(item.title.trim() ? [] : ["missing-title"]),
    ...(item.summary.trim() ? [] : ["missing-summary"]),
    ...(item.body?.trim() ? [] : ["missing-body"]),
    ...((item.tags?.filter((tag) => tag.trim()).length ?? 0) >= minimumTags ? [] : ["missing-tags"]),
    ...(action === "schedule" && parseTimestamp(options.scheduledFor ?? item.scheduledFor) <= 0 ? ["scheduled-date-missing"] : []),
    ...(action === "archive" && item.status !== "published" ? ["unpublished"] : []),
  ];
  const publishReady = !issues.some((issue) => issue.startsWith("missing-"));
  const hasScheduleDate = parseTimestamp(options.scheduledFor ?? item.scheduledFor) > 0;
  const scheduleReady = publishReady && hasScheduleDate && !issues.includes("scheduled-date-missing");
  const archiveReady = item.status === "published";

  return {
    canArchive: archiveReady,
    canFeature: item.status === "published",
    canPublish: publishReady,
    canSchedule: scheduleReady,
    issues,
    ready: issues.length === 0,
  };
}
