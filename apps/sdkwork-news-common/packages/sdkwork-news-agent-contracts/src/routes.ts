export const NEWS_CLIENT_ROUTE_IDS = {
  account: "news.account",
  agentConversation: "news.assistant.conversation",
  agentProfile: "news.assistant.profile",
  assistant: "news.assistant",
  feed: "news.feed",
  feedArticle: "news.feed.article",
  store: "news.ai-store",
  storeDetail: "news.ai-store.detail",
} as const;

export type NewsClientRouteId = typeof NEWS_CLIENT_ROUTE_IDS[keyof typeof NEWS_CLIENT_ROUTE_IDS];
