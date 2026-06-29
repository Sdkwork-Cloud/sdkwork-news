export interface NewsTrendingMetric {
  tenantId: string;
  itemId: string;
  metricWindow: 'hour' | 'day' | 'week';
  score: number;
  rank: number;
  computedAt: string;
}
