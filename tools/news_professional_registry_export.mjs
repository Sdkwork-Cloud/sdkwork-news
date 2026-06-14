#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  NEWS_NEWSROOM_INTEGRATION_CAPABILITIES,
  NEWS_PROFESSIONAL_API_OPERATIONS,
  NEWS_PROFESSIONAL_MODULES,
  NEWS_PROFESSIONAL_TABLES,
} from "../packages/common/news/sdkwork-news-contracts/src/index.ts";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");

const API_REGISTRY_PATH = path.join(workspaceRoot, "apis", "_registry", "news-professional-api.operations.json");
const SCHEMA_REGISTRY_PATH = path.join(
  workspaceRoot,
  "crates",
  "sdkwork-content-news-repository-sqlx",
  "schema",
  "news-professional-schema.registry.json",
);

function parseArgs(argv) {
  return {
    check: argv.includes("--check"),
  };
}

function countOperations(surface) {
  return NEWS_PROFESSIONAL_API_OPERATIONS.filter((operation) => operation.surface === surface).length;
}

function selectRequiredOperation(operationId, surface) {
  const operation = NEWS_PROFESSIONAL_API_OPERATIONS.find(
    (item) => item.operationId === operationId && item.surface === surface,
  );
  if (!operation) {
    throw new Error(`Missing professional operation ${surface}:${operationId}`);
  }
  return operation;
}

function apiRegistry() {
  const requiredOperationKeys = [
    ["stories.list", "open-api"],
    ["stories.retrieve", "open-api"],
    ["items.schemaOrg.retrieve", "open-api"],
    ["feed.following.list", "app-api"],
    ["feed.latest.list", "app-api"],
    ["items.shareEvents.create", "app-api"],
    ["stories.create", "backend-api"],
    ["imports.ninjs.create", "backend-api"],
    ["imports.newsmlG2.create", "backend-api"],
    ["exports.schemaOrg.create", "backend-api"],
    ["items.c2paProvenance.upsert", "backend-api"],
  ];

  return {
    schemaVersion: 1,
    kind: "sdkwork.api.operation.registry",
    domain: "content",
    capability: "news",
    owner: "sdkwork-news",
    status: "design",
    sourceModules: [
      "packages/common/news/sdkwork-news-contracts/src/professional-api.ts",
      "crates/sdkwork-router-news-open-api",
      "crates/sdkwork-router-news-app-api",
      "crates/sdkwork-router-news-backend-api",
    ],
    operationCount: {
      currentRuntimeRoutes: 152,
      professionalBlueprint: NEWS_PROFESSIONAL_API_OPERATIONS.length,
      bySurface: {
        "open-api": countOperations("open-api"),
        "app-api": countOperations("app-api"),
        "backend-api": countOperations("backend-api"),
      },
      todo: "TODO(news-api): keep runtime route materialization explicitly separate from the professional blueprint until OpenAPI generation is scheduled.",
    },
    surfacePolicy: {
      "open-api": {
        prefix: "/open/v3/api",
        authMode: "anonymous",
        todo: "TODO(news-api): evaluate domain-specific open prefix such as /news/v3/api before public release.",
      },
      "app-api": {
        prefix: "/app/v3/api",
        authMode: "dual-token",
        todo: "TODO(news-api): materialize app reader operations with dual-token tenant/user context.",
      },
      "backend-api": {
        prefix: "/backend/v3/api",
        authMode: "dual-token",
        todo: "TODO(news-api): materialize newsroom operator operations with backend-admin permissions and audit events.",
      },
    },
    operations: NEWS_PROFESSIONAL_API_OPERATIONS,
    requiredProfessionalOperations: requiredOperationKeys.map(([operationId, surface]) =>
      selectRequiredOperation(operationId, surface),
    ),
    integrationCapabilities: NEWS_NEWSROOM_INTEGRATION_CAPABILITIES.map((capability) => ({
      key: capability.key,
      ownerBoundary: capability.ownerBoundary,
      requiredSdkFamily: capability.requiredSdkFamily ?? null,
      todo: capability.todo,
    })),
    moduleBlueprints: NEWS_PROFESSIONAL_MODULES.map((module) => ({
      layer: module.layer,
      filePath: module.filePath,
      className: module.className,
      methodCount: module.methods.length,
      todo: module.todo,
    })),
    todo: "TODO(news-api): convert this registry into authored OpenAPI 3.1.2 paths, route manifests, SDK generation inputs, examples, and contract tests.",
  };
}

