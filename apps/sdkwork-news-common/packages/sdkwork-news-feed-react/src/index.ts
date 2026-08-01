import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  NewsFeedChannel,
  NewsFeedItem,
  NewsFeedService,
} from "@sdkwork/news-feed-service";

export * from "./article-controller.js";

export type NewsFeedStatus =
  | "empty"
  | "error"
  | "loading"
  | "ready"
  | "unavailable";

export interface NewsFeedController {
  activeChannelId?: string;
  canLoadMore: boolean;
  channels: readonly NewsFeedChannel[];
  channelsError?: string;
  favoriteItemIds: ReadonlySet<string>;
  favoritePendingItemIds: ReadonlySet<string>;
  items: readonly NewsFeedItem[];
  loadMore(): Promise<void>;
  loadingMore: boolean;
  mutationError?: string;
  query?: string;
  retry(): void;
  search(query: string): void;
  selectChannel(channelId?: string): void;
  status: NewsFeedStatus;
  toggleFavorite(itemId: string): Promise<void>;
  trendingError?: string;
  trendingItems: readonly NewsFeedItem[];
}

const PAGE_SIZE = 20;

export function useNewsFeedController(
  service?: NewsFeedService,
): NewsFeedController {
  const [activeChannelId, setActiveChannelId] = useState<string>();
  const [query, setQuery] = useState<string>();
  const [channels, setChannels] = useState<readonly NewsFeedChannel[]>([]);
  const [channelsError, setChannelsError] = useState<string>();
  const [trendingItems, setTrendingItems] = useState<readonly NewsFeedItem[]>([]);
  const [trendingError, setTrendingError] = useState<string>();
  const [items, setItems] = useState<readonly NewsFeedItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string>();
  const [loading, setLoading] = useState(Boolean(service));
  const [loadingMore, setLoadingMore] = useState(false);
  const [feedError, setFeedError] = useState<string>();
  const [mutationError, setMutationError] = useState<string>();
  const [favoriteItemIds, setFavoriteItemIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [favoritePendingItemIds, setFavoritePendingItemIds] = useState<
    ReadonlySet<string>
  >(() => new Set());
  const [retryKey, setRetryKey] = useState(0);
  const feedRequestId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    setChannels([]);
    setChannelsError(undefined);
    setTrendingItems([]);
    setTrendingError(undefined);
    if (!service) {
      return () => {
        cancelled = true;
      };
    }
    void service.listChannels().then(
      (nextChannels) => {
        if (!cancelled) {
          setChannels(nextChannels);
        }
      },
      () => {
        if (!cancelled) {
          setChannelsError("新闻分类暂不可用");
        }
      },
    );
    void service.listTrending().then(
      (page) => {
        if (!cancelled) {
          setTrendingItems(page.items);
        }
      },
      () => {
        if (!cancelled) {
          setTrendingError("实时热榜暂不可用");
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [retryKey, service]);

  useEffect(() => {
    const requestId = ++feedRequestId.current;
    setItems([]);
    setHasMore(false);
    setNextCursor(undefined);
    setFeedError(undefined);
    setMutationError(undefined);
    if (!service) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void service.listFeed({
      ...(activeChannelId ? { channelId: activeChannelId } : {}),
      pageSize: PAGE_SIZE,
      ...(query ? { q: query } : {}),
    }).then(
      (page) => {
        if (requestId !== feedRequestId.current) {
          return;
        }
        setItems(page.items);
        setHasMore(page.hasMore);
        setNextCursor(page.nextCursor);
        setLoading(false);
      },
      () => {
        if (requestId !== feedRequestId.current) {
          return;
        }
        setFeedError("新闻流暂不可用");
        setLoading(false);
      },
    );
  }, [activeChannelId, query, retryKey, service]);

  const retry = useCallback(() => {
    setRetryKey((current) => current + 1);
  }, []);

  const search = useCallback((value: string) => {
    const normalized = value.trim();
    setActiveChannelId(undefined);
    setQuery(normalized || undefined);
  }, []);

  const selectChannel = useCallback((channelId?: string) => {
    setQuery(undefined);
    setActiveChannelId(channelId?.trim() || undefined);
  }, []);

  const loadMore = useCallback(async () => {
    if (!service || loadingMore || !hasMore || !nextCursor) {
      return;
    }
    setLoadingMore(true);
    setMutationError(undefined);
    try {
      const page = await service.listFeed({
        ...(activeChannelId ? { channelId: activeChannelId } : {}),
        cursor: nextCursor,
        pageSize: PAGE_SIZE,
        ...(query ? { q: query } : {}),
      });
      setItems((current) => mergeById(current, page.items));
      setHasMore(page.hasMore);
      setNextCursor(page.nextCursor);
    } catch {
      setMutationError("更多新闻加载失败，请重试");
    } finally {
      setLoadingMore(false);
    }
  }, [activeChannelId, hasMore, loadingMore, nextCursor, query, service]);

  const toggleFavorite = useCallback(async (itemId: string) => {
    if (!service || favoritePendingItemIds.has(itemId)) {
      return;
    }
    const shouldFavorite = !favoriteItemIds.has(itemId);
    setMutationError(undefined);
    setFavoritePendingItemIds((current) => withSetValue(current, itemId, true));
    try {
      await service.setFavorite(itemId, shouldFavorite);
      setFavoriteItemIds((current) => withSetValue(current, itemId, shouldFavorite));
    } catch {
      setMutationError(shouldFavorite ? "收藏失败，请重试" : "取消收藏失败，请重试");
    } finally {
      setFavoritePendingItemIds((current) => withSetValue(current, itemId, false));
    }
  }, [favoriteItemIds, favoritePendingItemIds, service]);

  const status = useMemo<NewsFeedStatus>(() => {
    if (!service) {
      return "unavailable";
    }
    if (loading) {
      return "loading";
    }
    if (feedError) {
      return "error";
    }
    return items.length > 0 ? "ready" : "empty";
  }, [feedError, items.length, loading, service]);

  return {
    activeChannelId,
    canLoadMore: hasMore && Boolean(nextCursor),
    channels,
    ...(channelsError ? { channelsError } : {}),
    favoriteItemIds,
    favoritePendingItemIds,
    items,
    loadMore,
    loadingMore,
    ...(mutationError ? { mutationError } : {}),
    ...(query ? { query } : {}),
    retry,
    search,
    selectChannel,
    status,
    toggleFavorite,
    ...(trendingError ? { trendingError } : {}),
    trendingItems,
  };
}

function mergeById(
  current: readonly NewsFeedItem[],
  incoming: readonly NewsFeedItem[],
): readonly NewsFeedItem[] {
  const seen = new Set(current.map((item) => item.id));
  return [...current, ...incoming.filter((item) => !seen.has(item.id))];
}

function withSetValue(
  current: ReadonlySet<string>,
  value: string,
  present: boolean,
): ReadonlySet<string> {
  const next = new Set(current);
  if (present) {
    next.add(value);
  } else {
    next.delete(value);
  }
  return next;
}
