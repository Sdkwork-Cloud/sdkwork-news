> Migrated from `docs/superpowers/plans/2026-06-13-news-professional-implementation.md` on 2026-06-24.
> Owner: SDKWork maintainers

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all TODO items for the SDKWork News Professional newsroom system according to SDKWork specifications and engineering standards.

**Architecture:** The system follows SDKWork standards with a layered architecture: database schema, repository layer, service layer, API handlers, and SDK ports. Implementation will proceed in phases: database first, then repositories, services, API handlers, and finally SDK integration.

**Tech Stack:** Rust (SQLx, async), TypeScript (SDK ports), OpenAPI 3.1.2, JSON Schema, PostgreSQL (via SQLx), JSON registry files.

---

## Phase 1: Database Schema and Migration

### Task 1: Create Professional Newsroom Migration

**Files:**
- Create: `crates/sdkwork-content-news-repository-sqlx/migrations/0007_news_professional_newsroom_foundation.sql`
- Modify: `crates/sdkwork-content-news-repository-sqlx/src/professional_schema.rs`

- [ ] **Step 1: Read current schema registry**

```bash
cat crates/sdkwork-content-news-repository-sqlx/schema/news-professional-schema.registry.json
```

- [ ] **Step 2: Create migration SQL file**

Create `crates/sdkwork-content-news-repository-sqlx/migrations/0007_news_professional_newsroom_foundation.sql` with all planned tables from the schema registry.

- [ ] **Step 3: Update Rust schema registry**

Modify `crates/sdkwork-content-news-repository-sqlx/src/professional_schema.rs` to mark tables as `Implemented` after migration.

- [ ] **Step 4: Run migration verification**

```bash
cargo test -p sdkwork-content-news-repository-sqlx --test news_professional_schema_registry
```

- [ ] **Step 5: Commit database changes**

```bash
git add crates/sdkwork-content-news-repository-sqlx/migrations/0007_news_professional_newsroom_foundation.sql crates/sdkwork-content-news-repository-sqlx/src/professional_schema.rs
git commit -m "feat(news-db): create professional newsroom foundation migration"
```

### Task 2: Implement Repository Methods

**Files:**
- Create: `crates/sdkwork-content-news-repository-sqlx/src/repository/professional_repository.rs`
- Create: `crates/sdkwork-content-news-repository-sqlx/src/repository/external_feed_repository.rs`
- Create: `crates/sdkwork-content-news-repository-sqlx/src/repository/newsletter_repository.rs`
- Create: `crates/sdkwork-content-news-repository-sqlx/src/repository/paywall_repository.rs`
- Modify: `crates/sdkwork-content-news-repository-sqlx/src/lib.rs`

- [ ] **Step 1: Implement professional repository**

Create `crates/sdkwork-content-news-repository-sqlx/src/repository/professional_repository.rs` with CRUD operations for all professional tables.

- [ ] **Step 2: Implement external feed repository**

Create `crates/sdkwork-content-news-repository-sqlx/src/repository/external_feed_repository.rs` for external feed ingestion.

- [ ] **Step 3: Implement newsletter repository**

Create `crates/sdkwork-content-news-repository-sqlx/src/repository/newsletter_repository.rs` for newsletter operations.

- [ ] **Step 4: Implement paywall repository**

Create `crates/sdkwork-content-news-repository-sqlx/src/repository/paywall_repository.rs` for paywall policy operations.

- [ ] **Step 5: Update lib.rs with module declarations**

Update `crates/sdkwork-content-news-repository-sqlx/src/lib.rs` to include new repository modules.

- [ ] **Step 6: Run repository tests**

```bash
cargo test -p sdkwork-content-news-repository-sqlx
```

- [ ] **Step 7: Commit repository implementations**

```bash
git add crates/sdkwork-content-news-repository-sqlx/src/repository/
git commit -m "feat(news-repository): implement professional newsroom repositories"
```

## Phase 2: Service Layer Implementation

### Task 3: Implement Story Packaging Service

**Files:**
- Create: `crates/sdkwork-content-news-service/src/service/story_service.rs`
- Modify: `crates/sdkwork-content-news-service/src/professional.rs`
- Create: `crates/sdkwork-content-news-service/src/domain/story.rs`

- [ ] **Step 1: Define story domain models**

Create `crates/sdkwork-content-news-service/src/domain/story.rs` with story aggregate, commands, and results.

- [ ] **Step 2: Implement story service**

