import { describe, expect, it, vi } from "vitest";
import {
  createNewsFeedService,
  type NewsFeedPort,
} from "../src/index.js";

function createPort(): NewsFeedPort {
  return {
    createFavorite: vi.fn(async () => undefined),
    deleteFavorite: vi.fn(async () => undefined),
    listChannels: vi.fn(async () => []),
    listFeed: vi.fn(async () => ({ hasMore: false, items: [] })),
    listTrending: vi.fn(async () => ({ hasMore: false, items: [] })),
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
});
