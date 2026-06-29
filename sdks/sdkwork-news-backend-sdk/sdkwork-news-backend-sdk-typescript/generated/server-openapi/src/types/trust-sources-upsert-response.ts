import type { NewsSourceTrustProfile } from './news-source-trust-profile';

export interface TrustSourcesUpsertResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
