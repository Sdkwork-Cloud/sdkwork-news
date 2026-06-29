export interface NewsUserInterestSignal {
  tenantId: string;
  userId: string;
  targetType: 'source' | 'author' | 'topic' | 'channel' | 'tag';
  targetId: string;
  affinityScore: number;
  confidence: number;
  source: 'explicit' | 'behavior' | 'editorial' | 'imported';
  updatedAt: string;
}
