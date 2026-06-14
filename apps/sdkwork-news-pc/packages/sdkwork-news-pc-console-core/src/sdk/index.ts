export interface ConsoleSdkConfig {
  baseUrl: string;
  tokenManager: TokenManager;
}

export interface TokenManager {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  clearAccessToken(): void;
}

export function createConsoleSdk(config: ConsoleSdkConfig) {
  return {
    baseUrl: config.baseUrl,
    tokenManager: config.tokenManager,
  };
}

