export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface AdminPermissionChecker {
  hasPermission(permission: string): boolean;
  hasAnyPermission(permissions: string[]): boolean;
  hasAllPermissions(permissions: string[]): boolean;
  getPermissions(): string[];
  getRoles(): string[];
}

export function createAdminPermissionChecker(permissions: string[], roles: string[]): AdminPermissionChecker {
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
    getRoles() {
      return [...roles];
    },
  };
}

export const ADMIN_PERMISSIONS = {
  // User management
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  USER_SUSPEND: 'user:suspend',
  
  // Tenant management
  TENANT_VIEW: 'tenant:view',
  TENANT_CREATE: 'tenant:create',
  TENANT_EDIT: 'tenant:edit',
  TENANT_DELETE: 'tenant:delete',
  
  // News management
  NEWS_VIEW: 'news:view',
  NEWS_CREATE: 'news:create',
  NEWS_EDIT: 'news:edit',
  NEWS_DELETE: 'news:delete',
  NEWS_PUBLISH: 'news:publish',
  NEWS_FEATURE: 'news:feature',
  
  // Content moderation
  MODERATION_VIEW: 'moderation:view',
  MODERATION_APPROVE: 'moderation:approve',
  MODERATION_REJECT: 'moderation:reject',
  MODERATION_DELETE: 'moderation:delete',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // System settings
  SYSTEM_VIEW: 'system:view',
  SYSTEM_EDIT: 'system:edit',
  
  // Audit
  AUDIT_VIEW: 'audit:view',
  AUDIT_EXPORT: 'audit:export',
} as const;

export type AdminPermissionType = typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS];

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  ANALYST: 'analyst',
  EDITOR: 'editor',
} as const;

export type AdminRole = typeof ADMIN_ROLES[keyof typeof ADMIN_ROLES];

