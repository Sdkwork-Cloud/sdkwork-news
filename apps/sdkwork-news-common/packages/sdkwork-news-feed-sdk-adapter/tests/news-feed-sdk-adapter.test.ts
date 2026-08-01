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

  it("maps detail capabilities through the composed app SDK", async () => {
    const retrieve = vi.fn(async () => ({
      body: "First paragraph.\n\nSecond paragraph.",
      categoryId: "technology",
      featured: false,
      id: "article-1",
      priority: 1,
      slug: "article-1",
      status: "published" as const,
      summary: "Summary",
      tags: ["Agent"],
      tenantId: "tenant-1",
      title: "Agentic news",
      updatedAt: "2026-08-01T00:00:00.000Z",
    }));
    const related = vi.fn(async () => ({
      items: [],
      pageInfo: { hasMore: false, mode: "cursor" },
    }));
    const createFeedback = vi.fn(async () => ({}));
    const createEvent = vi.fn(async () => ({}));
    const client = {
      news: {
        events: { create: createEvent },
        feedback: { create: createFeedback },
        items: { related: { list: related }, retrieve },
      },
    } as unknown as SdkworkAppClient;
    const port = createSdkworkNewsFeedPort(client);

    await expect(port.retrieveArticle("article-1")).resolves.toMatchObject({
      body: "First paragraph.\n\nSecond paragraph.",
      id: "article-1",
      slug: "article-1",
      updatedAt: "2026-08-01T00:00:00.000Z",
    });
    await port.listRelated("article-1", 6);
    await port.createFeedback("article-1", "more_like_this", "useful");
    await port.createEvent({
      eventType: "click",
      itemId: "article-1",
      occurredAt: "2026-08-01T00:00:00.000Z",
    });

    expect(related).toHaveBeenCalledWith("article-1", { limit: "6" });
    expect(createFeedback).toHaveBeenCalledWith({
      feedbackType: "more_like_this",
      reason: "useful",
      targetId: "article-1",
      targetType: "item",
    });
    expect(createEvent).toHaveBeenCalledWith({
      eventType: "click",
      itemId: "article-1",
      occurredAt: "2026-08-01T00:00:00.000Z",
    });
  });
});
