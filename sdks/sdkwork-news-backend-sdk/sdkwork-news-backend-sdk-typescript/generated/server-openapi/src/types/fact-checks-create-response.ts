import type { NewsFactCheck } from './news-fact-check';

export interface FactChecksCreateResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
