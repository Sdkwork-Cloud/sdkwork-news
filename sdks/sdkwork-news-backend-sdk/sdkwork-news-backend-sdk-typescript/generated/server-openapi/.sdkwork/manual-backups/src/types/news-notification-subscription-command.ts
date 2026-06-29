export interface NewsNotificationSubscriptionCommand {
  targetType: 'source' | 'author' | 'topic' | 'channel' | 'tag';
  targetId: string;
  channel: 'push' | 'email' | 'in_app' | 'sms';
  frequency: 'breaking' | 'daily' | 'weekly' | 'silent';
  quietStart?: string;
  quietEnd?: string;
  locale?: string;
}
