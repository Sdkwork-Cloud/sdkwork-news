import type { NewsReaction } from './news-reaction';

export interface ReactionsUpsertResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
