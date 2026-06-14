export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface PermissionChecker {
  hasPermission(permission: string): boolean;
  hasAnyPermission(permissions: string[]): boolean;
  hasAllPermissions(permissions: string[]): boolean;
  getPermissions(): string[];
}

export function createPermissionChecker(permissions: string[]): PermissionChecker {
  return {
    hasPermission(permission: string) {
      return permissions.includes(permission);
    },
    hasAnyPermission(permissions: string[]) {
      return permissions.some(p => permissions.includes(p));
    },
    hasAllPermissions(permissions: string[]) {
      return permissions.every(p => permissions.includes(p));
    },
    getPermissions() {
      return [...permissions];
    },
  };
}

export const CONSOLE_PERMISSIONS = {
  // News management
  NEWS_VIEW: 'news:view',
  NEWS_CREATE: 'news:create',
  NEWS_EDIT: 'news:edit',
  NEWS_DELETE: 'news:delete',
  NEWS_PUBLISH: 'news:publish',
  
  // Channel management
  CHANNEL_VIEW: 'channel:view',
  CHANNEL_CREATE: 'channel:create',
  CHANNEL_EDIT: 'channel:edit',
  CHANNEL_DELETE: 'channel:delete',
  
  // Topic management
  TOPIC_VIEW: 'topic:view',
  TOPIC_CREATE: 'topic:create',
  TOPIC_EDIT: 'topic:edit',
  TOPIC_DELETE: 'topic:delete',
  
  // Comment moderation
  COMMENT_VIEW: 'comment:view',
  COMMENT_MODERATE: 'comment:moderate',
  COMMENT_DELETE: 'comment:delete',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
} as const;

export type ConsolePermission = typeof CONSOLE_PERMISSIONS[keyof typeof CONSOLE_PERMISSIONS];

