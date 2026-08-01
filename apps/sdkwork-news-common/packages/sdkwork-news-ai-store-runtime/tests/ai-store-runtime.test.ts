import { createTokenManager } from "@sdkwork/sdk-common";
import { describe, expect, it } from "vitest";
import {
  createAiStoreRuntime,
  resolveAiStoreBootstrap,
} from "../src/index.js";

describe("AI Store runtime", () => {
  it("shares the application token manager across three composed SDKs", () => {
    const tokenManager = createTokenManager();
    const runtime = createAiStoreRuntime({
      appStoreApplicationPublicHttpUrl: "https://appstore.example.test",
      mcpApplicationPublicHttpUrl: "https://mcp.example.test",
      platform: "WEB",
      skillsApplicationPublicHttpUrl: "https://skills.example.test",
      tokenManager,
    });
    expect(runtime.tokenManager).toBe(tokenManager);
    expect(runtime.service).toBeDefined();
  });

  it("resolves all SDKs from the platform gateway", () => {
    expect(resolveAiStoreBootstrap({
      PROD: true,
      VITE_SDKWORK_NEWS_PLATFORM_API_GATEWAY_HTTP_URL: "https://api.example.test/",
    })).toEqual({
      config: {
        appStoreApplicationPublicHttpUrl: "https://api.example.test",
        mcpApplicationPublicHttpUrl: "https://api.example.test",
        skillsApplicationPublicHttpUrl: "https://api.example.test",
      },
      mode: "sdk",
    });
  });

  it("fails closed in production when a required SDK URL is absent", () => {
    expect(() => resolveAiStoreBootstrap({ PROD: true })).toThrow(
      /requires AppStore, Skills, and MCP/u,
    );
  });
});
