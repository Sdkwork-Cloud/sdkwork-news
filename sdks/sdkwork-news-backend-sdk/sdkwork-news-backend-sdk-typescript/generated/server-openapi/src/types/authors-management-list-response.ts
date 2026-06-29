import type { NewsAuthor } from './news-author';
import type { PageInfo } from './page-info';

export interface AuthorsManagementListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
