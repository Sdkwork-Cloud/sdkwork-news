# SDKWork News Industry Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `sdkwork-news` from a basic publishing module into an industry-grade news platform foundation with schema, Rust storage, OpenAPI contracts, and generated SDK support for channels, topics, media, feeds, events, engagement, moderation, trending, search, and experiments.

**Architecture:** Keep the existing workspace shape. Add migration `0002_news_industry_foundation.sql`, extend Rust storage manifests and selected repository methods, expand TypeScript contracts and route catalogs, expand OpenAPI exporter as the source of SDK generation, then regenerate SDKs.

**Tech Stack:** Rust SQLx SQLite, TypeScript contracts, OpenAPI 3.1.2, SDKWork SDK generator wrappers, Vitest, Node test runner, Cargo tests.

---

### Task 1: Lock Expanded Contract Expectations

**Files:**
- Modify: `packages/common/news/sdkwork-news-contracts/tests/news-contracts.standard.test.ts`
- Modify: `crates/sdkwork-news-core-rust/tests/news_core_standard.rs`
- Modify: `crates/sdkwork-news-http-rust/tests/news_http_standard.rs`
- Modify: `sdks/test/news-openapi-boundary.test.mjs`
- Modify: `sdks/test/news-schema-quality-gate.test.mjs`

- [x] **Step 1: Write failing tests**

Add expected route operation lists for expanded open/app/backend APIs, route counts, core operations, and HTTP route counts.

- [x] **Step 2: Run tests to verify RED**

Run:

```powershell
pnpm test:vitest
cargo test --workspace
node --test sdks/test/*.test.mjs
```

Expected: tests fail because route catalogs, OpenAPI counts, and manifests are still old.

### Task 2: Add Database Migration And Storage Manifest

**Files:**
- Create: `crates/sdkwork-news-storage-sqlx-rust/migrations/0002_news_industry_foundation.sql`
- Modify: `crates/sdkwork-news-storage-sqlx-rust/src/lib.rs`
- Modify: `crates/sdkwork-news-storage-sqlx-rust/tests/news_storage_standard.rs`

- [x] **Step 1: Write failing storage tests**

Assert v2 schema, new migration name, new table/index lists, repository bindings, and a simple end-to-end channel/event/engagement flow.

- [x] **Step 2: Run storage tests to verify RED**

Run:

```powershell
cargo test -p sdkwork-news-storage-sqlx --test news_storage_standard
```

Expected: missing migration/table/method failures.

- [x] **Step 3: Implement migration and manifest**

Create the new tables and indexes. Update `migrate()`, table/index/migration lists, migration plan, and repository bindings.

- [x] **Step 4: Implement minimal storage methods**

Add data structs and methods for channel creation, item-channel attachment, channel feed listing, recommendation event recording, user feedback, favorite, reaction, and trending metric upsert.

- [x] **Step 5: Run storage tests to verify GREEN**

Run the same cargo storage test. Expected: pass.

### Task 3: Expand Contracts And Rust Route Catalogs

**Files:**
- Modify: `packages/common/news/sdkwork-news-contracts/src/index.ts`
- Modify: `crates/sdkwork-news-core-rust/src/lib.rs`
- Modify: `crates/sdkwork-news-http-rust/src/lib.rs`

- [x] **Step 1: Implement contract types and route catalogs**

Add types for channels, topics, media, feed items, events, feedback, reactions, favorites, comments, reports, follows, trending metrics, search, moderation, and experiments. Extend route arrays.

- [x] **Step 2: Update Rust core/HTTP catalogs**

Add route sets for open/app/backend and operation IDs aligned with TypeScript and OpenAPI.

- [x] **Step 3: Run contract/core/http tests**

Run:

```powershell
pnpm test:vitest
cargo test -p sdkwork-news-core-rust -p sdkwork-news-http-rust
```

Expected: pass.

### Task 4: Expand OpenAPI Source And Quality Gate

**Files:**
- Modify: `tools/news_openapi_export.mjs`
- Modify: `tools/news_schema_quality_gate.mjs`
- Modify: `sdks/test/news-openapi-boundary.test.mjs`
- Modify: `sdks/test/news-schema-quality-gate.test.mjs`

- [x] **Step 1: Add OpenAPI schemas**

Add `MediaResource`, `NewsPage`, `NewsChannel`, `NewsTopic`, `NewsFeedItem`, `NewsRecommendationEventCommand`, `NewsUserFeedbackCommand`, `NewsReactionCommand`, `NewsFavorite`, `NewsComment`, `NewsReportCommand`, `NewsTrendingMetric`, `NewsSearchResult`, `NewsModerationCase`, and experiment schemas.

- [x] **Step 2: Add route definitions**

Add open/app/backend route definitions with SDKWork owner/authority/security metadata.

- [x] **Step 3: Update quality gate route counts**

Adjust expected counts and ensure prefix/security/owner validation still applies.

- [x] **Step 4: Run OpenAPI tests**

Run:

```powershell
node tools/news_sdk_generate.mjs --check
node --test sdks/test/*.test.mjs
```

Expected: pass after exporter and gate match.

### Task 5: Regenerate SDKs And Verify Generated Families

**Files:**
- Generated under: `generated/openapi`
- Generated under: `sdks/sdkwork-news-sdk`
- Generated under: `sdks/sdkwork-news-app-sdk`
- Generated under: `sdks/sdkwork-news-backend-sdk`

- [x] **Step 1: Regenerate SDKs**

Run:

```powershell
node tools/news_sdk_generate.mjs
```

- [x] **Step 2: Run SDK tests**

Run:

```powershell
node --test sdks/test/*.test.mjs sdks/sdkwork-news-sdk/tests/*.test.mjs sdks/sdkwork-news-app-sdk/tests/*.test.mjs sdks/sdkwork-news-backend-sdk/tests/*.test.mjs
```

Expected: pass.

- [x] **Step 3: Run generated package checks if available**

Run generator package `publish-core.mjs --action check` and `--action build` for each generated TypeScript package. Remove npm side-effect `package-lock.json` files if created.

### Task 6: Full Verification And Git Delivery

**Files:**
- Review all changed files.

- [x] **Step 1: Run full verification**

Run:

```powershell
node tools/news_sdk_generate.mjs --check
node --test sdks/test/*.test.mjs sdks/sdkwork-news-sdk/tests/*.test.mjs sdks/sdkwork-news-app-sdk/tests/*.test.mjs sdks/sdkwork-news-backend-sdk/tests/*.test.mjs
pnpm test:vitest
pnpm typecheck
cargo test --workspace
```

- [x] **Step 2: Inspect git diff**

Run:

```powershell
git status --short
git diff --stat
```

- [x] **Step 3: Commit and push**

Run:

```powershell
git add .
git commit -m "feat: upgrade news industry platform foundation"
git push
```
