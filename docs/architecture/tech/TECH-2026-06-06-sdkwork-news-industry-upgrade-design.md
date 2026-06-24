> Migrated from `docs/superpowers/specs/2026-06-06-sdkwork-news-industry-upgrade-design.md` on 2026-06-24.
> Owner: SDKWork maintainers

# SDKWork News Industry Upgrade Design

## Purpose

`sdkwork-news` must move from a basic publishing module to a news product platform that can support app experiences comparable to modern news products. The current schema and API cover categories, articles, bodies, tags, publication events, read state, and editorial audit. They do not yet cover the product loops expected in an advanced news application: channel feeds, topic discovery, multimedia stories, personalized recommendation signals, search/trending, engagement, comments, feedback, moderation, and operational experiments.

This upgrade keeps `sdkwork-news` as the owner of news capabilities and keeps appbase out of news-specific concerns.

## Standards Read

The implementation follows `../../../../sdkwork-specs`:

- `API_SPEC.md`: OpenAPI 3.1.2 is the HTTP source of truth; app-api uses `/app/v3/api`; backend-api uses `/backend/v3/api`; public operations explicitly use `security: []`; protected app/backend operations require `AuthToken` and `AccessToken`; operationIds use dotted lowerCamelCase resource style; query parameters use `q`, `cursor`, `limit`, and lower_snake_case for multi-word names.
- `DATABASE_SPEC.md`: new business tables target L2 where they are tenant scoped, append/event, cross-service, or user scoped. Tables must use explicit tenant/organization/user ownership, audit/lifecycle columns, indexes for high-frequency queries, and avoid putting core query fields only in JSON.
- `SDK_SPEC.md` and `SDK_WORKSPACE_GENERATION_SPEC.md`: missing capabilities are fixed in OpenAPI and regenerated SDKs. Generated SDK output is not hand-edited. Owner-only OpenAPI metadata must remain explicit.
- `MEDIA_RESOURCE_SPEC.md` and `DRIVE_SPEC.md`: news media must use stable `MediaResource`/Drive-style references and not persist bare media URLs as business identity.
- `PRIVACY_SPEC.md`, `SECURITY_SPEC.md`, and `GOVERNANCE_SPEC.md`: user behavior, feedback, comments, and reports are privacy-sensitive; schemas must support lifecycle, audit, retention, and moderation.
- `TEST_SPEC.md`: contract, database, Rust, SDK generation, and TypeScript tests must guard drift.

## Industry Gap

The current database is a publishing foundation. Compared with leading news apps, it lacks:

- Content source/author identity, copyright, locale/region, content type, versions, and rich media.
- Consumer channels, topic pages, channel-specific ordering, related content, search, and trending surfaces.
- Feed/recommendation event collection for impressions, clicks, dwell time, completion, feedback, and experiments.
- Engagement state for reactions, favorites, shares, follows, comments, reports, and moderation.
- Operational governance for content risk signals, takedowns, comment review, and audit-ready cases.

The current API has the same limitation: open/app only read basic articles, and backend only manages basic categories and items.

## Recommended Approach

Use a phased industry foundation.

Phase one adds the durable schema, OpenAPI/SDK contracts, route catalogs, Rust storage manifests, and a small set of repository methods that prove the model works. It does not attempt to build a full ranking engine, search engine, livestream platform, or data warehouse in one pass. Recommendation and search are represented by first-class events, metrics, and contracts so those systems can be attached without changing the public API shape later.

## Database Design

Add migration `0002_news_industry_foundation.sql`. Do not mutate `0001_news_foundation.sql`.

Content enrichment:

- `news_source`: publisher/source identity, trust tier, status, locale, region, homepage URL.
- `news_author`: author identity tied to a source or user.
- `news_item_version`: immutable editorial versions with checksum and review state.
- `news_media_asset`: stable `MediaResource` snapshot fields for images, video, audio, documents, and live covers.
- `news_item_media`: role/order relation from content to media.
- `news_topic` and `news_item_topic`: topic discovery and topic feeds.
- `news_channel` and `news_channel_item`: app channel taxonomy and manually or algorithmically curated channel feeds.

Feed/recommendation/search/trending:

