import type { AppStoreClient } from "@sdkwork/appstore-app-sdk";
import type { SdkworkMcpAppClient } from "@sdkwork/mcp-app-sdk";
import type { SdkworkSkillsAppClient } from "@sdkwork/skills-app-sdk";
import { describe, expect, it, vi } from "vitest";
import { createSdkworkAiStorePort } from "../src/index.js";

describe("createSdkworkAiStorePort", () => {
  it("maps product installation state from the real library page", async () => {
    const clients = createClients();
    const page = await createSdkworkAiStorePort(clients, { platform: "WEB" }).list({
      kind: "product",
      pageSize: 20,
    });

    expect(page.items[0]).toMatchObject({
      action: "uninstall-product",
      id: "listing-1",
      libraryItemId: "library-1",
      name: "Deep Research",
    });
  });

  it("keeps MCP entries read-only", async () => {
    const clients = createClients();
    const page = await createSdkworkAiStorePort(clients, { platform: "WEB" }).list({
      kind: "mcp",
      pageSize: 20,
    });
    expect(page.items[0]).toMatchObject({ action: "view-only", name: "GitHub MCP" });
  });
});

function createClients() {
  return {
    appStore: {
      catalog: {
        searchListings: vi.fn(async () => ({
          items: [{
            appKey: "deep-research",
            displayName: "Deep Research",
            id: "listing-1",
            listingSlug: "deep-research",
            pricingModel: "FREE" as const,
          }],
          pageInfo: { hasMore: false, mode: "cursor" as const },
        })),
      },
      library: {
        install: vi.fn(),
        listItems: vi.fn(async () => ({
          items: [{
            appKey: "deep-research",
            id: "library-1",
            installSource: "store",
            libraryStatus: "installed",
            listingId: "listing-1",
            platform: "WEB",
          }],
          pageInfo: { hasMore: false, mode: "cursor" as const },
        })),
        uninstall: vi.fn(),
      },
    } as unknown as AppStoreClient,
    mcp: {
      mcp: {
        listServers: vi.fn(async () => ({
          items: [{
            data_scope: "user",
            health_status: "healthy",
            id: "mcp-1",
            lifecycle_status: "active",
            name: "GitHub MCP",
            server_key: "github",
            transport: "stdio",
            uuid: "mcp-uuid-1",
            visibility: "public",
          }],
          pageInfo: { hasMore: false, mode: "cursor" },
        })),
      },
    } as unknown as SdkworkMcpAppClient,
    skills: {
      skills: {
        marketplace: { list: vi.fn() },
        skillInstallations: { list: vi.fn() },
        skillPackages: {
          artifacts: { list: vi.fn() },
          installations: { create: vi.fn() },
        },
      },
    } as unknown as SdkworkSkillsAppClient,
  };
}
