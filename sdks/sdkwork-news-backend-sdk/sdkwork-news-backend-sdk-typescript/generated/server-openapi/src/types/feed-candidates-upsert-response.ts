import type { NewsFeedCandidate } from './news-feed-candidate';

export interface FeedCandidatesUpsertResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
