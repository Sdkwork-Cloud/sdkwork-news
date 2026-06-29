import type { NewsModerationCase } from './news-moderation-case';
import type { PageInfo } from './page-info';

export interface ModerationCasesListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
