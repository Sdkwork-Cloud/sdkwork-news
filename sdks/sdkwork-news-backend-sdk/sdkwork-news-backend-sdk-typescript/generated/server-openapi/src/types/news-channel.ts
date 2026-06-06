export interface NewsChannel {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  description?: string;
  type: 'editorial' | 'algorithmic' | 'topic' | 'following' | 'hot';
  status: 'active' | 'inactive' | 'archived';
  priority?: number;
}