Create `crates/sdkwork-content-news-service/src/service/story_service.rs` with story packaging use cases.

- [ ] **Step 3: Update professional.rs with story service**

Update `crates/sdkwork-content-news-service/src/professional.rs` to wire story service.

- [ ] **Step 4: Write story service tests**

Create tests in `crates/sdkwork-content-news-service/tests/story_service_test.rs`.

- [ ] **Step 5: Run story service tests**

```bash
cargo test -p sdkwork-content-news-service --test story_service_test
```

- [ ] **Step 6: Commit story service**

```bash
git add crates/sdkwork-content-news-service/src/service/story_service.rs crates/sdkwork-content-news-service/src/domain/story.rs crates/sdkwork-content-news-service/src/professional.rs
git commit -m "feat(news-service): implement story packaging use cases"
```

### Task 4: Implement Editorial Workflow Service

**Files:**
- Create: `crates/sdkwork-content-news-service/src/service/editorial_workflow_service.rs`
- Create: `crates/sdkwork-content-news-service/src/domain/editorial.rs`

- [ ] **Step 1: Define editorial domain models**

Create `crates/sdkwork-content-news-service/src/domain/editorial.rs` with assignment and review task aggregates.

- [ ] **Step 2: Implement editorial workflow service**

Create `crates/sdkwork-content-news-service/src/service/editorial_workflow_service.rs` with editorial assignment/review workflows.

- [ ] **Step 3: Write editorial workflow tests**

Create tests in `crates/sdkwork-content-news-service/tests/editorial_workflow_test.rs`.

- [ ] **Step 4: Run editorial workflow tests**

```bash
cargo test -p sdkwork-content-news-service --test editorial_workflow_test
```

- [ ] **Step 5: Commit editorial workflow**

```bash
git add crates/sdkwork-content-news-service/src/service/editorial_workflow_service.rs crates/sdkwork-content-news-service/src/domain/editorial.rs
git commit -m "feat(news-service): implement editorial assignment/review workflows"
```

### Task 5: Implement Import/Export Service

**Files:**
- Create: `crates/sdkwork-content-news-service/src/service/import_export_service.rs`
- Create: `crates/sdkwork-content-news-service/src/domain/import_export.rs`

- [ ] **Step 1: Define import/export domain models**

Create `crates/sdkwork-content-news-service/src/domain/import_export.rs` with ninjs and NewsML-G2 import/export aggregates.

- [ ] **Step 2: Implement import/export service**

Create `crates/sdkwork-content-news-service/src/service/import_export_service.rs` with import/export adapters with idempotency and payload hashes.

- [ ] **Step 3: Write import/export tests**

Create tests in `crates/sdkwork-content-news-service/tests/import_export_test.rs`.

- [ ] **Step 4: Run import/export tests**

```bash
cargo test -p sdkwork-content-news-service --test import_export_test
```

- [ ] **Step 5: Commit import/export service**

```bash
git add crates/sdkwork-content-news-service/src/service/import_export_service.rs crates/sdkwork-content-news-service/src/domain/import_export.rs
git commit -m "feat(news-service): implement import/export adapters with idempotency"
```

### Task 6: Implement Trust and Media Services

**Files:**
- Create: `crates/sdkwork-content-news-service/src/service/trust_service.rs`
- Create: `crates/sdkwork-content-news-service/src/service/media_attachment_service.rs`
- Create: `crates/sdkwork-content-news-service/src/domain/trust.rs`
- Create: `crates/sdkwork-content-news-service/src/domain/media.rs`

- [ ] **Step 1: Define trust domain models**

Create `crates/sdkwork-content-news-service/src/domain/trust.rs` with C2PA provenance and rights aggregates.

- [ ] **Step 2: Define media domain models**

Create `crates/sdkwork-content-news-service/src/domain/media.rs` with Drive-backed media resource aggregates.

- [ ] **Step 3: Implement trust service**

Create `crates/sdkwork-content-news-service/src/service/trust_service.rs` with C2PA trust workflows.

- [ ] **Step 4: Implement media attachment service**

Create `crates/sdkwork-content-news-service/src/service/media_attachment_service.rs` with Drive media integration.

- [ ] **Step 5: Write trust and media tests**

Create tests in `crates/sdkwork-content-news-service/tests/trust_media_test.rs`.

- [ ] **Step 6: Run trust and media tests**

