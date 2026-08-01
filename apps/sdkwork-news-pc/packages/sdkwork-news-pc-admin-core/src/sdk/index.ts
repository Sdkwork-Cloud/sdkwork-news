import type { NewsApi } from '@sdkwork/news-backend-sdk';

export interface AdminSdkConfig {
  baseUrl: string;
  tokenManager: TokenManager;
}

type PublicApi<T> = {
  [Key in keyof T]: T[Key] extends (...args: infer Args) => infer Result
    ? (...args: Args) => Result
    : T[Key] extends object
      ? PublicApi<T[Key]>
      : T[Key];
};

export type AdminNewsApiPort = PublicApi<NewsApi>;

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

