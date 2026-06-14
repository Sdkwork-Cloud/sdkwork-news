import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const app = JSON.parse(readFileSync("apis/app-api/content/news-app-api.openapi.json", "utf8"));
const backend = JSON.parse(readFileSync("apis/backend-api/content/news-backend-api.openapi.json", "utf8"));
const open = JSON.parse(readFileSync("apis/open-api/content/news-open-api.openapi.json", "utf8"));

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
  assert.equal(operations(open).length, 19);
  assert.equal(operations(app).length, 40);
  assert.equal(operations(backend).length, 93);
  assert.ok(open.paths["/open/v3/api/news/channels/{channelId}/feed"]?.get, "open channel feed");
  assert.ok(open.paths["/open/v3/api/news/search/suggestions"]?.get, "open search suggestions");
  assert.ok(app.paths["/app/v3/api/news/events"]?.post, "app event ingestion");
  assert.ok(app.paths["/app/v3/api/news/interests"]?.put, "app interest upsert");
  assert.ok(app.paths["/app/v3/api/news/notification/subscriptions"]?.put, "app subscription upsert");
  assert.ok(app.paths["/app/v3/api/news/alerts/breaking"]?.get, "app breaking alerts");
  assert.ok(app.paths["/app/v3/api/news/digests"]?.get, "app digests");
  assert.ok(app.paths["/app/v3/api/news/items/{itemId}/comments"]?.post, "app comments");
  assert.ok(open.paths["/open/v3/api/news/alerts/breaking"]?.get, "open breaking alerts");
  assert.ok(open.paths["/open/v3/api/news/digests"]?.get, "open digests");
  assert.ok(open.paths["/open/v3/api/news/items/{itemId}/trust"]?.get, "open item trust");
  assert.ok(open.paths["/open/v3/api/news/fact_checks"]?.get, "open fact checks");
  assert.ok(open.paths["/open/v3/api/news/corrections"]?.get, "open corrections");
  assert.ok(open.paths["/open/v3/api/news/live/events"]?.get, "open live events");
  assert.ok(open.paths["/open/v3/api/news/live/events/{eventId}"]?.get, "open live event retrieve");
  assert.ok(open.paths["/open/v3/api/news/live/events/{eventId}/updates"]?.get, "open live updates");
  assert.ok(app.paths["/app/v3/api/news/items/{itemId}/trust"]?.get, "app item trust");
  assert.ok(app.paths["/app/v3/api/news/fact_checks"]?.get, "app fact checks");
  assert.ok(app.paths["/app/v3/api/news/corrections"]?.get, "app corrections");
  assert.ok(app.paths["/app/v3/api/news/live/events"]?.get, "app live events");
  assert.ok(app.paths["/app/v3/api/news/live/events/{eventId}"]?.get, "app live event retrieve");
  assert.ok(app.paths["/app/v3/api/news/live/events/{eventId}/updates"]?.get, "app live updates");
  assert.ok(backend.paths["/backend/v3/api/news/moderation/cases/{caseId}"]?.patch, "backend moderation");
  assert.ok(backend.paths["/backend/v3/api/news/feed/candidates"]?.put, "backend feed candidates");
  assert.ok(backend.paths["/backend/v3/api/news/items/{itemId}/metrics"]?.get, "backend item metrics");
  assert.ok(backend.paths["/backend/v3/api/news/alerts/breaking/{alertId}/publish"]?.post, "backend alert publish");
  assert.ok(backend.paths["/backend/v3/api/news/digests/{digestId}/items"]?.post, "backend digest item attach");
  assert.ok(backend.paths["/backend/v3/api/news/trust/sources"]?.put, "backend source trust upsert");
  assert.ok(backend.paths["/backend/v3/api/news/trust/items/{itemId}"]?.put, "backend item trust upsert");
  assert.ok(backend.paths["/backend/v3/api/news/fact_checks/{factCheckId}/publish"]?.post, "backend fact check publish");
  assert.ok(backend.paths["/backend/v3/api/news/corrections/{correctionId}/publish"]?.post, "backend correction publish");
  assert.ok(backend.paths["/backend/v3/api/news/live/events/{eventId}/publish"]?.post, "backend live event publish");
  assert.ok(backend.paths["/backend/v3/api/news/live/events/{eventId}/updates"]?.post, "backend live update create");
  assert.ok(backend.paths["/backend/v3/api/news/live/events/{eventId}/items"]?.post, "backend live item attach");
  assert.ok(backend.paths["/backend/v3/api/news/experiments/{experimentId}/archive"]?.post, "backend experiments");
});
