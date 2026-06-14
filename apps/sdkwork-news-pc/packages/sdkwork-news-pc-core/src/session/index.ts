export interface Session {
  userId: string;
  tenantId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SessionManager {
  getSession(): Session | null;
  setSession(session: Session): void;
  clearSession(): void;
  isAuthenticated(): boolean;
}

export function createSessionManager(): SessionManager {
  let session: Session | null = null;

  return {
    getSession() {
      return session;
    },
    setSession(newSession: Session) {
      session = newSession;
    },
    clearSession() {
      session = null;
    },
    isAuthenticated() {
      return session !== null && session.expiresAt > Date.now();
    },
  };
}
