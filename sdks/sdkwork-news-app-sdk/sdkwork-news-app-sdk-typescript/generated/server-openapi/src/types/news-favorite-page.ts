import type { NewsFavorite } from './news-favorite';

export interface NewsFavoritePage {
  items: NewsFavorite[];
  cursor?: string;
  hasMore: boolean;
  limit: number;
}
