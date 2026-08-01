import type {
  NewsFeedListInput,
  NewsFeedPort,
  NewsFeedService,
} from "./contracts.js";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export function createNewsFeedService(port: NewsFeedPort): NewsFeedService {
  return {
    listChannels: () => port.listChannels(DEFAULT_PAGE_SIZE),
    listFeed: (input = {}) => port.listFeed(normalizeListInput(input)),
    listTrending: () => port.listTrending(10),
    setFavorite: (itemId, favorite) => {
      const normalizedItemId = itemId.trim();
      if (!normalizedItemId) {
        throw new Error("A news item id is required.");
      }
      return favorite
        ? port.createFavorite(normalizedItemId)
        : port.deleteFavorite(normalizedItemId);
    },
  };
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
