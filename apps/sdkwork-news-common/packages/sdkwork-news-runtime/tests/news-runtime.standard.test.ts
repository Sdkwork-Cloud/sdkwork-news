import { describe, expect, it } from "vitest";
import { createTokenManager } from "@sdkwork/sdk-common";
import {
  createNewsFeedRuntime,
  createSdkworkNewsRuntime,
  resolveNewsFeedBootstrap,
} from "../src/index.ts";

describe("sdkwork-news runtime", () => {
  it("binds service with sdkwork-news ownership metadata", () => {
    const runtime = createSdkworkNewsRuntime({ listPublished: async () => [], retrieveBySlug: async () => ({} as never) });
    expect(runtime.owner).toBe("sdkwork-news");
    expect(runtime.routeCount).toBe(152);
  });

  it("shares the application token manager with the News SDK client", () => {
    const tokenManager = createTokenManager();
    const runtime = createNewsFeedRuntime({
      newsApplicationPublicHttpUrl: "https://news.example.test",
      tokenManager,
    });

    expect(runtime.tokenManager).toBe(tokenManager);
    expect(runtime.client).toBeDefined();
    expect(runtime.service).toBeDefined();
  });

  it("resolves the News URL from the platform gateway and strips trailing slashes", () => {
    expect(resolveNewsFeedBootstrap({
      PROD: true,
      VITE_SDKWORK_NEWS_PLATFORM_API_GATEWAY_HTTP_URL: "https://api.example.test/",
    })).toEqual({
      config: {
        newsApplicationPublicHttpUrl: "https://api.example.test",
      },
      mode: "sdk",
    });
  });

  it("fails closed when production News SDK configuration is absent", () => {
    expect(() => resolveNewsFeedBootstrap({ PROD: true })).toThrow(
      /requires the News application public HTTP URL/u,
    );
  });

  it("rejects credentials in a public News SDK URL", () => {
    expect(() => resolveNewsFeedBootstrap({
      PROD: true,
      VITE_SDKWORK_NEWS_APPLICATION_PUBLIC_HTTP_URL: "https://user@example.test",
    })).toThrow(/must not contain credentials/u);
  });
});
