#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, "..");
const outputDir = path.join(workspaceRoot, "generated", "openapi");
const OWNER = "sdkwork-news";
const DOMAIN = "news";

const schemas = {
  NewsApiResult: {
    type: "object",
    additionalProperties: false,
    required: ["code", "message", "requestId", "data"],
    properties: {
      code: { type: "string" },
      message: { type: "string" },
      requestId: { type: "string", format: "uuid" },
      data: {},
    },
  },
  NewsCategory: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "slug", "title", "priority", "enabled"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      slug: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      priority: { type: "integer" },
      enabled: { type: "boolean" },
    },
  },
  NewsItem: {
    type: "object",
    additionalProperties: false,
    required: ["id", "tenantId", "categoryId", "slug", "title", "summary", "status", "priority"],
    properties: {
      id: { type: "string" },
      tenantId: { type: "string" },
      categoryId: { type: "string" },
      slug: { type: "string" },
      title: { type: "string" },
      summary: { type: "string" },
      body: { type: "string" },
      status: { $ref: "#/components/schemas/NewsItemStatus" },
      authorName: { type: "string" },
      featured: { type: "boolean" },
      priority: { type: "integer" },
      estimatedReadMinutes: { type: "integer" },
      tags: { type: "array", items: { type: "string" } },
      publishedAt: { type: "string", format: "date-time" },
      scheduledFor: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  NewsItemStatus: {
    type: "string",
    enum: ["draft", "published", "scheduled", "archived"],
  },
  NewsOverview: {
    type: "object",
    additionalProperties: true,
  },
  NewsEditorialReadiness: {
    type: "object",
    additionalProperties: false,
    required: ["ready", "canPublish", "canSchedule", "canArchive", "canFeature", "issues"],
    properties: {
      ready: { type: "boolean" },
      canPublish: { type: "boolean" },
      canSchedule: { type: "boolean" },
      canArchive: { type: "boolean" },
      canFeature: { type: "boolean" },
      issues: { type: "array", items: { type: "string" } },
    },
  },
  NewsCategoryCommand: {
    type: "object",
    additionalProperties: false,
    properties: {
      slug: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      priority: { type: "integer" },
      enabled: { type: "boolean" },
    },
  },
  NewsItemCommand: {
    type: "object",
    additionalProperties: false,
    properties: {
      categoryId: { type: "string" },
      slug: { type: "string" },
      title: { type: "string" },
      summary: { type: "string" },
      body: { type: "string" },
      authorName: { type: "string" },
      priority: { type: "integer" },
      tags: { type: "array", items: { type: "string" } },
    },
  },
  NewsScheduleCommand: {
    type: "object",
    additionalProperties: false,
    required: ["scheduledFor"],
    properties: {
      scheduledFor: { type: "string", format: "date-time" },
    },
  },
  ProblemDetail: {
    type: "object",
    additionalProperties: true,
    required: ["type", "title", "status"],
    properties: {
      type: { type: "string", format: "uri-reference" },
      title: { type: "string" },
      status: { type: "integer", minimum: 100, maximum: 599 },
      detail: { type: "string" },
      requestId: { type: "string", format: "uuid" },
    },
  },
};

const appRoutes = [
  route("get", "/app/v3/api/news/categories", "categories.list", { schema: arrayOf("NewsCategory") }, false),
  route("get", "/app/v3/api/news/items", "items.list", { schema: arrayOf("NewsItem") }, false, listParams()),
  route("get", "/app/v3/api/news/items/{itemId}", "items.retrieve", { schema: ref("NewsItem") }, false, [pathParam("itemId")]),
  route("get", "/app/v3/api/news/items/by_slug/{slug}", "items.bySlug.retrieve", { schema: ref("NewsItem") }, false, [pathParam("slug")]),
  route("get", "/app/v3/api/news/overview", "overview.retrieve", { schema: ref("NewsOverview") }, false),
];

const openRoutes = [
  route("get", "/open/v3/api/news/items", "items.list", { schema: arrayOf("NewsItem") }, true, listParams()),
  route("get", "/open/v3/api/news/items/{itemId}", "items.retrieve", { schema: ref("NewsItem") }, true, [pathParam("itemId")]),
  route("get", "/open/v3/api/news/items/by_slug/{slug}", "items.bySlug.retrieve", { schema: ref("NewsItem") }, true, [pathParam("slug")]),
];

const backendRoutes = [
  route("get", "/backend/v3/api/news/categories", "categories.management.list", { schema: arrayOf("NewsCategory") }, false),
  route("post", "/backend/v3/api/news/categories", "categories.create", { schema: ref("NewsCategory") }, false, [], "NewsCategoryCommand"),
  route("patch", "/backend/v3/api/news/categories/{categoryId}", "categories.update", { schema: ref("NewsCategory") }, false, [pathParam("categoryId")], "NewsCategoryCommand"),
  route("delete", "/backend/v3/api/news/categories/{categoryId}", "categories.delete", { schema: ref("NewsApiResult") }, false, [pathParam("categoryId")]),
  route("get", "/backend/v3/api/news/items", "items.management.list", { schema: arrayOf("NewsItem") }, false, listParams()),
  route("post", "/backend/v3/api/news/items", "items.create", { schema: ref("NewsItem") }, false, [], "NewsItemCommand"),
  route("patch", "/backend/v3/api/news/items/{itemId}", "items.update", { schema: ref("NewsItem") }, false, [pathParam("itemId")], "NewsItemCommand"),
  route("delete", "/backend/v3/api/news/items/{itemId}", "items.delete", { schema: ref("NewsApiResult") }, false, [pathParam("itemId")]),
  route("post", "/backend/v3/api/news/items/{itemId}/publish", "items.publish", { schema: ref("NewsItem") }, false, [pathParam("itemId")]),
  route("post", "/backend/v3/api/news/items/{itemId}/schedule", "items.schedule", { schema: ref("NewsItem") }, false, [pathParam("itemId")], "NewsScheduleCommand"),
  route("post", "/backend/v3/api/news/items/{itemId}/archive", "items.archive", { schema: ref("NewsItem") }, false, [pathParam("itemId")]),
  route("post", "/backend/v3/api/news/items/{itemId}/feature", "items.feature", { schema: ref("NewsItem") }, false, [pathParam("itemId")]),
  route("get", "/backend/v3/api/news/items/{itemId}/editorial_readiness", "items.editorialReadiness.retrieve", { schema: ref("NewsEditorialReadiness") }, false, [pathParam("itemId")]),
];

function ref(name) {
  return { $ref: `#/components/schemas/${name}` };
}

function arrayOf(name) {
  return { type: "array", items: ref(name) };
}

function pathParam(name) {
  return {
    name,
    in: "path",
    required: true,
    schema: { type: "string" },
  };
}

function queryParam(name) {
  return {
    name,
    in: "query",
    required: false,
    schema: { type: "string" },
  };
}

function listParams() {
  return [queryParam("categoryId"), queryParam("q"), queryParam("status")];
}

function route(method, pathKey, operationId, response, isPublic, parameters = [], bodySchemaName = null) {
  return {
    method,
    path: pathKey,
    operation: {
      tags: ["news"],
      summary: `News ${operationId}`,
      operationId,
      parameters,
      ...(bodySchemaName ? {
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: ref(bodySchemaName),
            },
          },
        },
      } : {}),
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": response,
          },
        },
        400: problemResponse(),
        401: problemResponse(),
      },
      security: isPublic ? [] : [{ AuthToken: [], AccessToken: [] }],
      "x-sdkwork-owner": OWNER,
      "x-sdkwork-api-authority": "",
      "x-sdkwork-domain": DOMAIN,
      "x-sdkwork-resource": operationId.split(".")[0],
      "x-sdkwork-public": isPublic,
    },
  };
}

