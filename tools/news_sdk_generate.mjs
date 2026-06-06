#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");
const openPath = path.join(workspaceRoot, "generated", "openapi", "news-open-api.openapi.json");
const appPath = path.join(workspaceRoot, "generated", "openapi", "news-app-api.openapi.json");
const backendPath = path.join(workspaceRoot, "generated", "openapi", "news-backend-api.openapi.json");

function run(script, args) {
  const result = spawnSync("node", [path.join(workspaceRoot, script), ...args], {
    cwd: workspaceRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const check = process.argv.includes("--check");
run("tools/news_openapi_export.mjs", []);
run("tools/news_schema_quality_gate.mjs", [
  "--open-openapi",
  openPath,
  "--app-openapi",
  appPath,
  "--backend-openapi",
  backendPath,
]);

if (!check) {
  run("sdks/sdkwork-news-sdk/bin/generate-sdk.mjs", ["--input", openPath]);
  run("sdks/sdkwork-news-app-sdk/bin/generate-sdk.mjs", ["--input", appPath]);
  run("sdks/sdkwork-news-backend-sdk/bin/generate-sdk.mjs", ["--input", backendPath]);
}

process.stdout.write(`[news_sdk_generate] ${check ? "check passed" : "generation completed"}\n`);

