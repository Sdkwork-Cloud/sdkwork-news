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

export interface NewsFeedPort {
  createFavorite(itemId: string): Promise<void>;
  deleteFavorite(itemId: string): Promise<void>;
  listChannels(pageSize: number): Promise<readonly NewsFeedChannel[]>;
  listFeed(input: NewsFeedListInput): Promise<NewsFeedPage>;
  listTrending(pageSize: number): Promise<NewsFeedPage>;
}

export interface NewsFeedService {
  setFavorite(itemId: string, favorite: boolean): Promise<void>;
  listChannels(): Promise<readonly NewsFeedChannel[]>;
  listFeed(input?: NewsFeedListInput): Promise<NewsFeedPage>;
  listTrending(): Promise<NewsFeedPage>;
}
