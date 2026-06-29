export interface NewsBreakingAlert {
  id: string;
  tenantId: string;
  itemId?: string;
  title: string;
  summary: string;
  severity: 'breaking' | 'important' | 'watch';
  audienceType: 'all' | 'subscribers' | 'targeted';
  targetType?: 'source' | 'author' | 'topic' | 'channel' | 'tag';
  targetId?: string;
  priority: number;
  status: 'draft' | 'scheduled' | 'published' | 'cancelled' | 'expired';
  publishedAt?: string;
  expiresAt?: string;
  updatedAt: string;
}
