import type { NewsItem } from './news-item';

export interface NewsFeedItem {
  item: NewsItem;
  channelId?: string;
  rank?: number;
  reason?: string;
  traceId?: string;
}
