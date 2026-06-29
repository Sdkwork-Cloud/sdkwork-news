import type { NewsBreakingAlert } from './news-breaking-alert';

export interface AlertsBreakingCancelResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
