export interface NewsTopic {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  priority?: number;
}
