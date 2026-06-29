export interface NewsFollow {
  id: string;
  tenantId: string;
  userId: string;
  targetType: 'source' | 'author' | 'topic' | 'channel';
  targetId: string;
  createdAt: string;
}
