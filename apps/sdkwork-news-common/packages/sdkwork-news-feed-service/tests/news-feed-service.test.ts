import { describe, expect, it, vi } from "vitest";
import {
  createNewsFeedService,
  type NewsFeedPort,
} from "../src/index.js";

function createPort(): NewsFeedPort {
  return {
    createEvent: vi.fn(async () => undefined),
    createFeedback: vi.fn(async () => undefined),
    createFavorite: vi.fn(async () => undefined),
    deleteFavorite: vi.fn(async () => undefined),
    listChannels: vi.fn(async () => []),
    listFeed: vi.fn(async () => ({ hasMore: false, items: [] })),
    listRelated: vi.fn(async () => ({ hasMore: false, items: [] })),
    listTrending: vi.fn(async () => ({ hasMore: false, items: [] })),
    retrieveArticle: vi.fn(async () => ({
      categoryId: "technology",
      featured: false,
      id: "item-1",
      slug: "item-1",
      summary: "Summary",
      tags: [],
      title: "Article",
    })),
  };
}

describe("createNewsFeedService", () => {
  it("requests bounded server pages", async () => {
    const port = createPort();
    const service = createNewsFeedService(port);

    await service.listFeed({ cursor: " next ", pageSize: 20 });

    expect(port.listFeed).toHaveBeenCalledWith({ cursor: "next", pageSize: 20 });
  });

  it("delegates favorite commands only after validating the item id", async () => {
    const port = createPort();
    const service = createNewsFeedService(port);

    await service.setFavorite(" item-1 ", true);
    await service.setFavorite("item-1", false);

    expect(port.createFavorite).toHaveBeenCalledWith("item-1");
    expect(port.deleteFavorite).toHaveBeenCalledWith("item-1");
    expect(() => service.setFavorite(" ", true)).toThrow("item id");
  });

  it("retrieves details, related items, feedback, and normalized events", async () => {
    const port = createPort();
    const service = createNewsFeedService(port);

    await service.getArticle(" item-1 ");
    await service.listRelated(" item-1 ");
    await service.submitFeedback(" item-1 ", "more_like_this", " useful ");
    await service.recordEvent({
      dwellMs: 1200,
      eventType: "dwell",
      itemId: " item-1 ",
      occurredAt: "2026-08-01T00:00:00.000Z",
    });

    expect(port.retrieveArticle).toHaveBeenCalledWith("item-1");
    expect(port.listRelated).toHaveBeenCalledWith("item-1", 6);
    expect(port.createFeedback).toHaveBeenCalledWith(
      "item-1",
      "more_like_this",
      "useful",
    );
    expect(port.createEvent).toHaveBeenCalledWith({
      dwellMs: 1200,
      eventType: "dwell",
      itemId: "item-1",
      occurredAt: "2026-08-01T00:00:00.000Z",
    });
  });
});
