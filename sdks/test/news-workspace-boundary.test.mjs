import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workspaceYaml = readFileSync("pnpm-workspace.yaml", "utf8");
const lockfileYaml = readFileSync("pnpm-lock.yaml", "utf8");

test("news workspace does not include sdkwork-appbase packages", () => {
  for (const [fileName, contents] of [
    ["pnpm-workspace.yaml", workspaceYaml],
    ["pnpm-lock.yaml", lockfileYaml],
  ]) {
    assert.doesNotMatch(contents, /sdkwork-appbase/iu, `${fileName} must not reference sdkwork-appbase`);
    assert.doesNotMatch(contents, /apps[\\/]+sdkwork-appbase/iu, `${fileName} must not import appbase workspaces`);
    assert.doesNotMatch(contents, /appbase-pc-react/iu, `${fileName} must not import appbase PC React packages`);
  }
});
