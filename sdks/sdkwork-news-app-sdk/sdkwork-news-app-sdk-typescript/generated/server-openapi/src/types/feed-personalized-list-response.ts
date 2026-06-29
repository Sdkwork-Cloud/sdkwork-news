import type { NewsFeedItem } from './news-feed-item';
import type { PageInfo } from './page-info';

export interface FeedPersonalizedListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
