import type { NewsComment } from './news-comment';

export interface CommentsModerationUpdateResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
