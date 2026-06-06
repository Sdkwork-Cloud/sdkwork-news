#!/usr/bin/env node
import {
  resolveFamilySdkRoot,
  runNewsSdkGenerator,
} from "../../../tools/news_sdk_generator_runner.mjs";

runNewsSdkGenerator(
  {
    apiAuthority: "sdkwork-news.open",
    apiPrefix: "/open/v3/api",
    defaultBaseUrl: "http://127.0.0.1:18082",
    defaultOpenapiFile: "news-open-api.openapi.json",
    sdkName: "sdkwork-news-sdk",
    sdkRoot: resolveFamilySdkRoot(import.meta.url),
    sdkType: "custom",
  },
  process.argv.slice(2),
);
