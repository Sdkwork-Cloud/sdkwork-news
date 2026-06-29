import type { NewsItem } from './news-item';
import type { PageInfo } from './page-info';

export interface TopicsItemsListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
