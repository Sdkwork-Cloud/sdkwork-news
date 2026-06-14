export interface IamRuntime {
  login(username: string, password: string): Promise<void>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<void>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  tenantId: string;
}

export function createIamRuntime(): IamRuntime {
  let currentUser: User | null = null;
  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  return {
    async login(username: string, password: string) {
      // In a real implementation, this would call the auth API
      // For now, simulate a successful login
      currentUser = {
        id: 'user1',
        username,
        email: `${username}@example.com`,
        tenantId: 'tenant1',
      };
      accessToken = 'mock-access-token';
      refreshToken = 'mock-refresh-token';
    },
    async logout() {
      currentUser = null;
      accessToken = null;
      refreshToken = null;
    },
    async getCurrentUser() {
      return currentUser;
    },
    async refreshToken() {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      // In a real implementation, this would call the auth API
      accessToken = 'mock-refreshed-access-token';
    },
  };
}
