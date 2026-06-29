export interface NewsBreakingAlertCommand {
  itemId?: string;
  title: string;
  summary: string;
  severity: 'breaking' | 'important' | 'watch';
  audienceType: 'all' | 'subscribers' | 'targeted';
  targetType?: 'source' | 'author' | 'topic' | 'channel' | 'tag';
  targetId?: string;
  priority: number;
  scheduledAt?: string;
  expiresAt?: string;
}