function problemResponse() {
  return {
    description: "Problem detail",
    content: {
      "application/problem+json": {
        schema: ref("ProblemDetail"),
      },
    },
  };
}

function documentFor({ authority, routes, serverUrl, title }) {
  const paths = {};
  for (const item of routes) {
    paths[item.path] ??= {};
    item.operation["x-sdkwork-api-authority"] = authority;
    paths[item.path][item.method] = item.operation;
  }
  return {
    openapi: "3.1.2",
    info: {
      title,
      version: "1.0.0",
      "x-sdkwork-owner": OWNER,
      "x-sdkwork-api-authority": authority,
    },
    servers: [{ url: serverUrl }],
    tags: [{ name: "news", description: "News API resources.", "x-sdk-nested-resource-surface": true }],
    paths,
    components: {
      securitySchemes: {
        AuthToken: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        AccessToken: {
          type: "apiKey",
          in: "header",
          name: "Access-Token",
        },
        ApiKey: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
        },
      },
      schemas,
    },
    "x-sdkwork-owner": OWNER,
    "x-sdkwork-api-authority": authority,
    "x-sdkwork-domain": DOMAIN,
    "x-sdkwork-standard-profile": "sdkwork-v3",
  };
}

function parseArgs(argv) {
  return {
    check: argv.includes("--check"),
  };
}

const args = parseArgs(process.argv.slice(2));
const docs = [
  ["news-open-api.openapi.json", documentFor({ authority: "sdkwork-news.open", routes: openRoutes, serverUrl: "http://127.0.0.1:18082", title: "SDKWork News Open API" })],
  ["news-app-api.openapi.json", documentFor({ authority: "sdkwork-news.app", routes: appRoutes, serverUrl: "http://127.0.0.1:18080", title: "SDKWork News App API" })],
  ["news-backend-api.openapi.json", documentFor({ authority: "sdkwork-news.backend", routes: backendRoutes, serverUrl: "http://127.0.0.1:18080", title: "SDKWork News Backend API" })],
];

if (!args.check) {
  mkdirSync(outputDir, { recursive: true });
  for (const [fileName, document] of docs) {
    writeFileSync(path.join(outputDir, fileName), `${JSON.stringify(document, null, 2)}\n`, "utf8");
  }
}

process.stdout.write(`[news_openapi_export] ok app=${appRoutes.length} backend=${backendRoutes.length} open=${openRoutes.length}\n`);
