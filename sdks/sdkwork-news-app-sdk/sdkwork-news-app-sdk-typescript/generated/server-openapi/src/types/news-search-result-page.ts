import type { NewsSearchResult } from './news-search-result';

export interface NewsSearchResultPage {
  items: NewsSearchResult[];
  cursor?: string;
  hasMore: boolean;
  limit: number;
}
