export interface NewsItemCommand {
  categoryId?: string;
  slug?: string;
  title?: string;
  summary?: string;
  body?: string;
  authorName?: string;
  priority?: number;
  tags?: string[];
}
