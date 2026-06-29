export interface NewsItemTrustSnapshot {
  tenantId: string;
  itemId: string;
  trustScore: number;
  sourceTrustScore?: number;
  factCheckVerdict?: 'true' | 'mostly_true' | 'mixed' | 'mostly_false' | 'false' | 'unverified';
  correctionCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'unknown';
  computedAt: string;
}
