export interface NewsRecommendationEventCommand {
  itemId: string;
  channelId?: string;
  eventType: 'impression' | 'click' | 'dwell' | 'complete' | 'dismiss' | 'share';
  dwellMs?: number;
  traceId?: string;
  occurredAt: string;
}
