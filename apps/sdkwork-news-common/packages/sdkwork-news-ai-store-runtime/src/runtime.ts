import {
  createAppStoreClient,
  type AppStoreClient,
} from "@sdkwork/appstore-app-sdk";
import {
  createClient as createMcpClient,
  type SdkworkMcpAppClient,
} from "@sdkwork/mcp-app-sdk";
import { createSdkworkAiStorePort } from "@sdkwork/news-ai-store-sdk-adapter";
import {
  createAiStoreService,
  type AiStoreService,
} from "@sdkwork/news-ai-store-service";
import type { AuthTokenManager } from "@sdkwork/sdk-common";
import {
  createClient as createSkillsClient,
  type SdkworkSkillsAppClient,
} from "@sdkwork/skills-app-sdk";
import type { AiStoreBootstrapConfig } from "./config.js";

export interface CreateAiStoreRuntimeInput extends AiStoreBootstrapConfig {
  platform: string;
  tokenManager: AuthTokenManager;
}

export interface AiStoreRuntime {
  appStoreClient: AppStoreClient;
  mcpClient: SdkworkMcpAppClient;
  service: AiStoreService;
  skillsClient: SdkworkSkillsAppClient;
  tokenManager: AuthTokenManager;
}

export function createAiStoreRuntime(
  input: CreateAiStoreRuntimeInput,
): AiStoreRuntime {
  const appStoreClient = createAppStoreClient({
    baseUrl: input.appStoreApplicationPublicHttpUrl,
    tokenManager: input.tokenManager,
  });
  const skillsClient = createSkillsClient({
    baseUrl: input.skillsApplicationPublicHttpUrl,
    tokenManager: input.tokenManager,
  });
  const mcpClient = createMcpClient({
    baseUrl: input.mcpApplicationPublicHttpUrl,
    tokenManager: input.tokenManager,
  });
  const port = createSdkworkAiStorePort({
    appStore: appStoreClient,
    mcp: mcpClient,
    skills: skillsClient,
  }, { platform: input.platform });
  return {
    appStoreClient,
    mcpClient,
    service: createAiStoreService(port),
    skillsClient,
    tokenManager: input.tokenManager,
  };
}
