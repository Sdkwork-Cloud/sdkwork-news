import { createClient, SdkworkAppClient } from '@sdkwork/news-app-sdk';
import type { NewsApi } from '@sdkwork/news-app-sdk';

export interface SdkClients {
  newsApi: NewsApi;
  appClient: SdkworkAppClient;
}

export function createSdkClients(baseUrl: string = '/api'): SdkClients {
  const appClient = createClient({
    baseUrl,
  });

  return {
    newsApi: appClient.news,
    appClient,
  };
}
