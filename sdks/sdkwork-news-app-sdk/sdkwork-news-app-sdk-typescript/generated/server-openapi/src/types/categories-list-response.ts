import type { NewsCategory } from './news-category';
import type { PageInfo } from './page-info';

export interface CategoriesListResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
