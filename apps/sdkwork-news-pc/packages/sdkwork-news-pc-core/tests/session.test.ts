import { describe, it, expect } from 'vitest';
import { createSessionManager } from '../src/session';

describe('SessionManager', () => {
  it('should create a session manager', () => {
    const sessionManager = createSessionManager();
    expect(sessionManager).toBeDefined();
    expect(sessionManager.getSession()).toBeNull();
    expect(sessionManager.isAuthenticated()).toBe(false);
  });

  it('should set and get session', () => {
    const sessionManager = createSessionManager();
    const session = {
      userId: 'user1',
      tenantId: 'tenant1',
      accessToken: 'token1',
      refreshToken: 'refresh1',
      expiresAt: Date.now() + 3600000,
    };

    sessionManager.setSession(session);
    expect(sessionManager.getSession()).toEqual(session);
    expect(sessionManager.isAuthenticated()).toBe(true);
  });

  it('should clear session', () => {
    const sessionManager = createSessionManager();
    const session = {
      userId: 'user1',
      tenantId: 'tenant1',
      accessToken: 'token1',
      refreshToken: 'refresh1',
      expiresAt: Date.now() + 3600000,
    };

    sessionManager.setSession(session);
    sessionManager.clearSession();
    expect(sessionManager.getSession()).toBeNull();
    expect(sessionManager.isAuthenticated()).toBe(false);
  });

  it('should detect expired session', () => {
    const sessionManager = createSessionManager();
    const session = {
      userId: 'user1',
      tenantId: 'tenant1',
      accessToken: 'token1',
      refreshToken: 'refresh1',
      expiresAt: Date.now() - 1000,
    };

    sessionManager.setSession(session);
    expect(sessionManager.isAuthenticated()).toBe(false);
  });
});

