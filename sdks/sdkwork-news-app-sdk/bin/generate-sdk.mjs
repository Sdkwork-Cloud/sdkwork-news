#!/usr/bin/env node
import {
  resolveFamilySdkRoot,
  runNewsSdkGenerator,
} from "../../../tools/news_sdk_generator_runner.mjs";

runNewsSdkGenerator(
  {
    apiAuthority: "sdkwork-news.app",
    apiPrefix: "/app/v3/api",
    defaultBaseUrl: "http://127.0.0.1:18080",
    defaultOpenapiFile: "news-app-api.openapi.json",
    sdkName: "sdkwork-news-app-sdk",
    sdkRoot: resolveFamilySdkRoot(import.meta.url),
    sdkType: "app",
  },
  process.argv.slice(2),
);
