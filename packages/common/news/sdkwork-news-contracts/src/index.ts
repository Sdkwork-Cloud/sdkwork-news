export const NEWS_OWNER = "sdkwork-news" as const;
export const NEWS_DOMAIN = "news" as const;
export const NEWS_TAG = "news" as const;

export const NEWS_STATUS_VALUES = ["draft", "published", "scheduled", "archived"] as const;
export const NEWS_CHANNEL_STATUS_VALUES = ["active", "inactive", "archived"] as const;
export const NEWS_CHANNEL_TYPE_VALUES = ["editorial", "algorithmic", "topic", "following", "hot"] as const;
export const NEWS_FEED_EVENT_VALUES = ["impression", "click", "dwell", "complete", "dismiss", "share"] as const;
export const NEWS_INTEREST_TARGET_VALUES = ["source", "author", "topic", "channel", "tag"] as const;
export const NEWS_SUGGESTION_TYPE_VALUES = ["hot", "history", "topic", "source", "correction"] as const;

export type SdkworkNewsItemStatus = (typeof NEWS_STATUS_VALUES)[number];
export type SdkworkNewsChannelStatus = (typeof NEWS_CHANNEL_STATUS_VALUES)[number];
export type SdkworkNewsChannelType = (typeof NEWS_CHANNEL_TYPE_VALUES)[number];
export type SdkworkNewsFeedEventType = (typeof NEWS_FEED_EVENT_VALUES)[number];
export type SdkworkNewsInterestTargetType = (typeof NEWS_INTEREST_TARGET_VALUES)[number];
export type SdkworkNewsSuggestionType = (typeof NEWS_SUGGESTION_TYPE_VALUES)[number];
export type SdkworkNewsEditorMode = "topic" | "url";
export type SdkworkNewsEditorialAction = "archive" | "feature" | "publish" | "schedule";
export type SdkworkNewsMediaKind = "image" | "video" | "audio" | "voice" | "document" | "archive" | "other";
export type SdkworkNewsMediaSource = "drive" | "external_url" | "provider_asset" | "generated";
export type SdkworkNewsFeedbackType = "not_interested" | "block_source" | "less_like_this" | "more_like_this" | "quality";
export type SdkworkNewsReactionType = "like" | "dislike" | "laugh" | "sad" | "angry" | "wow";
export type SdkworkNewsModerationStatus = "pending" | "approved" | "rejected" | "hidden";

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

export interface SdkworkNewsMediaResource {
  id?: string;
  kind: SdkworkNewsMediaKind;
  source: SdkworkNewsMediaSource;
  uri?: string;
  url?: string;
  publicUrl?: string;
  mimeType?: string;
  sizeBytes?: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  altText?: string;
  title?: string;
  metadata?: Record<string, unknown>;
}

export interface SdkworkNewsChannel {
  description?: string;
  id: string;
  priority?: number;
  slug: string;
  status: SdkworkNewsChannelStatus;
  tenantId: string;
  title: string;
  type: SdkworkNewsChannelType;
}

export interface SdkworkNewsTopic {
  description?: string;
  id: string;
  slug: string;
  status: "active" | "inactive" | "archived";
  tenantId: string;
  title: string;
}

export interface SdkworkNewsFeedItem {
  channelId?: string;
  item: SdkworkNewsItem;
  rank?: number;
  reason?: string;
  traceId?: string;
}

export interface SdkworkNewsPage<T> {
  cursor?: string;
  hasMore: boolean;
  items: readonly T[];
  limit: number;
}

export interface SdkworkNewsRecommendationEvent {
  channelId?: string;
  dwellMs?: number;
  eventType: SdkworkNewsFeedEventType;
  id: string;
  itemId: string;
  occurredAt: string;
  tenantId: string;
  traceId?: string;
  userId?: string;
}

export interface SdkworkNewsUserFeedback {
  createdAt: string;
  feedbackType: SdkworkNewsFeedbackType;
  id: string;
  reason?: string;
  targetId: string;
  targetType: "item" | "source" | "author" | "topic" | "channel";
  tenantId: string;
  userId: string;
}

export interface SdkworkNewsFavorite {
  createdAt: string;
  id: string;
  itemId: string;
  tenantId: string;
  userId: string;
}

export interface SdkworkNewsReaction {
  id: string;
  itemId: string;
  reactionType: SdkworkNewsReactionType;
  tenantId: string;
  updatedAt: string;
  userId: string;
}

export interface SdkworkNewsComment {
  body: string;
  createdAt: string;
  id: string;
  itemId: string;
  moderationStatus: SdkworkNewsModerationStatus;
  parentId?: string;
  tenantId: string;
  userId: string;
}

export interface SdkworkNewsTrendingMetric {
  computedAt: string;
  itemId: string;
  metricWindow: "hour" | "day" | "week";
  rank: number;
  score: number;
  tenantId: string;
}

