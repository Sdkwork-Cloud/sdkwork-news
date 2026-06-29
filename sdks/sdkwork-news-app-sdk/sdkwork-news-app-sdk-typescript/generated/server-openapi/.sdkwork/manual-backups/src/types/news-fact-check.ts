export interface NewsFactCheck {
  id: string;
  tenantId: string;
  itemId?: string;
  claim: string;
  verdict: 'true' | 'mostly_true' | 'mixed' | 'mostly_false' | 'false' | 'unverified';
  summary: string;
  evidenceUrl?: string;
  reviewerUserId?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  updatedAt: string;
}
