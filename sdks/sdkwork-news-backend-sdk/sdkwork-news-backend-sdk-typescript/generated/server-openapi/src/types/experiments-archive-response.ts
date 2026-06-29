import type { NewsExperiment } from './news-experiment';

export interface ExperimentsArchiveResponse {
  code: 0;
  data: unknown & Record<string, unknown>;
  /** Server-owned request correlation id. */
  traceId: string;
}
