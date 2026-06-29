import type { NewsItemMetricSnapshot } from './news-item-metric-snapshot';
import type { PageInfo } from './page-info';

export interface ItemsMetricsListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
