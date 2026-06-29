export interface NewsDigestIssue {
  id: string;
  tenantId: string;
  digestKey: string;
  title: string;
  summary?: string;
  digestType: 'daily' | 'weekly' | 'topic' | 'editorial';
  audienceType?: 'all' | 'subscribers' | 'targeted';
  locale?: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  publishedAt?: string;
  updatedAt: string;
}
