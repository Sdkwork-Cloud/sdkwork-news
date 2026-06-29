import type { NewsDigestIssue } from './news-digest-issue';

export interface DigestsCreateResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
