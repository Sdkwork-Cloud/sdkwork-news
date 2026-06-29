import type { NewsTrendingMetric } from './news-trending-metric';
import type { PageInfo } from './page-info';

export interface TrendingMetricsListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
