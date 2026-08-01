import type { SdkworkAppClient } from "@sdkwork/news-app-sdk";
import { describe, expect, it, vi } from "vitest";
import { createSdkworkNewsFeedPort } from "../src/index.js";

describe("createSdkworkNewsFeedPort", () => {
  it("maps personalized pages without collecting or slicing them locally", async () => {
    const list = vi.fn(async () => ({
      items: [{
        item: {
          categoryId: "technology",
          featured: true,
          id: "article-1",
          priority: 1,
          slug: "article-1",
          status: "published" as const,
          summary: "Summary",
          tenantId: "tenant-1",
          title: "Agentic news",
        },
        reason: "Matches your interests",
      }],
      pageInfo: { hasMore: true, mode: "cursor", nextCursor: "next-1" },
    }));
    const client = {
      news: {
        channels: { feed: { list: vi.fn() }, list: vi.fn() },
        favorites: { create: vi.fn(), delete: vi.fn() },
        feed: { personalized: { list } },
        search: { list: vi.fn() },
        trending: { list: vi.fn() },
      },
    } as unknown as SdkworkAppClient;

    const page = await createSdkworkNewsFeedPort(client).listFeed({ pageSize: 20 });

    expect(list).toHaveBeenCalledWith({ cursor: undefined, limit: "20" });
    expect(page).toEqual({
      hasMore: true,
      items: [{
        categoryId: "technology",
        featured: true,
        id: "article-1",
        reason: "Matches your interests",
        summary: "Summary",
        tags: [],
        title: "Agentic news",
      }],
      nextCursor: "next-1",
    });
  });
});
