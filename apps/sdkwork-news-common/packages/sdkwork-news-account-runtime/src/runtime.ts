import { createClient, type SdkworkAppClient } from "@sdkwork/iam-app-sdk";
import {
  createIamNewsAccountPort,
  type NewsIamSessionTokens,
} from "@sdkwork/news-account-iam-adapter";
import {
  createNewsAccountService,
  type NewsAccountService,
} from "@sdkwork/news-account-service";
import type { AuthTokenManager, AuthTokens } from "@sdkwork/sdk-common";
import type { NewsAccountBootstrapConfig } from "./config.js";

export interface NewsAccountSessionStorage {
  getItem(key: string): Promise<string | null> | string | null;
  removeItem(key: string): Promise<void> | void;
  setItem(key: string, value: string): Promise<void> | void;
}

export interface CreateNewsAccountRuntimeInput extends NewsAccountBootstrapConfig {
  storage: NewsAccountSessionStorage;
  tokenManager: AuthTokenManager;
}

export interface NewsAccountRuntime {
  hydrate(): Promise<void>;
  iamClient: SdkworkAppClient;
  service: NewsAccountService;
  tokenManager: AuthTokenManager;
}

export function createNewsAccountRuntime(
  input: CreateNewsAccountRuntimeInput,
): NewsAccountRuntime {
  const storageKey = `sdkwork.${input.appId}.iamSession.v1`;
  const iamClient = createClient({
    baseUrl: input.iamApplicationPublicHttpUrl,
    tokenManager: input.tokenManager,
  });
  const clearSession = async () => {
    input.tokenManager.clearTokens();
    await input.storage.removeItem(storageKey);
  };
  const commitSession = async (session: NewsIamSessionTokens) => {
    const tokens = toAuthTokens(session);
    input.tokenManager.setTokens(tokens);
    await input.storage.setItem(storageKey, JSON.stringify(tokens));
  };
  const service = createNewsAccountService(createIamNewsAccountPort(iamClient, {
    clearSession,
    commitSession,
  }));

  return {
    hydrate: async () => {
      const tokens = await readStoredTokens(input.storage, storageKey);
      if (tokens.authToken && tokens.accessToken) {
        input.tokenManager.setTokens(tokens);
      } else {
        input.tokenManager.clearTokens();
      }
    },
    iamClient,
    service,
    tokenManager: input.tokenManager,
  };
}

function toAuthTokens(session: NewsIamSessionTokens): AuthTokens {
  const expiresAt = normalizeExpiresAt(session.expiresAt);
  return {
    accessToken: session.accessToken,
    authToken: session.authToken,
    ...(expiresAt ? { expiresAt } : {}),
    ...(session.refreshToken ? { refreshToken: session.refreshToken } : {}),
  };
}

async function readStoredTokens(
  storage: NewsAccountSessionStorage,
  key: string,
): Promise<AuthTokens> {
  const raw = await storage.getItem(key);
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const accessToken = readString(parsed.accessToken);
    const authToken = readString(parsed.authToken);
    const refreshToken = readString(parsed.refreshToken);
    return {
      ...(accessToken ? { accessToken } : {}),
      ...(authToken ? { authToken } : {}),
      ...(typeof parsed.expiresAt === "number" && Number.isFinite(parsed.expiresAt)
        ? { expiresAt: parsed.expiresAt }
        : {}),
      ...(refreshToken ? { refreshToken } : {}),
    };
  } catch {
    await storage.removeItem(key);
    return {};
  }
}

function normalizeExpiresAt(value: number | string | undefined): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return numeric;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
