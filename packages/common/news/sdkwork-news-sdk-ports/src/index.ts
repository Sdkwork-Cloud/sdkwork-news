import type { SdkworkNewsCategory, SdkworkNewsItem } from "@sdkwork/news-contracts";

export interface SdkworkNewsListParams {
  categoryId?: string;
  q?: string;
  status?: string;
}

export interface SdkworkNewsAppSdkPort {
  news: {
    categories: {
      list(): Promise<{ data: SdkworkNewsCategory[] }>;
    };
    items: {
      bySlug: {
        retrieve(slug: string): Promise<{ data: SdkworkNewsItem }>;
      };
      list(params?: SdkworkNewsListParams): Promise<{ data: SdkworkNewsItem[] }>;
      retrieve(itemId: string): Promise<{ data: SdkworkNewsItem }>;
    };
    overview: {
      retrieve(): Promise<{ data: unknown }>;
    };
  };
}

export interface SdkworkNewsBackendSdkPort {
  news: {
    categories: {
      create(body: Partial<SdkworkNewsCategory>): Promise<{ data: SdkworkNewsCategory }>;
      delete(categoryId: string): Promise<{ data: { id: string } }>;
      management: {
        list(): Promise<{ data: SdkworkNewsCategory[] }>;
      };
      update(categoryId: string, body: Partial<SdkworkNewsCategory>): Promise<{ data: SdkworkNewsCategory }>;
    };
    items: {
      archive(itemId: string): Promise<{ data: SdkworkNewsItem }>;
      create(body: Partial<SdkworkNewsItem>): Promise<{ data: SdkworkNewsItem }>;
      delete(itemId: string): Promise<{ data: { id: string } }>;
      editorialReadiness: {
        retrieve(itemId: string): Promise<{ data: unknown }>;
      };
      feature(itemId: string): Promise<{ data: SdkworkNewsItem }>;
      management: {
        list(params?: SdkworkNewsListParams): Promise<{ data: SdkworkNewsItem[] }>;
      };
      publish(itemId: string): Promise<{ data: SdkworkNewsItem }>;
      schedule(itemId: string, body: { scheduledFor: string }): Promise<{ data: SdkworkNewsItem }>;
      update(itemId: string, body: Partial<SdkworkNewsItem>): Promise<{ data: SdkworkNewsItem }>;
    };
  };
}

