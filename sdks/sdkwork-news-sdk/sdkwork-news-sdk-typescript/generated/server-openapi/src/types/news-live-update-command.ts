export interface NewsLiveUpdateCommand {
  title?: string;
  body: string;
  updateType: 'text' | 'image' | 'video' | 'quote' | 'fact_check' | 'correction';
  importance: number;
  sourceId?: string;
  authorId?: string;
  itemId?: string;
}
