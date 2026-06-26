import { describe, expect, it } from "vitest";
import { createSdkworkNewsService } from "../src/index.ts";

describe("sdkwork-news service", () => {
  it("uses injected generated SDK port instead of raw transport", async () => {
    const service = createSdkworkNewsService({
      news: {
        categories: { list: async () => ({ data: [] }) },
        items: {
          bySlug: { retrieve: async (slug: string) => ({ data: { id: "item_1", slug } as never }) },
          list: async () => ({
            data: [
              { categoryId: "product", id: "item_1", priority: 1, slug: "release", status: "published", summary: "Release", tenantId: "100001", title: "Release" },
              { categoryId: "product", id: "item_2", priority: 2, slug: "draft", status: "draft", summary: "Draft", tenantId: "100001", title: "Draft" },
            ] as never,
          }),
          retrieve: async () => ({ data: {} as never }),
        },
        overview: { retrieve: async () => ({ data: {} }) },
      },
    });

    await expect(service.listPublished()).resolves.toHaveLength(1);
    await expect(service.retrieveBySlug("release")).resolves.toEqual({ id: "item_1", slug: "release" });
  });
});
