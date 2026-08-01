export interface NewsFeedChannel {
  description?: string;
  id: string;
  title: string;
}

export interface NewsFeedItem {
  authorName?: string;
  categoryId: string;
  estimatedReadMinutes?: number;
  featured: boolean;
  id: string;
  publishedAt?: string;
  reason?: string;
  summary: string;
  tags: readonly string[];
  title: string;
}

export interface NewsArticle extends NewsFeedItem {
  body?: string;
  slug: string;
  updatedAt?: string;
}

export interface NewsFeedPage {
  hasMore: boolean;
  items: readonly NewsFeedItem[];
  nextCursor?: string;
}

export interface NewsFeedListInput {
  channelId?: string;
  cursor?: string;
  pageSize?: number;
  q?: string;
}

export type NewsFeedbackType =
  | "less_like_this"
  | "more_like_this"
  | "not_interested"
  | "quality";

export type NewsEngagementEventType =
  | "click"
  | "complete"
  | "dismiss"
  | "dwell"
  | "impression"
  | "share";

export interface NewsEngagementEventInput {
  channelId?: string;
  dwellMs?: number;
  eventType: NewsEngagementEventType;
  itemId: string;
  occurredAt?: string;
}

export interface NewsFeedPort {
  createFeedback(itemId: string, feedbackType: NewsFeedbackType, reason?: string): Promise<void>;
  createFavorite(itemId: string): Promise<void>;
  createEvent(input: Required<Pick<NewsEngagementEventInput, "eventType" | "itemId" | "occurredAt">> & Omit<NewsEngagementEventInput, "eventType" | "itemId" | "occurredAt">): Promise<void>;
  deleteFavorite(itemId: string): Promise<void>;
  listChannels(pageSize: number): Promise<readonly NewsFeedChannel[]>;
  listFeed(input: NewsFeedListInput): Promise<NewsFeedPage>;
  listRelated(itemId: string, pageSize: number): Promise<NewsFeedPage>;
  listTrending(pageSize: number): Promise<NewsFeedPage>;
  retrieveArticle(itemId: string): Promise<NewsArticle>;
}

export interface NewsFeedService {
  getArticle(itemId: string): Promise<NewsArticle>;
  listChannels(): Promise<readonly NewsFeedChannel[]>;
  listFeed(input?: NewsFeedListInput): Promise<NewsFeedPage>;
  listRelated(itemId: string): Promise<NewsFeedPage>;
  listTrending(): Promise<NewsFeedPage>;
  recordEvent(input: NewsEngagementEventInput): Promise<void>;
  setFavorite(itemId: string, favorite: boolean): Promise<void>;
  submitFeedback(itemId: string, feedbackType: NewsFeedbackType, reason?: string): Promise<void>;
}
