import { describe, expect, it } from "vitest";
import { resolveNewsAgentBootstrap } from "../src/index.js";

describe("resolveNewsAgentBootstrap", () => {
  it("uses demo data only by default in development", () => {
    expect(resolveNewsAgentBootstrap({ MODE: "development" })).toEqual({ mode: "demo" });
  });

  it("rejects demo mode in production", () => {
    expect(() => resolveNewsAgentBootstrap({
      MODE: "production",
      VITE_SDKWORK_NEWS_DEMO_MODE: "true",
    })).toThrow(/allowed only in development or test/u);
  });

  it("fails closed when production SDK URLs are absent", () => {
    expect(() => resolveNewsAgentBootstrap({ PROD: true })).toThrow(
      /requires Agents and IM SDK base URLs/u,
    );
  });

  it("composes Agents HTTP and IM realtime URLs from the platform gateway", () => {
    expect(resolveNewsAgentBootstrap({
      PROD: true,
      VITE_SDKWORK_NEWS_PLATFORM_API_GATEWAY_HTTP_URL: "https://api.sdkwork.example/",
    })).toEqual({
      config: {
        agentsAppApiBaseUrl: "https://api.sdkwork.example",
        imApiBaseUrl: "https://api.sdkwork.example",
        imWebsocketBaseUrl: "wss://api.sdkwork.example",
      },
      mode: "sdk",
    });
  });

  it("rejects credentials and fragments in public SDK URLs", () => {
    expect(() => resolveNewsAgentBootstrap({
      MODE: "production",
      VITE_SDKWORK_NEWS_AGENTS_APP_API_BASE_URL: "https://user@example.test",
      VITE_SDKWORK_NEWS_IM_API_BASE_URL: "https://im.example.test#token",
    })).toThrow(/must not contain credentials/u);
  });
});
