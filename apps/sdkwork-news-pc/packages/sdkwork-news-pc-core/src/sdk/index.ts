import type { NewsApi } from '@sdkwork/news-app-sdk';

export interface SdkConfig {
  baseUrl: string;
}

type PublicApi<T> = {
  [Key in keyof T]: T[Key] extends (...args: infer Args) => infer Result
    ? (...args: Args) => Result
    : T[Key] extends object
      ? PublicApi<T[Key]>
      : T[Key];
};

export type NewsApiPort = PublicApi<NewsApi>;

export function createSdk(config: SdkConfig) {
  return {
    baseUrl: config.baseUrl,
  };
}
