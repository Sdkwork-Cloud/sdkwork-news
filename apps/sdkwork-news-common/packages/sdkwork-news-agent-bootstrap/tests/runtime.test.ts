import { describe, expect, it } from "vitest";
import { createTokenManager } from "@sdkwork/sdk-common";
import { createNewsAgentRuntime } from "../src/index.js";

describe("createNewsAgentRuntime", () => {
  it("shares the application token manager across Agents and IM clients", () => {
    const tokenManager = createTokenManager();
    const runtime = createNewsAgentRuntime({
      agentsAppApiBaseUrl: "https://api.example.test",
      imApiBaseUrl: "https://im.example.test",
      imWebsocketBaseUrl: "wss://im.example.test",
      tokenManager,
    });

    expect(runtime.tokenManager).toBe(tokenManager);
    expect(runtime.agentsClient).toBeDefined();
    expect(runtime.imClient).toBeDefined();
    expect(runtime.service).toBeDefined();
  });
});
