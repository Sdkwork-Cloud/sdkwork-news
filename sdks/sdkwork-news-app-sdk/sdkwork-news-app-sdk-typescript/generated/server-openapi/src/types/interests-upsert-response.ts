import type { NewsUserInterestSignal } from './news-user-interest-signal';

export interface InterestsUpsertResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
