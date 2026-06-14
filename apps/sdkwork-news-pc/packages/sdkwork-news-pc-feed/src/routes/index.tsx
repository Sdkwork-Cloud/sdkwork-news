export const NEWS_ROUTES = {
  HOME: '/news',
  CATEGORY: '/news/category/:categoryId',
  ITEM: '/news/:itemSlug',
  SEARCH: '/news/search',
  CHANNELS: '/news/channels',
  CHANNEL: '/news/channels/:channelId',
  TOPICS: '/news/topics',
  TOPIC: '/news/topics/:topicId',
  TRENDING: '/news/trending',
  LIVE: '/news/live',
  LIVE_EVENT: '/news/live/:eventId',
  DIGESTS: '/news/digests',
  FAVORITES: '/news/favorites',
  HISTORY: '/news/history',
  FOLLOWS: '/news/follows',
  INTERESTS: '/news/interests',
  NOTIFICATIONS: '/news/notifications',
  SETTINGS: '/news/settings',
} as const;

export type NewsRoute = typeof NEWS_ROUTES[keyof typeof NEWS_ROUTES];

export function buildNewsRoute(route: NewsRoute, params?: Record<string, string>): string {
  if (!params) {
    return route;
  }

  let path: string = route;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, encodeURIComponent(value));
  }
  return path;
}

export function buildNewsHomeRoute(): string {
  return NEWS_ROUTES.HOME;
}

export function buildNewsCategoryRoute(categoryId: string): string {
  return buildNewsRoute(NEWS_ROUTES.CATEGORY, { categoryId });
}

export function buildNewsItemRoute(itemSlug: string): string {
  return buildNewsRoute(NEWS_ROUTES.ITEM, { itemSlug });
}

export function buildNewsSearchRoute(query?: string): string {
  const base = NEWS_ROUTES.SEARCH;
  if (query) {
    return `${base}?q=${encodeURIComponent(query)}`;
  }
  return base;
}

export function buildNewsChannelRoute(channelId: string): string {
  return buildNewsRoute(NEWS_ROUTES.CHANNEL, { channelId });
}

export function buildNewsTopicRoute(topicId: string): string {
  return buildNewsRoute(NEWS_ROUTES.TOPIC, { topicId });
}

export function buildNewsLiveEventRoute(eventId: string): string {
  return buildNewsRoute(NEWS_ROUTES.LIVE_EVENT, { eventId });
}
