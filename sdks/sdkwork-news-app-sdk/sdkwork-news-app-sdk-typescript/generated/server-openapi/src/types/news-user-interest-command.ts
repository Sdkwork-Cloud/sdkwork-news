export interface NewsUserInterestCommand {
  targetType: 'source' | 'author' | 'topic' | 'channel' | 'tag';
  targetId: string;
  affinityScore: number;
  confidence: number;
  source: 'explicit' | 'behavior' | 'editorial' | 'imported';
}
