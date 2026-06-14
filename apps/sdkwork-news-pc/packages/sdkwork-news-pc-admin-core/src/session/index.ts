export interface AdminSession {
  userId: string;
  tenantId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  permissions: string[];
  roles: string[];
}

export interface AdminSessionManager {
  getSession(): AdminSession | null;
  setSession(session: AdminSession): void;
  clearSession(): void;
  isAuthenticated(): boolean;
  hasPermission(permission: string): boolean;
  hasRole(role: string): boolean;
}

export function createAdminSessionManager(): AdminSessionManager {
  let session: AdminSession | null = null;

  return {
    getSession() {
      return session;
    },
    setSession(newSession: AdminSession) {
      session = newSession;
    },
    clearSession() {
      session = null;
    },
    isAuthenticated() {
      return session !== null && session.expiresAt > Date.now();
    },
    hasPermission(permission: string) {
      if (!session) return false;
      return session.permissions.includes(permission);
    },
    hasRole(role: string) {
      if (!session) return false;
      return session.roles.includes(role);
    },
  };
}

