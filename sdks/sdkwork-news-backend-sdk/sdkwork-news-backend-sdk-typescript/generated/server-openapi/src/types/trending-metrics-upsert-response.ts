import type { NewsTrendingMetric } from './news-trending-metric';

export interface TrendingMetricsUpsertResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
