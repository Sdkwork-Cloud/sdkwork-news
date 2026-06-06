export interface NewsNotificationSubscription {
  id: string;
  tenantId: string;
  userId: string;
  targetType: 'source' | 'author' | 'topic' | 'channel' | 'tag';
  targetId: string;
  channel: 'push' | 'email' | 'in_app' | 'sms';
  frequency: 'breaking' | 'daily' | 'weekly' | 'silent';
  status: 'active' | 'disabled';
  quietStart?: string;
  quietEnd?: string;
  locale?: string;
  updatedAt: string;
}
