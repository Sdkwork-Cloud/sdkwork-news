import type { NewsModerationCase } from './news-moderation-case';

export interface ModerationCasesUpdateResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
