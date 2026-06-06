import type { NewsItem } from './news-item';

export interface NewsSearchResult {
  item: NewsItem;
  score: number;
  highlight?: string;
}
