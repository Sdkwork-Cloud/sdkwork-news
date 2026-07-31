import type { NewsReadingSchedule } from "./schedule.js";

export type NewsAgentStatus = "active" | "paused" | "attention";
export type NewsAgentTone = "brief" | "analytical" | "executive";

export interface NewsAgentReadingScope {
  categories: string[];
  keywords: string[];
  languages: string[];
  regions: string[];
  trustedSources: string[];
}

export interface NewsReadingAgent {
  accent: string;
  conversationId?: string;
  createdAt: string;
  description: string;
  id: string;
  lastDigestAt?: string;
  lastDigestSummary?: string;
  name: string;
  readingScope: NewsAgentReadingScope;
  schedule: NewsReadingSchedule;
  status: NewsAgentStatus;
  tone: NewsAgentTone;
  unreadCount: number;
  updatedAt: string;
  version?: string;
}

export interface CreateNewsReadingAgentInput {
  accent: string;
  description: string;
  name: string;
  readingScope: NewsAgentReadingScope;
  schedule: NewsReadingSchedule;
  tone: NewsAgentTone;
}

export type UpdateNewsReadingAgentInput = Partial<CreateNewsReadingAgentInput> & {
  conversationId?: string;
  status?: NewsAgentStatus;
};

export interface NewsAgentPageInfo {
  hasMore: boolean;
  mode: "cursor" | "offset";
  nextCursor?: string;
  page?: number;
  pageSize: number;
  totalItems?: number;
}

export interface NewsAgentPage {
  items: NewsReadingAgent[];
  pageInfo: NewsAgentPageInfo;
}

export interface ListNewsAgentsQuery {
  cursor?: string;
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface NewsAgentProfilePort {
  create(input: CreateNewsReadingAgentInput): Promise<NewsReadingAgent>;
  get(agentId: string): Promise<NewsReadingAgent>;
  list(query?: ListNewsAgentsQuery): Promise<NewsAgentPage>;
  update(agentId: string, input: UpdateNewsReadingAgentInput): Promise<NewsReadingAgent>;
}
