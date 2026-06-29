export interface NewsLiveEvent {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  summary: string;
  eventType: 'developing_story' | 'election' | 'sports' | 'market' | 'weather' | 'emergency';
  priority: number;
  status: 'draft' | 'published' | 'closed' | 'archived';
  region?: string;
  locale?: string;
  startedAt?: string;
  publishedAt?: string;
  closedAt?: string;
  updatedAt: string;
}