```bash
cargo test -p sdkwork-content-news-service --test trust_media_test
```

- [ ] **Step 7: Commit trust and media services**

```bash
git add crates/sdkwork-content-news-service/src/service/trust_service.rs crates/sdkwork-content-news-service/src/service/media_attachment_service.rs crates/sdkwork-content-news-service/src/domain/trust.rs crates/sdkwork-content-news-service/src/domain/media.rs
git commit -m "feat(news-service): implement trust and media attachment services"
```

## Phase 3: API Handler Implementation

### Task 7: Implement Open API Handlers

**Files:**
- Modify: `crates/sdkwork-routes-news-open-api/src/handlers/professional_handlers.rs`
- Modify: `crates/sdkwork-routes-news-open-api/src/lib.rs`

- [ ] **Step 1: Implement story retrieval handlers**

Update `crates/sdkwork-routes-news-open-api/src/handlers/professional_handlers.rs` with story, source, author, Schema.org, rights, C2PA read operations.

- [ ] **Step 2: Update open routes with professional routes**

Update `crates/sdkwork-routes-news-open-api/src/lib.rs` with new professional routes.

- [ ] **Step 3: Write open API handler tests**

Create tests in `crates/sdkwork-routes-news-open-api/tests/professional_handler_test.rs`.

- [ ] **Step 4: Run open API handler tests**

```bash
cargo test -p sdkwork-routes-news-open-api --test professional_handler_test
```

- [ ] **Step 5: Commit open API handlers**

```bash
git add crates/sdkwork-routes-news-open-api/src/handlers/professional_handlers.rs crates/sdkwork-routes-news-open-api/src/lib.rs
git commit -m "feat(news-api): implement open API professional handlers"
```

### Task 8: Implement App API Handlers

**Files:**
- Create: `crates/sdkwork-routes-news-app-api/src/handlers/professional_handlers.rs`
- Modify: `crates/sdkwork-routes-news-app-api/src/lib.rs`

- [ ] **Step 1: Create professional app handlers**

Create `crates/sdkwork-routes-news-app-api/src/handlers/professional_handlers.rs` with following/latest/local feed, stories, share events, and reading progress operations.

- [ ] **Step 2: Update app routes with professional routes**

Update `crates/sdkwork-routes-news-app-api/src/lib.rs` with new professional routes.

- [ ] **Step 3: Write app API handler tests**

Create tests in `crates/sdkwork-routes-news-app-api/tests/professional_handler_test.rs`.

- [ ] **Step 4: Run app API handler tests**

```bash
cargo test -p sdkwork-routes-news-app-api --test professional_handler_test
```

- [ ] **Step 5: Commit app API handlers**

```bash
git add crates/sdkwork-routes-news-app-api/src/handlers/professional_handlers.rs crates/sdkwork-routes-news-app-api/src/lib.rs
git commit -m "feat(news-api): implement app API professional handlers"
```

### Task 9: Implement Backend API Handlers

**Files:**
- Create: `crates/sdkwork-routes-news-backend-api/src/handlers/professional_handlers.rs`
- Modify: `crates/sdkwork-routes-news-backend-api/src/lib.rs`

- [ ] **Step 1: Create professional backend handlers**

Create `crates/sdkwork-routes-news-backend-api/src/handlers/professional_handlers.rs` with story management, editorial assignment/review, imports, exports, rights, body blocks, provenance, schema.org rebuild, and API audit operations.

- [ ] **Step 2: Update backend routes with professional routes**

Update `crates/sdkwork-routes-news-backend-api/src/lib.rs` with new professional routes.

- [ ] **Step 3: Write backend API handler tests**

Create tests in `crates/sdkwork-routes-news-backend-api/tests/professional_handler_test.rs`.

- [ ] **Step 4: Run backend API handler tests**

```bash
cargo test -p sdkwork-routes-news-backend-api --test professional_handler_test
```

- [ ] **Step 5: Commit backend API handlers**

```bash
git add crates/sdkwork-routes-news-backend-api/src/handlers/professional_handlers.rs crates/sdkwork-routes-news-backend-api/src/lib.rs
git commit -m "feat(news-api): implement backend API professional handlers"
```

## Phase 4: Worker Implementation

### Task 10: Implement Worker Jobs

