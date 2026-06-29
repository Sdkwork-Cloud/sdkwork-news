import type { NewsAuthor } from './news-author';

export interface AuthorsCreateResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
