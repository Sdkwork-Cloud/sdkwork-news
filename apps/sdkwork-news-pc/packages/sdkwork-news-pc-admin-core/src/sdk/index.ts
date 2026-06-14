export interface AdminSdkConfig {
  baseUrl: string;
  tokenManager: TokenManager;
}

export interface TokenManager {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  clearAccessToken(): void;
}

export function createAdminSdk(config: AdminSdkConfig) {
  return {
    baseUrl: config.baseUrl,
    tokenManager: config.tokenManager,
  };
}

