export interface NewsLiveUpdate {
  id: string;
  tenantId: string;
  liveEventId: string;
  title?: string;
  body: string;
  updateType: 'text' | 'image' | 'video' | 'quote' | 'fact_check' | 'correction';
  importance: number;
  sourceId?: string;
  authorId?: string;
  itemId?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
}
