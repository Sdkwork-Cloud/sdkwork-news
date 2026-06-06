import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const app = JSON.parse(readFileSync("generated/openapi/news-app-api.openapi.json", "utf8"));
const backend = JSON.parse(readFileSync("generated/openapi/news-backend-api.openapi.json", "utf8"));
const open = JSON.parse(readFileSync("generated/openapi/news-open-api.openapi.json", "utf8"));

function operations(document) {
  return Object.entries(document.paths ?? {}).flatMap(([path, pathItem]) =>
    Object.entries(pathItem ?? {})
      .filter(([method]) => ["get", "post", "put", "patch", "delete"].includes(method))
      .map(([method, operation]) => ({ method, operation, path })),
  );
}

test("news OpenAPI documents are owner-only sdkwork-v3 compatible inputs", () => {
  for (const [surface, document, prefix, authority] of [
    ["app", app, "/app/v3/api", "sdkwork-news.app"],
    ["backend", backend, "/backend/v3/api", "sdkwork-news.backend"],
    ["open", open, "/open/v3/api", "sdkwork-news.open"],
  ]) {
    assert.equal(document.openapi, "3.1.2", surface);
    assert.equal(document["x-sdkwork-owner"], "sdkwork-news", surface);
    assert.equal(document["x-sdkwork-api-authority"], authority, surface);
    if (surface === "app" || surface === "backend") {
      assert.deepEqual(document.components.securitySchemes.AuthToken, {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      });
      assert.deepEqual(document.components.securitySchemes.AccessToken, {
        type: "apiKey",
        in: "header",
        name: "Access-Token",
      });
    }
    for (const { path, operation } of operations(document)) {
      assert.ok(path.startsWith(prefix), `${surface} path prefix ${path}`);
      assert.equal(operation["x-sdkwork-owner"], "sdkwork-news", `${surface} owner ${path}`);
      assert.equal(operation["x-sdkwork-api-authority"], authority, `${surface} authority ${path}`);
      assert.equal(operation["x-sdkwork-domain"], "news", `${surface} domain ${path}`);
      assert.deepEqual(operation.tags, ["news"], `${surface} tag ${path}`);
      assert.match(operation.operationId, /^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/u);
      if (surface === "app" || surface === "backend") {
        assert.deepEqual(operation.security, [{ AuthToken: [], AccessToken: [] }], `${surface} security ${path}`);
      }
      if (surface === "open") {
        assert.deepEqual(operation.security, [], `${surface} public security ${path}`);
      }
    }
  }
  assert.equal(operations(open).length, 10);
  assert.equal(operations(app).length, 26);
  assert.equal(operations(backend).length, 48);
  assert.ok(open.paths["/open/v3/api/news/channels/{channelId}/feed"]?.get, "open channel feed");
  assert.ok(app.paths["/app/v3/api/news/events"]?.post, "app event ingestion");
  assert.ok(app.paths["/app/v3/api/news/items/{itemId}/comments"]?.post, "app comments");
  assert.ok(backend.paths["/backend/v3/api/news/moderation/cases/{caseId}"]?.patch, "backend moderation");
  assert.ok(backend.paths["/backend/v3/api/news/experiments/{experimentId}/archive"]?.post, "backend experiments");
});
