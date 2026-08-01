import { createTokenManager } from "@sdkwork/sdk-common";
import { describe, expect, it } from "vitest";
import {
  createNewsAccountRuntime,
  resolveNewsAccountBootstrap,
} from "../src/index.js";

describe("News Account runtime", () => {
  it("hydrates the shared token manager from persistent storage", async () => {
    const tokenManager = createTokenManager();
    const storage = new Map<string, string>();
    const runtime = createNewsAccountRuntime({
      appId: "sdkwork-news",
      deploymentMode: "local",
      environment: "test",
      iamApplicationPublicHttpUrl: "https://iam.example.test",
      storage: {
        getItem: (key) => storage.get(key) ?? null,
        removeItem: (key) => { storage.delete(key); },
        setItem: (key, value) => { storage.set(key, value); },
      },
      tokenManager,
    });
    await runtime.hydrate();
    expect(runtime.tokenManager).toBe(tokenManager);
    expect(runtime.service).toBeDefined();
  });

  it("resolves IAM from the platform gateway", () => {
    expect(resolveNewsAccountBootstrap({
      PROD: true,
      VITE_SDKWORK_NEWS_PLATFORM_API_GATEWAY_HTTP_URL: "https://api.example.test/",
    })).toEqual({
      config: {
        appId: "sdkwork-news",
        deploymentMode: "saas",
        environment: "prod",
        iamApplicationPublicHttpUrl: "https://api.example.test",
      },
      mode: "sdk",
    });
  });
});
