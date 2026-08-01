import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function readIfPresent(fileName) {
  return existsSync(fileName) ? readFileSync(fileName, "utf8") : null;
}

test("news workspace references only approved appbase composition packages", () => {
  for (const [fileName, contents] of Object.entries({
    "pnpm-workspace.yaml": readIfPresent("pnpm-workspace.yaml"),
    "pnpm-lock.yaml": readIfPresent("pnpm-lock.yaml"),
  })) {
    if (contents === null) {
      continue;
    }
    const appbaseReferences = contents
      .split(/\r?\n/u)
      .filter((line) => /sdkwork-appbase|appbase-pc-react/iu.test(line));
    for (const reference of appbaseReferences) {
      assert.match(
        reference,
        /(?:sdkwork-runtime-bootstrap|(?:sdkwork-)?appbase-pc-react|sdkwork-i18n-pc-react)/u,
        `${fileName} contains an unapproved appbase package: ${reference}`,
      );
      assert.doesNotMatch(reference, /apps[\\/]+sdkwork-appbase/iu, `${fileName} must not import an appbase app root`);
    }
  }
});
