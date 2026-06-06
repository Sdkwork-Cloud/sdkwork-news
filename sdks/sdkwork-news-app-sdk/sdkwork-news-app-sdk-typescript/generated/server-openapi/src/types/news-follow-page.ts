import type { NewsFollow } from './news-follow';

export interface NewsFollowPage {
  items: NewsFollow[];
  cursor?: string;
  hasMore: boolean;
  limit: number;
}
