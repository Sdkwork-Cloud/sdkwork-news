import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const root = process.cwd();

function exists(relativePath) {
  return existsSync(join(root, relativePath));
}

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function assertStandardApiPath(source, manifestPath) {
  assert.match(source, /apis/u, `${manifestPath} must reference the apis root`);
  assert.match(source, /content/u, `${manifestPath} must reference the API content directory`);
  assert.match(source, /news-(open|app|backend)-api\.openapi\.json/u, `${manifestPath} must reference a news OpenAPI input`);
  assert.doesNotMatch(source, /generated[\\/]openapi/u, `${manifestPath} must not reference generated/openapi`);
}

describe("sdkwork-news workspace structure standard", () => {
  it("uses the complete SDKWork project-root directory dictionary", () => {
    for (const directory of [
      "apis",
      "apps",
      "crates",
      "sdks",
      "jobs",
      "tools",
      "plugins",
      "examples",
      "configs",
      "deployments",
      "scripts",
      "docs",
      "tests",
    ]) {
      assert.ok(exists(`${directory}/README.md`), `${directory}/README.md must exist`);
    }
  });

  it("keeps authored OpenAPI inputs under apis instead of generated", () => {
    for (const apiPath of [
      "apis/open-api/content/news-open-api.openapi.json",
      "apis/app-api/content/news-app-api.openapi.json",
      "apis/backend-api/content/news-backend-api.openapi.json",
    ]) {
      assert.ok(exists(apiPath), `${apiPath} must exist`);
    }

    assert.equal(exists("generated/openapi"), false, "generated/openapi must not remain as a root API input directory");
  });

  it("uses responsibility-specific Rust crate names", () => {
    for (const cratePath of [
      "crates/sdkwork-content-news-service/Cargo.toml",
      "crates/sdkwork-content-news-repository-sqlx/Cargo.toml",
      "crates/sdkwork-router-news-open-api/Cargo.toml",
      "crates/sdkwork-router-news-app-api/Cargo.toml",
      "crates/sdkwork-router-news-backend-api/Cargo.toml",
    ]) {
      assert.ok(exists(cratePath), `${cratePath} must exist`);
    }

    const crateNames = readdirSync(join(root, "crates"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    assert.deepEqual(
      crateNames.filter((name) => /-(core|http)-rust$|-storage-sqlx-rust$/.test(name)),
      [],
      "legacy Rust crate names must be removed",
    );
  });

  it("records standard OpenAPI input paths in SDK manifests and tools", () => {
    for (const manifestPath of [
      "sdks/sdkwork-news-sdk/sdk-manifest.json",
      "sdks/sdkwork-news-app-sdk/sdk-manifest.json",
      "sdks/sdkwork-news-backend-sdk/sdk-manifest.json",
      "sdks/sdkwork-news-sdk/.sdkwork-assembly.json",
      "sdks/sdkwork-news-app-sdk/.sdkwork-assembly.json",
      "sdks/sdkwork-news-backend-sdk/.sdkwork-assembly.json",
      "tools/news_sdk_generate.mjs",
      "tools/news_openapi_export.mjs",
    ]) {
      const source = read(manifestPath);
      assertStandardApiPath(source, manifestPath);
    }
  });
});
