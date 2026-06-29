import type { NewsDigestIssue } from './news-digest-issue';

export interface DigestsPublishResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
