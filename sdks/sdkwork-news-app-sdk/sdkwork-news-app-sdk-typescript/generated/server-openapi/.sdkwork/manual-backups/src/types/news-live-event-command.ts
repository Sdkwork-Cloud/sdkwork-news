export interface NewsLiveEventCommand {
  slug: string;
  title: string;
  summary: string;
  eventType: 'developing_story' | 'election' | 'sports' | 'market' | 'weather' | 'emergency';
  priority: number;
  region?: string;
  locale?: string;
  startedAt?: string;
}
