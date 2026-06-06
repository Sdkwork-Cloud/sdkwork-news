import { describe, expect, it } from "vitest";
import type { SdkworkNewsAppSdkPort, SdkworkNewsBackendSdkPort } from "../src/index.ts";

describe("sdkwork-news SDK ports", () => {
  it("accept generated app and backend SDK resource-style surfaces", async () => {
    const appPort: SdkworkNewsAppSdkPort = {
      news: {
        categories: { list: async () => ({ data: [] }) },
        items: {
          bySlug: { retrieve: async () => ({ data: {} as never }) },
          list: async () => ({ data: [] }),
          retrieve: async () => ({ data: {} as never }),
        },
        overview: { retrieve: async () => ({ data: {} }) },
      },
    };
    const backendPort: SdkworkNewsBackendSdkPort = {
      news: {
        categories: {
          create: async () => ({ data: {} as never }),
          delete: async (categoryId: string) => ({ data: { id: categoryId } }),
          management: { list: async () => ({ data: [] }) },
          update: async () => ({ data: {} as never }),
        },
        items: {
          archive: async () => ({ data: {} as never }),
          create: async () => ({ data: {} as never }),
          delete: async (itemId: string) => ({ data: { id: itemId } }),
          editorialReadiness: { retrieve: async () => ({ data: {} }) },
          feature: async () => ({ data: {} as never }),
          management: { list: async () => ({ data: [] }) },
          publish: async () => ({ data: {} as never }),
          schedule: async () => ({ data: {} as never }),
          update: async () => ({ data: {} as never }),
        },
      },
    };

    await expect(appPort.news.categories.list()).resolves.toEqual({ data: [] });
    await expect(backendPort.news.categories.delete("category_1")).resolves.toEqual({ data: { id: "category_1" } });
  });
});
