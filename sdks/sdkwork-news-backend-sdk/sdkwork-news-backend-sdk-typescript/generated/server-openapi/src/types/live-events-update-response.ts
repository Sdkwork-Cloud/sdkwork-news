import type { NewsLiveEvent } from './news-live-event';

export interface LiveEventsUpdateResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
