> Migrated from `docs/news-professional-engineering-skeleton.md` on 2026-06-24.
> Owner: SDKWork maintainers

Date: 2026-06-12

## Scope

This skeleton defines the professional newsroom target for `content.news`. It intentionally avoids
frontend `apps/` work and does not hand-edit generated SDK transport output.

## Database First

The current SQLx repository implements 53 tables through six migrations. The professional target
adds 33 planned tables for story packaging, structured bodies, rights, external identities,
editorial workflow, import/export jobs, Schema.org projections, C2PA provenance, API audit,
localization, canonical URLs, homepage layout, external feed ingestion, syndication, newsletters,
paywall policy, CDN invalidation, translation memory, legal hold, and retention policy.

The design registry now contains 86 total tables. It is not a production migration. Any physical
DDL change still requires human review under SDKWork migration rules.

Files:

- `crates/sdkwork-content-news-repository-sqlx/schema/news-professional-schema.registry.json`
- `crates/sdkwork-content-news-repository-sqlx/src/professional_schema.rs`
- `packages/common/news/sdkwork-news-contracts/src/professional-schema.ts`
- `tools/news_professional_registry_export.mjs`

TODO handoff:

- TODO(news-db): create `0007_news_professional_newsroom_foundation.sql`.
- TODO(news-db): update `news_database_tables`, `news_database_indexes`, and migration plan after v7 is approved.
- TODO(news-db): implement repository methods for all planned tables with tenant/organization scope.
- TODO(news-db): add schema drift checks between JSON registry, Rust registry, SQL migrations, and OpenAPI DTOs.

## API Operations

The current runtime route count is 152. The professional blueprint declares 198 operations,
with all new public operations anonymous and all app/backend operations dual-token protected.

Files:

- `apis/_registry/news-professional-api.operations.json`
- `packages/common/news/sdkwork-news-contracts/src/professional-api.ts`
- `tools/news_professional_registry_export.mjs`

TODO handoff:

- TODO(news-api): materialize story, source, author, Schema.org, rights, C2PA read operations into open-api.
- TODO(news-api): materialize following/latest/local feed, stories, share events, and reading progress into app-api.
- TODO(news-api): materialize story management, editorial assignment/review, imports, exports, rights, body blocks, provenance, schema.org rebuild, and API audit into backend-api.
- TODO(news-api): update route crates and OpenAPI contracts in the same change set before SDK regeneration.

## SDK Ports

Service and frontend workers must consume generated SDKs or approved composed wrappers through typed
ports. The current skeleton defines method names for generated open/app/backend SDK adapters and a
`NewsProfessionalSdkPort` handoff class with TODO bindings.

Files:

- `packages/common/news/sdkwork-news-sdk-ports/src/professional.ts`
- `packages/common/news/sdkwork-news-sdk-ports/tests/news-professional-sdk-ports.standard.test.ts`

TODO handoff:

- TODO(news-sdk): regenerate SDKs after OpenAPI materialization.
- TODO(news-sdk): bind generated resource-style methods to the professional port interfaces.
- TODO(news-sdk): keep Drive, appbase IAM, notification, and other dependencies as dependency SDKs or composed wrappers.

## Service Skeleton

Rust business service skeletons define newsroom use cases and TODO methods only. They do not bypass
the repository or generated SDK boundaries.

Files:

- `crates/sdkwork-content-news-service/src/professional.rs`
- `crates/sdkwork-content-news-service/src/service/story_service.rs`
- `crates/sdkwork-content-news-service/src/service/editorial_workflow_service.rs`
- `crates/sdkwork-content-news-service/src/service/trust_service.rs`
- `crates/sdkwork-content-news-service/src/service/import_export_service.rs`
- `crates/sdkwork-content-news-service/src/service/feed_personalization_service.rs`
- `crates/sdkwork-content-news-service/src/service/media_attachment_service.rs`
- `crates/sdkwork-content-news-service/src/service/compliance_policy_service.rs`
- `crates/sdkwork-content-news-service/tests/news_professional_skeleton.rs`

TODO handoff:

- TODO(news-service): implement story packaging use cases.
- TODO(news-service): implement editorial assignment/review workflows.
- TODO(news-service): implement import/export adapters with idempotency and payload hashes.
- TODO(news-service): integrate Drive media, Schema.org projection, and C2PA trust workflows.

## Repository And Worker Skeletons

Repository and worker skeleton files are intentionally not wired into the compiled crates yet. They
are handoff files containing class names, method names, and precise TODOs for follow-up agents.

Files:

- `crates/sdkwork-content-news-repository-sqlx/src/repository/professional_repository.rs`
- `crates/sdkwork-content-news-repository-sqlx/src/repository/external_feed_repository.rs`
- `crates/sdkwork-content-news-repository-sqlx/src/repository/newsletter_repository.rs`
- `crates/sdkwork-content-news-repository-sqlx/src/repository/paywall_repository.rs`
- `crates/sdkwork-content-news-worker/src/jobs/search_projection_job.rs`
- `crates/sdkwork-content-news-worker/src/jobs/external_feed_polling_job.rs`
- `crates/sdkwork-router-news-backend-api/src/handlers/professional_handlers.rs`
- `crates/sdkwork-router-news-app-api/src/handlers/professional_handlers.rs`
- `crates/sdkwork-router-news-open-api/src/handlers/professional_handlers.rs`

TODO handoff:

- TODO(news-repository): implement SQLx repositories after migration v7 is approved.
- TODO(news-worker): create a proper `sdkwork-content-news-worker` crate before compiling worker jobs.
- TODO(news-api): wire professional handler modules only after route manifests and DTOs are materialized.

## Integration Capabilities

Professional newsroom integration points are defined as ports and capability records.

Files:

- `packages/common/news/sdkwork-news-contracts/src/professional-integrations.ts`

Capabilities:

- Drive-backed media attachment.
- Appbase IAM context and permissions.
- Search and Schema.org projections.
- Notification/digest delivery.
- Analytics warehouse export.
- IPTC ninjs and NewsML-G2 import/export.
- C2PA provenance and trust snapshot updates.
- External feed polling and normalized ingestion.
- Syndication partner delivery and delivery receipts.
- Newsletter composition and delivery.
- Paywall entitlement and metered-access events.
- CDN cache invalidation.
- Translation/localization memory.
- Moderation AI risk classification.
- Privacy, retention, and legal-hold compliance.

## Verification

Targeted checks for this skeleton:

- `node tools/news_professional_registry_export.mjs --check`
- `node --test sdks/test/news-professional-registry.test.mjs sdks/test/news-professional-module-files.test.mjs`
- `pnpm test:vitest -- packages/common/news/sdkwork-news-contracts/tests/news-professional-contracts.standard.test.ts packages/common/news/sdkwork-news-sdk-ports/tests/news-professional-sdk-ports.standard.test.ts`
- `cargo test -p sdkwork-content-news-service --test news_professional_skeleton`
- `cargo test -p sdkwork-content-news-repository-sqlx --test news_professional_schema_registry`

Broader checks before merge:

- `pnpm run typecheck`
- `pnpm run test:vitest`
- `cargo test --workspace`

