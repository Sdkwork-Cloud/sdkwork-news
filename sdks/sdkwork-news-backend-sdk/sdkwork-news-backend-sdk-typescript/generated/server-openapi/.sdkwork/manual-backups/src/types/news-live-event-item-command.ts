export interface NewsLiveEventItemCommand {
  itemId: string;
  relationType: 'source_article' | 'background' | 'analysis' | 'timeline_context' | 'related';
  rank: number;
  note?: string;
}
