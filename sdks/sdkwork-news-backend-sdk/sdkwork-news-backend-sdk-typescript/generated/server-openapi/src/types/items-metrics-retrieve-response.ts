import type { NewsItemMetricSnapshot } from './news-item-metric-snapshot';

export interface ItemsMetricsRetrieveResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
