import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { NEWS_PROFESSIONAL_MODULES } from "../../apps/sdkwork-news-common/packages/sdkwork-news-contracts/src/index.ts";

test("professional module handoff files expose the declared implementation classes", () => {
  for (const module of NEWS_PROFESSIONAL_MODULES) {
    assert.ok(existsSync(module.filePath), `Missing module file ${module.filePath}`);
    const content = readFileSync(module.filePath, "utf8");
    assert.match(content, new RegExp(`\\b${module.className}\\b`), `${module.filePath} missing ${module.className}`);
  }
});
