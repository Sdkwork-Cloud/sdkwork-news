import type { NewsSearchResult } from './news-search-result';
import type { PageInfo } from './page-info';

export interface SearchListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
