export interface Route {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

export function createRoutes(): Route[] {
  return [
    // News routes
    { path: '/news', component: () => null },
    { path: '/news/:itemSlug', component: () => null },
    { path: '/news/search', component: () => null },
    { path: '/news/profile', component: () => null },
    { path: '/news/live', component: () => null },
    
    // Console routes
    { path: '/console', component: () => null },
    { path: '/console/news', component: () => null },
    { path: '/console/channels', component: () => null },
    { path: '/console/topics', component: () => null },
    { path: '/console/comments', component: () => null },
    { path: '/console/analytics', component: () => null },
    { path: '/console/settings', component: () => null },
    
    // Admin routes
    { path: '/admin', component: () => null },
    { path: '/admin/users', component: () => null },
    { path: '/admin/tenants', component: () => null },
    { path: '/admin/news', component: () => null },
    { path: '/admin/moderation', component: () => null },
    { path: '/admin/analytics', component: () => null },
    { path: '/admin/system', component: () => null },
    { path: '/admin/audit', component: () => null },
  ];
}
