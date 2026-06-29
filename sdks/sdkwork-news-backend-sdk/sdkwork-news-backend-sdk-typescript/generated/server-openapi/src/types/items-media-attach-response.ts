import type { MediaResource } from './media-resource';

export interface ItemsMediaAttachResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
