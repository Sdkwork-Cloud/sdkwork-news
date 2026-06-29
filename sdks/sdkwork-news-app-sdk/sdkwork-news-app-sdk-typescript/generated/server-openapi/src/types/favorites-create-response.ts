import type { NewsFavorite } from './news-favorite';

export interface FavoritesCreateResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
