import { createClient, SdkworkAppClient } from '../../../../sdks/sdkwork-news-app-sdk/sdkwork-news-app-sdk-typescript/generated/server-openapi/src';
import type { NewsApi } from '../../../../sdks/sdkwork-news-app-sdk/sdkwork-news-app-sdk-typescript/generated/server-openapi/src';

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
