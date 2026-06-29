export interface NewsItemMetricSnapshot {
  tenantId: string;
  itemId: string;
  impressionCount: number;
  clickCount: number;
  shareCount: number;
  commentCount: number;
  favoriteCount: number;
  reactionCount: number;
  reportCount: number;
  hotScore: number;
  computedAt: string;
}
