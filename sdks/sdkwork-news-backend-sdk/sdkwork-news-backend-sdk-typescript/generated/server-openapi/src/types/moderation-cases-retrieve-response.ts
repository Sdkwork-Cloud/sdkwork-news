import type { NewsModerationCase } from './news-moderation-case';

export interface ModerationCasesRetrieveResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
