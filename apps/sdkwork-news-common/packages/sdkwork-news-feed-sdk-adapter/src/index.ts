import type {
  NewsChannel as SdkNewsChannel,
  NewsFeedItem as SdkNewsFeedItem,
  NewsItem as SdkNewsItem,
  SdkworkAppClient,
} from "@sdkwork/news-app-sdk";
import type {
  NewsFeedChannel,
  NewsFeedItem,
  NewsFeedPage,
  NewsFeedPort,
} from "@sdkwork/news-feed-service";

export function createSdkworkNewsFeedPort(client: SdkworkAppClient): NewsFeedPort {
  return {
    async createFavorite(itemId) {
      await client.news.favorites.create(itemId);
    },
    async deleteFavorite(itemId) {
      await client.news.favorites.delete(itemId);
    },
    async listChannels(pageSize) {
      const page = readPage<SdkNewsChannel>(
        await client.news.channels.list({ limit: String(pageSize) }),
        "news.channels.list",
      );
      return page.items.map((channel) => ({
        ...(channel.description ? { description: channel.description } : {}),
        id: channel.id,
        title: channel.title,
      }));
    },
    async listFeed(input) {
      const pageSize = String(input.pageSize ?? 20);
      const response = input.q
        ? await client.news.search.list({
            cursor: input.cursor,
            limit: pageSize,
            q: input.q,
          })
        : input.channelId
          ? await client.news.channels.feed.list(input.channelId, {
              cursor: input.cursor,
              limit: pageSize,
            })
          : await client.news.feed.personalized.list({
              cursor: input.cursor,
              limit: pageSize,
            });
      return mapFeedPage(response, "news feed");
    },
    async listTrending(pageSize) {
      return mapFeedPage(
        await client.news.trending.list({ limit: String(pageSize) }),
        "news.trending.list",
      );
    },
  };
}

function mapFeedPage(value: unknown, operation: string): NewsFeedPage {
  const page = readPage<SdkNewsFeedItem | SdkNewsItem>(value, operation);
  return {
    hasMore: page.hasMore,
    items: page.items.map((entry) => mapFeedItem(entry, operation)),
    ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
  };
}

function mapFeedItem(
  entry: SdkNewsFeedItem | SdkNewsItem,
  operation: string,
): NewsFeedItem {
  const item = "item" in entry ? entry.item : entry;
  const reason = "item" in entry ? entry.reason : undefined;
  if (!item || typeof item.id !== "string" || typeof item.title !== "string") {
    throw new Error(`${operation} returned an invalid news item.`);
  }
  return {
    ...(item.authorName ? { authorName: item.authorName } : {}),
    categoryId: item.categoryId,
    ...(item.estimatedReadMinutes
      ? { estimatedReadMinutes: item.estimatedReadMinutes }
      : {}),
    featured: item.featured === true,
    id: item.id,
    ...(item.publishedAt ? { publishedAt: item.publishedAt } : {}),
    ...(reason ? { reason } : {}),
    summary: item.summary,
    tags: item.tags ?? [],
    title: item.title,
  };
}

interface ParsedPage<T> {
  hasMore: boolean;
  items: T[];
  nextCursor?: string;
}

function readPage<T>(value: unknown, operation: string): ParsedPage<T> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${operation} returned an invalid page.`);
  }
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.items)) {
    throw new Error(`${operation} returned a page without items.`);
  }
  const pageInfo = record.pageInfo;
  if (!pageInfo || typeof pageInfo !== "object" || Array.isArray(pageInfo)) {
    throw new Error(`${operation} returned a page without pageInfo.`);
  }
  const info = pageInfo as Record<string, unknown>;
  const nextCursor = optionalString(info.nextCursor);
  return {
    hasMore: info.hasMore === true,
    items: record.items as T[],
    ...(nextCursor ? { nextCursor } : {}),
  };
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
