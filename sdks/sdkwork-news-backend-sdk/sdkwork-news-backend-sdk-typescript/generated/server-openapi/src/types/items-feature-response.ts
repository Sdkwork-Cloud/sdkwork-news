import type { NewsItem } from './news-item';

export interface ItemsFeatureResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
