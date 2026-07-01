import { NEWS_APP_API_ROUTES, NEWS_BACKEND_API_ROUTES, NEWS_OPEN_API_ROUTES, NEWS_OWNER } from "@sdkwork/news-contracts";
import type { SdkworkNewsService } from "@sdkwork/news-service";

export interface SdkworkNewsRuntime {
  owner: typeof NEWS_OWNER;
  routeCount: number;
  service: SdkworkNewsService;
}

export function createSdkworkNewsRuntime(service: SdkworkNewsService): SdkworkNewsRuntime {
  return {
    owner: NEWS_OWNER,
    routeCount: NEWS_OPEN_API_ROUTES.length + NEWS_APP_API_ROUTES.length + NEWS_BACKEND_API_ROUTES.length,
    service,
  };
}
