import { createClient as createAgentsClient, type SdkworkAppClient } from "@sdkwork/agents-app-sdk";
import { createClient as createImClient, type ImSdkClient } from "@sdkwork/im-sdk";
import { createSdkworkNewsAgentProfilePort } from "@sdkwork/news-agent-sdk-adapter";
import { createNewsAgentService, type NewsAgentService } from "@sdkwork/news-agent-service";
import { createSdkworkImNewsAgentConversationPort } from "@sdkwork/news-im-adapter";
import { createTokenManager, type AuthTokenManager } from "@sdkwork/sdk-common";
import type { NewsAgentBootstrapConfig } from "./config.js";

export interface CreateNewsAgentRuntimeInput extends NewsAgentBootstrapConfig {
  tokenManager?: AuthTokenManager;
}

export interface NewsAgentRuntime {
  agentsClient: SdkworkAppClient;
  imClient: ImSdkClient;
  service: NewsAgentService;
  tokenManager: AuthTokenManager;
}

export function createNewsAgentRuntime(
  input: CreateNewsAgentRuntimeInput,
): NewsAgentRuntime {
  const tokenManager = input.tokenManager ?? createTokenManager();
  const agentsClient = createAgentsClient({
    baseUrl: input.agentsAppApiBaseUrl,
    tokenManager,
  });
  const imClient = createImClient({
    apiBaseUrl: input.imApiBaseUrl,
    tokenManager,
    websocketBaseUrl: input.imWebsocketBaseUrl,
  });
  const profiles = createSdkworkNewsAgentProfilePort(agentsClient);
  const conversations = createSdkworkImNewsAgentConversationPort(imClient);

  return {
    agentsClient,
    imClient,
    service: createNewsAgentService(profiles, conversations),
    tokenManager,
  };
}
