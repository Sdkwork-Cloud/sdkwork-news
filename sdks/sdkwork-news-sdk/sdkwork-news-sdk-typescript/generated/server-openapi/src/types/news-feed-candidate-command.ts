export interface NewsFeedCandidateCommand {
  userId?: string;
  streamKey: string;
  itemId: string;
  score: number;
  reasonCode: string;
  traceId?: string;
  generatedAt: string;
  expiresAt?: string;
}
