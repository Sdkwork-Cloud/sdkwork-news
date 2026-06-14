import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import test from "node:test";

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
  });
}

test("professional registry materialization is generated from TypeScript source contracts", () => {
  const result = runNode(["tools/news_professional_registry_export.mjs", "--check"]);
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const apiRegistry = JSON.parse(readFileSync("apis/_registry/news-professional-api.operations.json", "utf8"));
  assert.equal(apiRegistry.kind, "sdkwork.api.operation.registry");
  assert.equal(apiRegistry.operationCount.professionalBlueprint, apiRegistry.operations.length);
  assert.equal(apiRegistry.operations.length, 198);
  assert.equal(apiRegistry.operations.filter((operation) => operation.surface === "open-api").length, 30);
  assert.equal(apiRegistry.operations.filter((operation) => operation.surface === "app-api").length, 48);
  assert.equal(apiRegistry.operations.filter((operation) => operation.surface === "backend-api").length, 120);
  assert.ok(apiRegistry.operations.every((operation) => operation.todo.startsWith("TODO")));

  const schemaRegistry = JSON.parse(readFileSync("crates/sdkwork-content-news-repository-sqlx/schema/news-professional-schema.registry.json", "utf8"));
  assert.equal(schemaRegistry.kind, "sdkwork.database.schema.registry");
  assert.equal(schemaRegistry.tableCount.total, schemaRegistry.tables.length);
  assert.equal(schemaRegistry.tableCount.total, 86);
  assert.ok(schemaRegistry.tables.every((table) => table.columns.length > 0));
  assert.ok(schemaRegistry.tables.every((table) => table.indexes.length > 0));
  assert.ok(schemaRegistry.tables.every((table) => table.todo.startsWith("TODO")));
});
