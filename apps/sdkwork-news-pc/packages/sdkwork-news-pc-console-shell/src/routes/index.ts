export interface ConsoleRoute {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  permission?: string;
}

export interface ConsoleRouteConfig {
  routes: ConsoleRoute[];
  basename?: string;
}

export function createConsoleRouteConfig(routes: ConsoleRoute[], basename?: string): ConsoleRouteConfig {
  return {
    routes,
    basename,
  };
}

export const CONSOLE_ROUTES = {
  DASHBOARD: '/console',
  NEWS: '/console/news',
  NEWS_CREATE: '/console/news/create',
  NEWS_EDIT: '/console/news/:newsId/edit',
  CHANNELS: '/console/channels',
  CHANNEL_CREATE: '/console/channels/create',
  CHANNEL_EDIT: '/console/channels/:channelId/edit',
  TOPICS: '/console/topics',
  TOPIC_CREATE: '/console/topics/create',
  TOPIC_EDIT: '/console/topics/:topicId/edit',
  COMMENTS: '/console/comments',
  ANALYTICS: '/console/analytics',
  SETTINGS: '/console/settings',
  PROFILE: '/console/profile',
} as const;

export type ConsoleRoutePath = typeof CONSOLE_ROUTES[keyof typeof CONSOLE_ROUTES];

