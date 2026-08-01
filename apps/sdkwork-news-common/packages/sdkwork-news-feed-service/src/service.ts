import type {
  NewsEngagementEventInput,
  NewsFeedListInput,
  NewsFeedPort,
  NewsFeedService,
  NewsFeedbackType,
} from "./contracts.js";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export function createNewsFeedService(port: NewsFeedPort): NewsFeedService {
  return {
    getArticle: (itemId) => port.retrieveArticle(requireItemId(itemId)),
    listChannels: () => port.listChannels(DEFAULT_PAGE_SIZE),
    listFeed: (input = {}) => port.listFeed(normalizeListInput(input)),
    listRelated: (itemId) => port.listRelated(requireItemId(itemId), 6),
    listTrending: () => port.listTrending(10),
    recordEvent: (input) => port.createEvent(normalizeEvent(input)),
    setFavorite: (itemId, favorite) => {
      const normalizedItemId = requireItemId(itemId);
      return favorite
        ? port.createFavorite(normalizedItemId)
        : port.deleteFavorite(normalizedItemId);
    },
    submitFeedback: (itemId, feedbackType, reason) => port.createFeedback(
      requireItemId(itemId),
      normalizeFeedbackType(feedbackType),
      optionalTrimmed(reason),
    ),
  };
}

function requireItemId(itemId: string): string {
  const normalizedItemId = itemId.trim();
  if (!normalizedItemId) {
    throw new Error("A news item id is required.");
  }
  return normalizedItemId;
}

function normalizeEvent(input: NewsEngagementEventInput) {
  const dwellMs = input.dwellMs;
  if (dwellMs !== undefined && (!Number.isInteger(dwellMs) || dwellMs < 0)) {
    throw new Error("News dwellMs must be a non-negative integer.");
  }
  return {
    ...(input.channelId?.trim() ? { channelId: input.channelId.trim() } : {}),
    ...(dwellMs !== undefined ? { dwellMs } : {}),
    eventType: input.eventType,
    itemId: requireItemId(input.itemId),
    occurredAt: input.occurredAt?.trim() || new Date().toISOString(),
  };
}

function normalizeFeedbackType(feedbackType: NewsFeedbackType): NewsFeedbackType {
  const supported: readonly NewsFeedbackType[] = [
    "less_like_this",
    "more_like_this",
    "not_interested",
    "quality",
  ];
  if (!supported.includes(feedbackType)) {
    throw new Error("A supported news feedback type is required.");
  }
  return feedbackType;
}

function optionalTrimmed(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function normalizeListInput(input: NewsFeedListInput): NewsFeedListInput {
  const pageSize = input.pageSize ?? DEFAULT_PAGE_SIZE;
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
    throw new Error(`News feed pageSize must be between 1 and ${MAX_PAGE_SIZE}.`);
  }
  return {
    ...(input.channelId?.trim() ? { channelId: input.channelId.trim() } : {}),
    ...(input.cursor?.trim() ? { cursor: input.cursor.trim() } : {}),
    pageSize,
    ...(input.q?.trim() ? { q: input.q.trim() } : {}),
  };
}
