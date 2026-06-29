import type { NewsItem } from './news-item';

export interface NewsItemPage {
  items: NewsItem[];
  cursor?: string;
  hasMore: boolean;
  limit: number;
}
