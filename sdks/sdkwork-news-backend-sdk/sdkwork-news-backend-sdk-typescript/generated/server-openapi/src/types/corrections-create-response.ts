import type { NewsCorrectionNotice } from './news-correction-notice';

export interface CorrectionsCreateResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