- `news_feed_stream`: named feed surfaces such as `for_you`, `following`, `hot`, and `channel`.
- `news_feed_cursor`: per-user cursor/checkpoint state.
- `news_recommendation_event`: append-only impression/click/dwell/complete/dismiss feedback signal.
- `news_user_feedback`: explicit user controls such as not interested, block source, report quality.
- `news_trending_metric`: time-windowed hotness/search/share/comment metrics.
- `news_search_projection`: lightweight search read model with title/summary/tag/topic text and rebuild metadata.
- `news_experiment` and `news_experiment_assignment`: recommendation/feed experiment governance.

Engagement/community:

- `news_comment`: hierarchical comment content and moderation status.
- `news_comment_moderation`: audit trail for comment moderation.
- `news_reaction`: user reaction state.
- `news_favorite`: user saved articles.
- `news_share_event`: append-only share facts.
- `news_follow`: user follows source/topic/author/channel.
- `news_report`: user reports for item/comment/source.

Governance:

- `news_moderation_case`: operator-visible review case.
- `news_content_risk_signal`: machine or human risk labels.
- `news_takedown_event`: takedown/restore/legal event history.

All new tables use `TEXT` IDs in the current SQLite/Rust style, explicit `tenant_id`, `organization_id` where useful, `status`, `created_at`, `updated_at`, `version`, and lifecycle columns where the profile requires them. Append-only event tables include event type, occurred time, and dedupe/idempotency fields where applicable. High-frequency paths get composite indexes by tenant, status, channel/topic/item/user, and time.

## API Design

Open API additions:

- `GET /open/v3/api/news/channels`
- `GET /open/v3/api/news/channels/{channelId}/feed`
- `GET /open/v3/api/news/topics`
- `GET /open/v3/api/news/topics/{topicId}/items`
- `GET /open/v3/api/news/items/{itemId}/related`
- `GET /open/v3/api/news/trending`
- `GET /open/v3/api/news/search`

App API additions:

- public-reader equivalents where authenticated state is useful: channels, topic feeds, personalized feed, trending, search, related items.
- `POST /app/v3/api/news/events` for behavior events.
- favorites, reactions, comments, reports, feedback, reading history, and follows.

Backend API additions:

- sources, authors, channels, topics, item versions, item media, moderation cases, comments moderation, reports, trending metrics, search projection, and experiments.

DTO design uses `NewsPage`/cursor response shapes for feed-like operations, `MediaResource` for media, and explicit command schemas for event/feedback/reaction/favorite/report/follow write paths.

## Rust Design

Storage crate:

- `SqliteNewsStore::migrate` executes 0001 then 0002.
- `news_storage_capability_manifest()` moves to `news.storage.v2`.
- `news_database_tables()`, `news_database_indexes()`, `news_migration_names()`, migration plan, and repository bindings include the new tables.
- Add focused methods to prove core flows:
  - create channel
  - attach item to channel
  - list channel feed
  - record recommendation event
  - record user feedback
  - mark favorite
  - react to item
  - upsert trending metric

Core and HTTP crates:

- Core manifest lists the expanded capability operation IDs.
- HTTP route catalog includes open, app, and backend route sets with canonical prefixes and operationIds.

## Verification

Implementation must follow TDD:

1. Add failing tests in storage, contracts, OpenAPI boundary, schema gate, Rust core, and Rust HTTP.
2. Implement migration, manifests, contracts, OpenAPI exporter, and route catalogs.
3. Regenerate SDKs.
4. Run:
   - `node tools/news_sdk_generate.mjs --check`
   - `node --test sdks/test/*.test.mjs sdks/sdkwork-news-sdk/tests/*.test.mjs sdks/sdkwork-news-app-sdk/tests/*.test.mjs sdks/sdkwork-news-backend-sdk/tests/*.test.mjs`
   - `pnpm test:vitest`
   - `pnpm typecheck`
   - `cargo test --workspace`

## Non-Goals

- Do not build a full machine-learning ranking service in this pass.
- Do not introduce raw HTTP consumers.
- Do not hand-edit generated SDK source.
- Do not move IAM/login/session behavior into news.
- Do not duplicate Drive upload/storage lifecycle tables in news.

