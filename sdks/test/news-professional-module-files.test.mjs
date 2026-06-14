import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { NEWS_PROFESSIONAL_MODULES } from "../../packages/common/news/sdkwork-news-contracts/src/index.ts";

test("professional module handoff files exist with class, method, and TODO markers", () => {
  for (const module of NEWS_PROFESSIONAL_MODULES) {
    assert.ok(existsSync(module.filePath), `Missing module file ${module.filePath}`);
    const content = readFileSync(module.filePath, "utf8");
    assert.match(content, new RegExp(`\\b${module.className}\\b`), `${module.filePath} missing ${module.className}`);
    assert.match(content, /TODO\(news-/, `${module.filePath} missing SDKWork news TODO markers`);

    for (const method of module.methods) {
      assert.match(content, new RegExp(`\\b${method.name}\\b`), `${module.filePath} missing ${method.name}`);
    }
  }
});
