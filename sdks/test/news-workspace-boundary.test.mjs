import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function readIfPresent(fileName) {
  return existsSync(fileName) ? readFileSync(fileName, "utf8") : null;
}

test("news workspace does not include sdkwork-appbase packages", () => {
  for (const [fileName, contents] of Object.entries({
    "pnpm-workspace.yaml": readIfPresent("pnpm-workspace.yaml"),
    "pnpm-lock.yaml": readIfPresent("pnpm-lock.yaml"),
  })) {
    if (contents === null) {
      continue;
    }
    assert.doesNotMatch(contents, /sdkwork-appbase/iu, `${fileName} must not reference sdkwork-appbase`);
    assert.doesNotMatch(contents, /apps[\\/]+sdkwork-appbase/iu, `${fileName} must not import appbase workspaces`);
    assert.doesNotMatch(contents, /appbase-pc-react/iu, `${fileName} must not import appbase PC React packages`);
  }
});
