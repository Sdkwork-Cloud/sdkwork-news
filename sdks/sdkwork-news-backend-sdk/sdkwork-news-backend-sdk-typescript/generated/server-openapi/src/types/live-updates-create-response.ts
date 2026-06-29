import type { NewsLiveUpdate } from './news-live-update';

export interface LiveUpdatesCreateResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
