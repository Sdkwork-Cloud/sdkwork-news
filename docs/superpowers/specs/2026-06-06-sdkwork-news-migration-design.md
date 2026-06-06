# SDKWork News Migration Design

## Purpose

`sdkwork-news` owns SDKWork news and newsroom capabilities. The old `sdkwork-appbase` workspace carried a lightweight `@sdkwork/news-pc-react` package and catalog entries, but appbase should remain a foundation/IAM/runtime assembly layer instead of owning product news.

## Scope

- Move news PC React logic into `sdkwork-news`.
- Add framework-independent TypeScript contracts, SDK ports, service, and runtime packages.
- Add Rust core, SQLx storage contracts, SQL migrations, and HTTP route metadata.
- Add owner-only OpenAPI 3.1.2 app/backend/open SDK inputs and SDK assembly manifests.
- Remove old appbase news package and catalog references after the new owner is present.

## Architecture

The workspace follows the `sdkwork-commerce` extraction shape:

- `packages/common/news/*` contains TypeScript contracts and service boundaries.
- `apps/sdkwork-news-pc/packages/news/sdkwork-news-pc-react` contains user-facing PC React reusable logic.
- `crates/sdkwork-news-core-rust` contains Rust domain contracts.
- `crates/sdkwork-news-storage-sqlx-rust` owns tables, migration plan, and repository contracts.
- `crates/sdkwork-news-http-rust` owns HTTP route metadata for `/app/v3/api/news/*` and `/backend/v3/api/news/*`.
- `generated/openapi` stores owner-only OpenAPI inputs.
- `sdks/sdkwork-news-{sdk,app-sdk,backend-sdk}` store SDK assembly metadata and generation wrappers.

## API Surface

App routes expose published-reader behavior:

- `GET /app/v3/api/news/categories`
- `GET /app/v3/api/news/items`
- `GET /app/v3/api/news/items/{itemId}`
- `GET /app/v3/api/news/items/by_slug/{slug}`
- `GET /app/v3/api/news/overview`

Backend routes expose editorial behavior:

- category list/create/update/delete
- item list/create/update/delete
- publish, schedule, archive, and feature commands
- editorial readiness retrieval

All operations use owner `sdkwork-news`, authorities `sdkwork-news.app`, `sdkwork-news.backend`, or `sdkwork-news.open`, tag `news`, dotted operationIds, `Access-Token` security for protected operations, and SDKWork v3 path prefixes.

## Storage

The initial schema creates:

- `news_category`
- `news_item`
- `news_item_body`
- `news_tag`
- `news_item_tag`
- `news_publication_event`
- `news_read_state`
- `news_editorial_audit`
- `news_schema_version`
- `news_migration_lock`

Indexes cover tenant/category/status/publication windows, slug uniqueness, featured ordering, tag lookup, read state, and audit lookup.

## Appbase Cleanup

After the new workspace exists, appbase should no longer declare:

- `packages/pc-react/system/sdkwork-news-pc-react`
- `@sdkwork/news-pc-react` in PC starter catalog
- `@sdkwork/news-mobile-react` in mobile starter catalog
- news package aliases in `tsconfig.base.json`
- `sdkwork-news-pc-react` in `scripts/package-catalog.mjs`
- news package entry in `pnpm-lock.yaml`

Notification remains an appbase capability only for notification/inbox delivery. News and announcement publishing live in `sdkwork-news`.

