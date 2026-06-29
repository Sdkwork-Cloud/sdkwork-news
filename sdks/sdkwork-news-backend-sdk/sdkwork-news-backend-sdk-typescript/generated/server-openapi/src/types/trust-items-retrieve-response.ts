import type { NewsItemTrustSnapshot } from './news-item-trust-snapshot';

export interface TrustItemsRetrieveResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
