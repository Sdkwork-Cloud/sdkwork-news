export interface NewsUserFeedbackCommand {
  targetType: 'item' | 'source' | 'author' | 'topic' | 'channel';
  targetId: string;
  feedbackType: 'not_interested' | 'block_source' | 'less_like_this' | 'more_like_this' | 'quality';
  reason?: string;
}
