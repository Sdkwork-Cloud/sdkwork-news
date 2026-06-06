#!/usr/bin/env node
import {
  resolveFamilySdkRoot,
  runNewsSdkGenerator,
} from "../../../tools/news_sdk_generator_runner.mjs";

runNewsSdkGenerator(
  {
    apiAuthority: "sdkwork-news.backend",
    apiPrefix: "/backend/v3/api",
    defaultBaseUrl: "http://127.0.0.1:18080",
    defaultOpenapiFile: "news-backend-api.openapi.json",
    sdkName: "sdkwork-news-backend-sdk",
    sdkRoot: resolveFamilySdkRoot(import.meta.url),
    sdkType: "backend",
  },
  process.argv.slice(2),
);
