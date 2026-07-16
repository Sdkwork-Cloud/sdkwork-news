import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("news open SDK assembly points at sdkwork-news open authority", () => {
  const assembly = JSON.parse(readFileSync("sdks/sdkwork-news-sdk/sdk-manifest.json", "utf8"));
  assert.equal(assembly.sdkOwner, "sdkwork-news");
  assert.equal(assembly.apiAuthority, "sdkwork-news.open");
  assert.equal(assembly.discoverySurface.apiPrefix, "/open/v3/api");
  assert.equal(assembly.discoverySurface.sdkTarget, "custom");
});

test("news open SDK manifest does not force sdkwork-v3 custom profile", () => {
  const manifest = JSON.parse(readFileSync("sdks/sdkwork-news-sdk/sdk-manifest.json", "utf8"));
  assert.equal(manifest.sdkOwner, "sdkwork-news");
  assert.equal(manifest.sdkType, "custom");
  assert.equal(manifest.standardProfile, null);
});
