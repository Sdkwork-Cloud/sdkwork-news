import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("news app SDK assembly points at sdkwork-news app authority", () => {
  const assembly = JSON.parse(readFileSync("sdks/sdkwork-news-app-sdk/sdk-manifest.json", "utf8"));
  assert.equal(assembly.sdkOwner, "sdkwork-news");
  assert.equal(assembly.apiAuthority, "sdkwork-news.app");
  assert.equal(assembly.discoverySurface.apiPrefix, "/app/v3/api");
});

