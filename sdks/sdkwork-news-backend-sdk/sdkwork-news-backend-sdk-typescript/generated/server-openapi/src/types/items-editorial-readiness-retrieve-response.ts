import type { NewsEditorialReadiness } from './news-editorial-readiness';

export interface ItemsEditorialReadinessRetrieveResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
