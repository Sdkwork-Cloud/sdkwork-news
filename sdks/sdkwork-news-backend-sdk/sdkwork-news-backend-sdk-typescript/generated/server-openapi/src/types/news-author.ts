export interface NewsAuthor {
  id: string;
  tenantId: string;
  sourceId?: string;
  userId?: string;
  slug: string;
  displayName: string;
  bio?: string;
  status: string;
}
