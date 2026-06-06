export interface NewsFollowCommand {
  targetType: 'source' | 'author' | 'topic' | 'channel';
  targetId: string;
}
