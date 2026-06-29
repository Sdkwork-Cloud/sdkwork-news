import type { NewsTopic } from './news-topic';
import type { PageInfo } from './page-info';

export interface TopicsManagementListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
