import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("news backend SDK assembly points at sdkwork-news backend authority", () => {
  const assembly = JSON.parse(readFileSync("sdks/sdkwork-news-backend-sdk/sdk-manifest.json", "utf8"));
  assert.equal(assembly.sdkOwner, "sdkwork-news");
  assert.equal(assembly.apiAuthority, "sdkwork-news.backend");
  assert.equal(assembly.discoverySurface.apiPrefix, "/backend/v3/api");
});

