export interface AppConfig {
  appName: string;
  appVersion: string;
  apiBaseUrl: string;
  wsBaseUrl: string;
}

export function createAppConfig(): AppConfig {
  return {
    appName: 'sdkwork-news',
    appVersion: '0.1.0',
    apiBaseUrl: '/api',
    wsBaseUrl: '/ws',
  };
}
