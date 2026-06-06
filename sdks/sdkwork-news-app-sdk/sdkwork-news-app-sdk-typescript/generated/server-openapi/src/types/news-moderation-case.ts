export interface NewsModerationCase {
  id: string;
  tenantId: string;
  targetType: string;
  targetId: string;
  reason: string;
  priority: number;
  status: 'open' | 'reviewing' | 'resolved' | 'rejected';
  createdAt: string;
}
