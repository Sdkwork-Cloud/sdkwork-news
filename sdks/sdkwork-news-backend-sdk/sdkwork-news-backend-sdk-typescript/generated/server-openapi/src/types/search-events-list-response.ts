import type { NewsSearchEvent } from './news-search-event';
import type { PageInfo } from './page-info';

export interface SearchEventsListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