export interface SdkworkNewsSearchResult {
  highlight?: string;
  item: SdkworkNewsItem;
  score: number;
}

export interface SdkworkNewsUserInterestSignal {
  affinityScore: number;
  confidence: number;
  source: "explicit" | "behavior" | "editorial" | "imported";
  targetId: string;
  targetType: SdkworkNewsInterestTargetType;
  tenantId: string;
  updatedAt: string;
  userId: string;
}

export interface SdkworkNewsFeedCandidate {
  generatedAt: string;
  itemId: string;
  reasonCode: string;
  score: number;
  streamKey: string;
  tenantId: string;
  traceId?: string;
  userId?: string;
}

export interface SdkworkNewsItemMetricSnapshot {
  clickCount: number;
  commentCount: number;
  computedAt: string;
  favoriteCount: number;
  hotScore: number;
  impressionCount: number;
  itemId: string;
  reactionCount: number;
  reportCount: number;
  shareCount: number;
  tenantId: string;
}

export interface SdkworkNewsSearchSuggestion {
  displayQuery: string;
  normalizedQuery: string;
  rank: number;
  score: number;
  suggestionType: SdkworkNewsSuggestionType;
  tenantId: string;
}

export interface SdkworkNewsSearchEvent {
  clickedItemId?: string;
  displayQuery: string;
  normalizedQuery: string;
  occurredAt: string;
  resultCount: number;
  tenantId: string;
  traceId?: string;
  userId?: string;
}

export interface SdkworkNewsModerationCase {
  createdAt: string;
  id: string;
  priority: number;
  reason: string;
  status: "open" | "reviewing" | "resolved" | "rejected";
  targetId: string;
  targetType: "item" | "comment" | "media" | "source";
  tenantId: string;
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
  route("GET", "/app/v3/api/news/channels", "channels.list", false),
  route("GET", "/app/v3/api/news/channels/{channelId}/feed", "channels.feed.list", false),
  route("GET", "/app/v3/api/news/topics", "topics.list", false),
  route("GET", "/app/v3/api/news/topics/{topicId}/items", "topics.items.list", false),
  route("GET", "/app/v3/api/news/feed/personalized", "feed.personalized.list", false),
  route("GET", "/app/v3/api/news/items/{itemId}/related", "items.related.list", false),
  route("GET", "/app/v3/api/news/trending", "trending.list", false),
  route("GET", "/app/v3/api/news/search", "search.list", false),
  route("GET", "/app/v3/api/news/search/suggestions", "search.suggestions.list", false),
  route("POST", "/app/v3/api/news/events", "events.create", false),
  route("GET", "/app/v3/api/news/favorites", "favorites.list", false),
  route("POST", "/app/v3/api/news/items/{itemId}/favorites", "favorites.create", false),
  route("DELETE", "/app/v3/api/news/items/{itemId}/favorites", "favorites.delete", false),
  route("PUT", "/app/v3/api/news/items/{itemId}/reactions", "reactions.upsert", false),
  route("GET", "/app/v3/api/news/items/{itemId}/comments", "comments.list", false),
  route("POST", "/app/v3/api/news/items/{itemId}/comments", "comments.create", false),
  route("POST", "/app/v3/api/news/reports", "reports.create", false),
  route("POST", "/app/v3/api/news/feedback", "feedback.create", false),
  route("GET", "/app/v3/api/news/history", "history.list", false),
  route("GET", "/app/v3/api/news/follows", "follows.list", false),
  route("POST", "/app/v3/api/news/follows", "follows.create", false),
  route("DELETE", "/app/v3/api/news/follows/{followId}", "follows.delete", false),
  route("GET", "/app/v3/api/news/interests", "interests.list", false),
  route("PUT", "/app/v3/api/news/interests", "interests.upsert", false),
];

