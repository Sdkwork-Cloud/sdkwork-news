import type { NewsItemStatus } from './news-item-status';

export interface NewsItem {
  id: string;
  tenantId: string;
  categoryId: string;
  slug: string;
  title: string;
  summary: string;
  body?: string;
  status: NewsItemStatus;
  authorName?: string;
  featured?: boolean;
  priority: number;
  estimatedReadMinutes?: number;
  tags?: string[];
  publishedAt?: string;
  scheduledFor?: string;
  updatedAt?: string;
}
