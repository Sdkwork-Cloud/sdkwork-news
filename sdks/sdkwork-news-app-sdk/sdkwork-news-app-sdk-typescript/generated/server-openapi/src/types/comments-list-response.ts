import type { NewsComment } from './news-comment';
import type { PageInfo } from './page-info';

export interface CommentsListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
