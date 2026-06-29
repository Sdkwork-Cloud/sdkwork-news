export interface NewsFeedCandidate {
  tenantId: string;
  userId?: string;
  streamKey: string;
  itemId: string;
  score: number;
  reasonCode: string;
  traceId?: string;
  generatedAt: string;
  expiresAt?: string;
}
