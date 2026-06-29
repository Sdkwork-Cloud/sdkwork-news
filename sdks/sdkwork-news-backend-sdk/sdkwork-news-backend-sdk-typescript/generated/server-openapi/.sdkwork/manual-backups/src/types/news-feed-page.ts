import type { NewsFeedItem } from './news-feed-item';

export interface NewsFeedPage {
  items: NewsFeedItem[];
  cursor?: string;
  hasMore: boolean;
  limit: number;
}
