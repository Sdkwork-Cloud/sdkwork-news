export interface AdminRoute {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  permission?: string;
  role?: string;
}

export interface AdminRouteConfig {
  routes: AdminRoute[];
  basename?: string;
}

export function createAdminRouteConfig(routes: AdminRoute[], basename?: string): AdminRouteConfig {
  return {
    routes,
    basename,
  };
}

export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  USERS: '/admin/users',
  USER_CREATE: '/admin/users/create',
  USER_EDIT: '/admin/users/:userId/edit',
  TENANTS: '/admin/tenants',
  TENANT_CREATE: '/admin/tenants/create',
  TENANT_EDIT: '/admin/tenants/:tenantId/edit',
  NEWS: '/admin/news',
  NEWS_CREATE: '/admin/news/create',
  NEWS_EDIT: '/admin/news/:newsId/edit',
  MODERATION: '/admin/moderation',
  MODERATION_ITEM: '/admin/moderation/:itemId',
  ANALYTICS: '/admin/analytics',
  SYSTEM: '/admin/system',
  AUDIT: '/admin/audit',
  PROFILE: '/admin/profile',
} as const;

export type AdminRoutePath = typeof ADMIN_ROUTES[keyof typeof ADMIN_ROUTES];