**Files:**
- Modify: `crates/sdkwork-content-news-worker/src/jobs/search_projection_job.rs`
- Modify: `crates/sdkwork-content-news-worker/src/jobs/external_feed_polling_job.rs`
- Create: `crates/sdkwork-content-news-worker/src/jobs/modernization_job.rs`
- Create: `crates/sdkwork-content-news-worker/src/jobs/compliance_job.rs`

- [ ] **Step 1: Implement search projection job**

Update `crates/sdkwork-content-news-worker/src/jobs/search_projection_job.rs` with search, schema.org, canonical URL, and CDN invalidation facts.

- [ ] **Step 2: Implement external feed polling job**

Update `crates/sdkwork-content-news-worker/src/jobs/external_feed_polling_job.rs` with feed claiming, external adapter calls, and import job persistence.

- [ ] **Step 3: Create modernization job**

Create `crates/sdkwork-content-news-worker/src/jobs/modernization_job.rs` for translation/localization memory operations.

- [ ] **Step 4: Create compliance job**

Create `crates/sdkwork-content-news-worker/src/jobs/compliance_job.rs` for privacy, retention, and legal-hold compliance.

- [ ] **Step 5: Update worker mod.rs**

Update `crates/sdkwork-content-news-worker/src/jobs/mod.rs` with new job modules.

- [ ] **Step 6: Write worker job tests**

Create tests in `crates/sdkwork-content-news-worker/tests/worker_job_test.rs`.

- [ ] **Step 7: Run worker job tests**

```bash
cargo test -p sdkwork-content-news-worker --test worker_job_test
```

- [ ] **Step 8: Commit worker jobs**

```bash
git add crates/sdkwork-content-news-worker/src/jobs/
git commit -m "feat(news-worker): implement professional newsroom worker jobs"
```

## Phase 5: SDK Integration

### Task 11: Update SDK Ports

**Files:**
- Modify: `packages/common/news/sdkwork-news-sdk-ports/src/professional.ts`
- Modify: `packages/common/news/sdkwork-news-sdk-ports/tests/news-professional-sdk-ports.standard.test.ts`

- [ ] **Step 1: Update SDK port interfaces**

Update `packages/common/news/sdkwork-news-sdk-ports/src/professional.ts` with generated SDK bindings for all professional operations.

- [ ] **Step 2: Update SDK port tests**

Update `packages/common/news/sdkwork-news-sdk-ports/tests/news-professional-sdk-ports.standard.test.ts` with tests for new bindings.

- [ ] **Step 3: Run SDK port tests**

```bash
pnpm test:vitest -- packages/common/news/sdkwork-news-sdk-ports/tests/news-professional-sdk-ports.standard.test.ts
```

- [ ] **Step 4: Commit SDK port updates**

```bash
git add packages/common/news/sdkwork-news-sdk-ports/src/professional.ts packages/common/news/sdkwork-news-sdk-ports/tests/news-professional-sdk-ports.standard.test.ts
git commit -m "feat(news-sdk): update professional SDK port bindings"
```

## Phase 6: Verification and Integration

### Task 12: Run Full Verification

**Files:**
- All modified files

- [ ] **Step 1: Run TypeScript typecheck**

```bash
pnpm run typecheck
```

- [ ] **Step 2: Run TypeScript tests**

```bash
pnpm run test:vitest
```

- [ ] **Step 3: Run Rust tests**

```bash
cargo test --workspace
```

- [ ] **Step 4: Run schema drift checks**

```bash
node tools/news_professional_registry_export.mjs --check
```

- [ ] **Step 5: Run registry tests**

```bash
node --test sdks/test/news-professional-registry.test.mjs sdks/test/news-professional-module-files.test.mjs
```

- [ ] **Step 6: Commit final integration**

```bash
git add -A
git commit -m "feat(news-professional): complete professional newsroom implementation"
```

## Summary

This plan covers all TODO items from the news-professional-engineering-skeleton.md file:

1. **Database**: Migration v7, repository methods, schema drift checks
2. **API**: Open, app, and backend API handlers for all professional operations
3. **SDK**: Regenerated SDKs and port bindings
4. **Service**: Story packaging, editorial workflows, import/export, trust, media
5. **Worker**: Search projection, external feed polling, modernization, compliance
6. **Verification**: Full test suite and schema drift checks

Total tasks: 12 major tasks with 60+ implementation steps.

**Estimated time:** 8-12 hours of focused implementation work.

**Dependencies:** 
- Database migration must be approved before repository implementation
- Service implementations depend on repository layer
- API handlers depend on service layer
- SDK ports depend on API contracts
