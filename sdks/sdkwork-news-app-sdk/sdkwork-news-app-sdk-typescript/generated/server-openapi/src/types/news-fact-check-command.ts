export interface NewsFactCheckCommand {
  itemId?: string;
  claim: string;
  verdict: 'true' | 'mostly_true' | 'mixed' | 'mostly_false' | 'false' | 'unverified';
  summary: string;
  evidenceUrl?: string;
  reviewerUserId?: string;
}
