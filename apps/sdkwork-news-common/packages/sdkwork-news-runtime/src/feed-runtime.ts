import {
  createClient,
  type SdkworkAppClient,
} from "@sdkwork/news-app-sdk";
import { createSdkworkNewsFeedPort } from "@sdkwork/news-feed-sdk-adapter";
import {
  createNewsFeedService,
  type NewsFeedService,
} from "@sdkwork/news-feed-service";
import type { AuthTokenManager } from "@sdkwork/sdk-common";
import type { NewsFeedBootstrapConfig } from "./config.js";

export interface CreateNewsFeedRuntimeInput extends NewsFeedBootstrapConfig {
  tokenManager: AuthTokenManager;
}

export interface NewsFeedRuntime {
  client: SdkworkAppClient;
  service: NewsFeedService;
  tokenManager: AuthTokenManager;
}

export function createNewsFeedRuntime(
  input: CreateNewsFeedRuntimeInput,
): NewsFeedRuntime {
  const client = createClient({
    baseUrl: input.newsApplicationPublicHttpUrl,
    tokenManager: input.tokenManager,
  });
  const port = createSdkworkNewsFeedPort(client);
  return {
    client,
    service: createNewsFeedService(port),
    tokenManager: input.tokenManager,
  };
}
