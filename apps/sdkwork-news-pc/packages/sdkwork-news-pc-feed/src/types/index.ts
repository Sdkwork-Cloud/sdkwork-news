export interface NewsCategory {
  id: string;
  tenantId?: string;
  slug: string;
  title: string;
  description?: string;
  priority: number;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsItem {
  id: string;
  tenantId?: string;
  categoryId: string;
  slug: string;
  title: string;
  summary: string;
  body?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  authorUserId?: string;
  authorName?: string;
  featured?: boolean;
  priority: number;
  estimatedReadMinutes?: number;
  publishedAt?: string;
  scheduledFor?: string;
  archivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
}

export interface NewsItemPage {
  items: NewsItem[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsFeedPage {
  items: NewsFeedItem[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsFeedItem {
  itemId: string;
  score: number;
  reasonCode: string;
  traceId?: string;
  generatedAt?: string;
}

export interface NewsChannel {
  id: string;
  tenantId?: string;
  organizationId?: string;
  slug: string;
  title: string;
  channelType: string;
  status: string;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsTopic {
  id: string;
  tenantId?: string;
  slug: string;
  title: string;
  description?: string;
  status: string;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsOverview {
  categories: NewsCategory[];
  featuredItem?: NewsItem;
  recentItems: NewsItem[];
  trendingItems: NewsItem[];
  breakingAlerts: NewsBreakingAlert[];
}

export interface NewsBreakingAlert {
  id: string;
  tenantId?: string;
  organizationId?: string;
  itemId?: string;
  title: string;
  summary: string;
  severity: string;
  audienceType: string;
  targetType: string;
  targetId?: string;
  priority: number;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsDigestIssue {
  id: string;
  tenantId?: string;
  digestKey: string;
  title: string;
  summary?: string;
  digestType: string;
  audienceType: string;
  locale?: string;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsComment {
  id: string;
  tenantId?: string;
  itemId: string;
  userId: string;
  parentId?: string;
  body: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsCommentPage {
  comments: NewsComment[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsFavorite {
  id: string;
  tenantId?: string;
  userId: string;
  itemId: string;
  status: string;
  createdAt?: string;
  deletedAt?: string;
}

export interface NewsFavoritePage {
  favorites: NewsFavorite[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsReaction {
  id: string;
  tenantId?: string;
  userId: string;
  itemId: string;
  reactionType: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsFollow {
  id: string;
  tenantId?: string;
  userId: string;
  targetType: string;
  targetId: string;
  status: string;
  createdAt?: string;
  deletedAt?: string;
}

export interface NewsFollowPage {
  follows: NewsFollow[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsUserInterestSignal {
  id: string;
  tenantId?: string;
  userId: string;
  targetType: string;
  targetId: string;
  affinityScore: number;
  confidence: number;
  source: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsUserInterestSignalListResponse {
  signals: NewsUserInterestSignal[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsNotificationSubscription {
  id: string;
  tenantId?: string;
  userId: string;
  targetType: string;
  targetId: string;
  channel: string;
  frequency: string;
  status: string;
  quietStart?: string;
  quietEnd?: string;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsNotificationSubscriptionListResponse {
  subscriptions: NewsNotificationSubscription[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsItemTrustSnapshot {
  id: string;
  tenantId?: string;
  itemId: string;
  trustScore: number;
  sourceTrustScore?: number;
  factCheckVerdict?: string;
  correctionCount: number;
  riskLevel: string;
  computedAt?: string;
  updatedAt?: string;
}

export interface NewsFactCheck {
  id: string;
  tenantId?: string;
  itemId?: string;
  claim: string;
  verdict: string;
  summary: string;
  evidenceUrl?: string;
  reviewerUserId?: string;
  status: string;
  publishedAt?: string;
  archivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsFactCheckListResponse {
  factChecks: NewsFactCheck[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsCorrectionNotice {
  id: string;
  tenantId?: string;
  itemId: string;
  correctionType: string;
  title: string;
  body: string;
  actorUserId?: string;
  status: string;
  publishedAt?: string;
  archivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsCorrectionNoticeListResponse {
  corrections: NewsCorrectionNotice[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsLiveEvent {
  id: string;
  tenantId?: string;
  organizationId?: string;
  slug: string;
  title: string;
  summary?: string;
  eventType: string;
  priority: number;
  status: string;
  region?: string;
  locale?: string;
  startedAt?: string;
  publishedAt?: string;
  closedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsLiveEventListResponse {
  events: NewsLiveEvent[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsLiveUpdate {
  id: string;
  tenantId?: string;
  liveEventId: string;
  title: string;
  body: string;
  updateType: string;
  importance: number;
  sourceId?: string;
  authorId?: string;
  itemId?: string;
  status: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsLiveUpdateListResponse {
  updates: NewsLiveUpdate[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsSearchResult {
  itemId: string;
  title: string;
  summary: string;
  slug: string;
  categoryName?: string;
  authorName?: string;
  publishedAt?: string;
  score: number;
  highlight?: string;
}

export interface NewsSearchResultPage {
  results: NewsSearchResult[];
  nextCursor?: string;
  hasMore: boolean;
  total?: number;
}

export interface NewsSearchSuggestion {
  query: string;
  score: number;
  type: string;
}

export interface NewsSearchSuggestionListResponse {
  suggestions: NewsSearchSuggestion[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsRecommendationEventCommand {
  itemId: string;
  eventType: string;
  dwellMs?: number;
  traceId?: string;
}

export interface NewsUserFeedbackCommand {
  targetType: string;
  targetId: string;
  feedbackType: string;
  reason?: string;
}

export interface NewsReportCommand {
  targetType: string;
  targetId: string;
  reportType: string;
  reason?: string;
}

export interface NewsCommentCommand {
  body: string;
  parentId?: string;
}

export interface NewsReactionCommand {
  reactionType: string;
}

export interface NewsFollowCommand {
  targetType: string;
  targetId: string;
}

export interface NewsUserInterestCommand {
  targetType: string;
  targetId: string;
  affinityScore?: number;
}

export interface NewsNotificationSubscriptionCommand {
  targetType: string;
  targetId: string;
  channel: string;
  frequency?: string;
}

export interface NewsBreakingAlertListResponse {
  alerts: NewsBreakingAlert[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsDigestIssueListResponse {
  digests: NewsDigestIssue[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface CategoriesListResponse {
  categories: NewsCategory[];
}

export interface ChannelsListResponse {
  channels: NewsChannel[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface TopicsListResponse {
  topics: NewsTopic[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface TrendingListResponse {
  items: NewsItem[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface ItemsListResponse {
  items: NewsItem[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NewsApiResult {
  success: boolean;
  message?: string;
}