function tableRecord(table) {
  return {
    name: table.name,
    status: table.status,
    family: table.family,
    profile: table.profile,
    complianceLevel: table.complianceLevel,
    lifecycle: table.lifecycle,
    source: table.source,
    systemOfRecord: table.systemOfRecord,
    writeOwner: table.writeOwner,
    readConsumers: table.readConsumers,
    columns: table.columns,
    indexes: table.indexes,
    todo: table.todo,
  };
}

function schemaRegistry() {
  const tables = NEWS_PROFESSIONAL_TABLES.map(tableRecord);
  const implementedTables = tables.filter((table) => table.status === "implemented");
  const plannedTables = tables.filter((table) => table.status === "planned");

  return {
    schemaVersion: 1,
    kind: "sdkwork.database.schema.registry",
    domain: "content",
    capability: "news",
    owner: "sdkwork-news",
    schemaVersionName: "news.storage.professional.v1",
    status: "design",
    sourceOfTruth: {
      implementedMigrations: [
        "migrations/0001_news_foundation.sql",
        "migrations/0002_news_industry_foundation.sql",
        "migrations/0003_news_personalization_foundation.sql",
        "migrations/0004_news_alert_digest_foundation.sql",
        "migrations/0005_news_trust_correction_foundation.sql",
        "migrations/0006_news_live_coverage_foundation.sql",
      ],
      plannedMigration: "migrations/0007_news_professional_newsroom_foundation.sql",
      commonContract: "packages/common/news/sdkwork-news-contracts/src/professional-schema.ts",
    },
    tableCount: {
      implemented: implementedTables.length,
      planned: plannedTables.length,
      total: tables.length,
    },
    commonContract: {
      tenantScope: "tenant_id required on tenant-owned tables",
      idStrategy: "text ids today; migrate to SDKWork canonical id/uuid contract when platform id service is selected",
      timeSerialization: "iso8601_utc_text",
      int64Serialization: "string at API boundary",
      lifecycle: "core entities use status/version/soft delete; event and audit tables are append-only",
      todo: "TODO(news-db): add schema linter coverage for tenant_id, version, status, audit, indexes, and Drive-backed MediaResource references.",
    },
    tables,
    implementedTables: implementedTables.map((table) => table.name),
    plannedTables,
    todo: "TODO(news-db): convert planned table records into reviewed migrations only after human migration approval.",
  };
}

function toJson(document) {
  return `${JSON.stringify(document, null, 2)}\n`;
}

function writeOrCheck(filePath, document, check) {
  const expected = toJson(document);
  if (check) {
    const actual = existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
    if (actual !== expected) {
      return filePath;
    }
    return null;
  }

  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, expected, "utf8");
  return null;
}

const args = parseArgs(process.argv.slice(2));
const staleFiles = [
  writeOrCheck(API_REGISTRY_PATH, apiRegistry(), args.check),
  writeOrCheck(SCHEMA_REGISTRY_PATH, schemaRegistry(), args.check),
].filter(Boolean);

if (staleFiles.length > 0) {
  process.stderr.write(`[news_professional_registry_export] stale files:\n${staleFiles.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write(
  `[news_professional_registry_export] ok operations=${NEWS_PROFESSIONAL_API_OPERATIONS.length} tables=${NEWS_PROFESSIONAL_TABLES.length}\n`,
);
