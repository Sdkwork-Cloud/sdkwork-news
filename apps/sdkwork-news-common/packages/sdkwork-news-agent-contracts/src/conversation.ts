export type NewsConversationRole = "agent" | "system" | "user";

export interface NewsConversationMessage {
  id: string;
  occurredAt: string;
  role: NewsConversationRole;
  sequence?: number;
  status?: "failed" | "sent" | "streaming";
  summary?: string;
  text: string;
}

export interface NewsConversationMessagePage {
  items: NewsConversationMessage[];
  pageInfo: {
    hasMore: boolean;
    mode: "cursor";
    nextCursor?: string;
    pageSize: number;
  };
}

export interface NewsConversationSubscription {
  close(): void;
}

export interface NewsAgentConversationPort {
  ensureConversation(agentId: string, conversationId?: string): Promise<string>;
  listMessages(
    conversationId: string,
    query?: { cursor?: string; pageSize?: number },
  ): Promise<NewsConversationMessagePage>;
  markRead(conversationId: string, sequence: number): Promise<void>;
  sendText(conversationId: string, text: string): Promise<{ messageId: string }>;
  subscribe(
    conversationId: string,
    listener: (message: NewsConversationMessage) => void,
  ): NewsConversationSubscription;
}

export type NewsDigestCardKind = "briefing" | "change" | "risk" | "decision";

export interface NewsDigestCitation {
  publishedAt?: string;
  sourceName: string;
  title: string;
  url: string;
}

export interface NewsDigestCard {
  citations: NewsDigestCitation[];
  confidence: number;
  id: string;
  kind: NewsDigestCardKind;
  summary: string;
  title: string;
}
