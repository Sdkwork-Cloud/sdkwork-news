export interface ConsoleSession {
  userId: string;
  tenantId: string;
  organizationId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  permissions: string[];
}

export interface ConsoleSessionManager {
  getSession(): ConsoleSession | null;
  setSession(session: ConsoleSession): void;
  clearSession(): void;
  isAuthenticated(): boolean;
  hasPermission(permission: string): boolean;
}

export function createConsoleSessionManager(): ConsoleSessionManager {
  let session: ConsoleSession | null = null;

  return {
    getSession() {
      return session;
    },
    setSession(newSession: ConsoleSession) {
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
  };
}

