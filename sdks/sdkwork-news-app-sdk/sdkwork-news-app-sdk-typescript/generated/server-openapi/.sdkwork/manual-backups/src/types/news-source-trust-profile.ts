export interface NewsSourceTrustProfile {
  id: string;
  tenantId: string;
  sourceId: string;
  trustScore: number;
  trustTier: 'verified' | 'standard' | 'watch' | 'restricted';
  credibilityStatus: 'verified' | 'unverified' | 'disputed' | 'restricted';
  factCheckRating?: string;
  correctionCount: number;
  reviewerUserId?: string;
  notes?: string;
  reviewedAt: string;
}
