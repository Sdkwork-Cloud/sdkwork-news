import type { NewsComment } from './news-comment';

export interface NewsCommentPage {
  items: NewsComment[];
  cursor?: string;
  hasMore: boolean;
  limit: number;
}
