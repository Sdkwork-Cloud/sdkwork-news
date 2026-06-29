import type { MediaResource } from './media-resource';
import type { PageInfo } from './page-info';

export interface ItemsMediaListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
