export interface SdkConfig {
  baseUrl: string;
}

export function createSdk(config: SdkConfig) {
  return {
    baseUrl: config.baseUrl,
  };
}
