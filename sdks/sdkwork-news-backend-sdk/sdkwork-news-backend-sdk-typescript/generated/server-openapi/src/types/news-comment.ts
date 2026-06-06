export interface NewsComment {
  id: string;
  tenantId: string;
  itemId: string;
  parentId?: string;
  userId: string;
  body: string;
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'hidden';
  createdAt: string;
}
