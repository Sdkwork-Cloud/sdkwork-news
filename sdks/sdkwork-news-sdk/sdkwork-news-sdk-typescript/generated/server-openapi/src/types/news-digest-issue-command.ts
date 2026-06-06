export interface NewsDigestIssueCommand {
  digestKey: string;
  title: string;
  summary?: string;
  digestType: 'daily' | 'weekly' | 'topic' | 'editorial';
  audienceType?: 'all' | 'subscribers' | 'targeted';
  locale?: string;
  publishedAt?: string;
}
