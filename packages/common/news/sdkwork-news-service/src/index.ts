import { filterNewsItems, type SdkworkNewsItem } from "@sdkwork/news-contracts";
import type { SdkworkNewsAppSdkPort, SdkworkNewsListParams } from "@sdkwork/news-sdk-ports";

export interface SdkworkNewsService {
  listPublished(params?: SdkworkNewsListParams): Promise<SdkworkNewsItem[]>;
  retrieveBySlug(slug: string): Promise<SdkworkNewsItem>;
}

export function createSdkworkNewsService(client: SdkworkNewsAppSdkPort): SdkworkNewsService {
  return {
    async listPublished(params = {}) {
      const response = await client.news.items.list(params);
      return filterNewsItems(response.data, {
        categoryId: params.categoryId,
        q: params.q,
        statuses: ["published"],
      });
    },
    async retrieveBySlug(slug) {
      const response = await client.news.items.bySlug.retrieve(slug);
      return response.data;
    },
  };
}