export const NEWS_OPEN_API_ROUTES: readonly SdkworkNewsApiRoute[] = [
  route("GET", "/open/v3/api/news/items", "items.list", true),
  route("GET", "/open/v3/api/news/items/{itemId}", "items.retrieve", true),
  route("GET", "/open/v3/api/news/items/by_slug/{slug}", "items.bySlug.retrieve", true),
  route("GET", "/open/v3/api/news/channels", "channels.list", true),
  route("GET", "/open/v3/api/news/channels/{channelId}/feed", "channels.feed.list", true),
  route("GET", "/open/v3/api/news/topics", "topics.list", true),
  route("GET", "/open/v3/api/news/topics/{topicId}/items", "topics.items.list", true),
  route("GET", "/open/v3/api/news/items/{itemId}/related", "items.related.list", true),
  route("GET", "/open/v3/api/news/trending", "trending.list", true),
  route("GET", "/open/v3/api/news/search", "search.list", true),
  route("GET", "/open/v3/api/news/search/suggestions", "search.suggestions.list", true),
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
  route("GET", "/backend/v3/api/news/sources", "sources.management.list", false),
  route("POST", "/backend/v3/api/news/sources", "sources.create", false),
  route("PATCH", "/backend/v3/api/news/sources/{sourceId}", "sources.update", false),
  route("DELETE", "/backend/v3/api/news/sources/{sourceId}", "sources.delete", false),
  route("GET", "/backend/v3/api/news/authors", "authors.management.list", false),
  route("POST", "/backend/v3/api/news/authors", "authors.create", false),
  route("PATCH", "/backend/v3/api/news/authors/{authorId}", "authors.update", false),
  route("DELETE", "/backend/v3/api/news/authors/{authorId}", "authors.delete", false),
  route("GET", "/backend/v3/api/news/channels", "channels.management.list", false),
  route("POST", "/backend/v3/api/news/channels", "channels.create", false),
  route("PATCH", "/backend/v3/api/news/channels/{channelId}", "channels.update", false),
  route("DELETE", "/backend/v3/api/news/channels/{channelId}", "channels.delete", false),
  route("GET", "/backend/v3/api/news/topics", "topics.management.list", false),
  route("POST", "/backend/v3/api/news/topics", "topics.create", false),
  route("PATCH", "/backend/v3/api/news/topics/{topicId}", "topics.update", false),
  route("DELETE", "/backend/v3/api/news/topics/{topicId}", "topics.delete", false),
  route("GET", "/backend/v3/api/news/items/{itemId}/versions", "items.versions.list", false),
  route("POST", "/backend/v3/api/news/items/{itemId}/versions", "items.versions.create", false),
  route("GET", "/backend/v3/api/news/items/{itemId}/media", "items.media.list", false),
  route("POST", "/backend/v3/api/news/items/{itemId}/media", "items.media.attach", false),
  route("DELETE", "/backend/v3/api/news/items/{itemId}/media/{mediaId}", "items.media.delete", false),
  route("GET", "/backend/v3/api/news/moderation/cases", "moderation.cases.list", false),
  route("GET", "/backend/v3/api/news/moderation/cases/{caseId}", "moderation.cases.retrieve", false),
  route("PATCH", "/backend/v3/api/news/moderation/cases/{caseId}", "moderation.cases.update", false),
  route("GET", "/backend/v3/api/news/comments/moderation", "comments.moderation.list", false),
  route("PATCH", "/backend/v3/api/news/comments/{commentId}/moderation", "comments.moderation.update", false),
  route("GET", "/backend/v3/api/news/reports", "reports.management.list", false),
  route("PATCH", "/backend/v3/api/news/reports/{reportId}", "reports.update", false),
  route("GET", "/backend/v3/api/news/trending/metrics", "trending.metrics.list", false),
  route("PUT", "/backend/v3/api/news/trending/metrics", "trending.metrics.upsert", false),
  route("GET", "/backend/v3/api/news/items/metrics", "items.metrics.list", false),
  route("GET", "/backend/v3/api/news/items/{itemId}/metrics", "items.metrics.retrieve", false),
  route("POST", "/backend/v3/api/news/items/metrics/rebuild", "items.metrics.rebuild", false),
  route("GET", "/backend/v3/api/news/feed/candidates", "feed.candidates.list", false),
  route("PUT", "/backend/v3/api/news/feed/candidates", "feed.candidates.upsert", false),
  route("DELETE", "/backend/v3/api/news/feed/candidates/{candidateId}", "feed.candidates.delete", false),
  route("GET", "/backend/v3/api/news/interests", "interests.management.list", false),
  route("POST", "/backend/v3/api/news/interests/rebuild", "interests.rebuild", false),
  route("DELETE", "/backend/v3/api/news/interests/{interestId}", "interests.delete", false),
  route("GET", "/backend/v3/api/news/search/suggestions", "search.suggestions.management.list", false),
  route("PUT", "/backend/v3/api/news/search/suggestions", "search.suggestions.upsert", false),
  route("DELETE", "/backend/v3/api/news/search/suggestions/{suggestionId}", "search.suggestions.delete", false),
  route("GET", "/backend/v3/api/news/search/events", "search.events.list", false),
  route("POST", "/backend/v3/api/news/search/projections/rebuild", "search.projections.rebuild", false),
  route("GET", "/backend/v3/api/news/experiments", "experiments.management.list", false),
  route("POST", "/backend/v3/api/news/experiments", "experiments.create", false),
  route("PATCH", "/backend/v3/api/news/experiments/{experimentId}", "experiments.update", false),
  route("POST", "/backend/v3/api/news/experiments/{experimentId}/archive", "experiments.archive", false),
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

export function createNewsFeedEventDigest(event: SdkworkNewsRecommendationEvent): string {
  return `${event.eventType}:${event.itemId}:${event.userId ?? "anonymous"}`;
}
