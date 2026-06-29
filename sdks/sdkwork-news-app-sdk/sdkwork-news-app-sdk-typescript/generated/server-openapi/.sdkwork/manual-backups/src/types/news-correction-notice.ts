export interface NewsCorrectionNotice {
  id: string;
  tenantId: string;
  itemId: string;
  correctionType: 'correction' | 'clarification' | 'retraction' | 'update';
  title: string;
  body: string;
  actorUserId?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  updatedAt: string;
}
