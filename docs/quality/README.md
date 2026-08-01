# SDKWork News Quality Evidence

Status: development validation passed; release gate blocked
Owner: SDKWork News
Evidence snapshot: 2026-08-01

This index records reproducible source, test, build, architecture, and visual QA
evidence for the PC, H5, and Flutter clients. It is not a production release
record and does not replace governed app-manifest media, signing, SBOM,
provenance, store submission, rollout, or rollback evidence.

## Governing Sources

- Product scope: [`../product/prd/PRD.md`](../product/prd/PRD.md)
- Technical architecture: [`../architecture/tech/TECH_ARCHITECTURE.md`](../architecture/tech/TECH_ARCHITECTURE.md)
- Quality gates: [`../../../sdkwork-specs/QUALITY_GATE_SPEC.md`](../../../sdkwork-specs/QUALITY_GATE_SPEC.md)
- Release evidence: [`../../../sdkwork-specs/RELEASE_SPEC.md`](../../../sdkwork-specs/RELEASE_SPEC.md)
- App media and publication: [`../../../sdkwork-specs/APP_MANIFEST_SPEC.md`](../../../sdkwork-specs/APP_MANIFEST_SPEC.md)

## Client Evidence

| Client | Build evidence | Screenshot evidence | Manifest state |
| --- | --- | --- | --- |
| PC | `pnpm build:pc` passed | 4 desktop screenshots in [`screenshots/pc/`](screenshots/pc/) | `DRAFT`; placeholder primary icon; no governed screenshots |
| H5 | `pnpm build:h5` passed | 7 mobile screenshots in [`screenshots/h5/`](screenshots/h5/) | `DRAFT`; placeholder primary icon; no governed screenshots |
| Flutter | `pnpm build:flutter:web` passed | 13 phone screenshots in [`screenshots/flutter/`](screenshots/flutter/) | `DRAFT`; placeholder primary icon; no governed screenshots |

The local screenshots show the actual application and support development QA.
They are not store media: they have not been uploaded through Drive, projected
as `MediaResource`, registered in `media.screenshots`, or validated against
Google Play and App Store display profiles.

The latest browser interaction audit exercised PC and H5 category filtering and
search, Flutter localized search and clear behavior, account language settings,
and the complete Account hierarchy. No horizontal overflow was observed at
390px or 320px mobile widths, and the audited pages emitted no console errors.

## Functional And Architecture Evidence

- The Assistant surface is the first mobile tab and the primary PC workspace.
- Agent identity, reading scope, schedules, and agent-to-conversation references
  remain News/Agents responsibilities.
- Conversations, message history, sending, read state, and realtime refresh use
  the SDKWork IM composed chat system; feature packages do not add raw IM HTTP.
- News, AI Store, and Account remain separately owned packages behind injected
  service or repository ports.
- The standalone gateway consumes one complete News API assembly contribution;
  route manifest, authored OpenAPI, permissions, context injectors, and readiness
  are composed as one Web Framework unit.
- The News service owns its repository port. SQLx implements that port from the
  repository adapter crate; service tests use an in-memory adapter.

## Verification Snapshot

| Gate | Result |
| --- | --- |
| Build-source integrity | Passed |
| TypeScript typecheck | Passed |
| Node tests | 16 passed |
| Vitest | 102 passed across 35 files |
| Flutter analyze | Passed |
| Flutter tests | 17 passed |
| PC, H5, Flutter Web release builds | Passed |
| PC app-local check | 30 tests, typecheck, and production build passed |
| H5 app-local check | 17 tests, typecheck, and production build passed |
| Rust format | Passed |
| Rust workspace tests | Passed |
| Rust clippy `--workspace --tests -- -D warnings` | Passed |
| SDK generation check | Passed; app 40, backend 93, open 19 operations |
| API operation, envelope, and pagination checks | Passed |
| App SDK consumer import check | Passed |
| Frontend, Rust, permission, route, strict component-port, layering, and resolver composition checks | Passed; `generated/composition.resolved.json` materialized |
| Standalone gateway strict alignment | `perfect` |
| App manifest standard | Passed for all 4 manifests |
| Manifest-driven Dev App publish preview | Blocked; PC, H5, and Flutter manifests do not declare `devApp` build/upload targets |
| Source config and topology profile gates | Blocked; retired `configs/`, unsafe production CORS, missing client-env materialization declaration, and standalone platform-gateway keys remain |
| Repository `verify-repo` | Blocked only by canonical pnpm workspace registry drift |

## Release Blockers

1. The canonical `sdkwork-specs/workspace/consumers/sdkwork-news.json` registry
   does not yet register the IAM user-center package and the Agents, IM,
   AppStore, Skills, and MCP TypeScript SDK workspace paths required by this
   repository. Running `sync-workspace` now would remove required `workspace:*`
   packages, so registry-owner review is required first.
2. PC, H5, and Flutter manifests lack `devApp.build.targets` and upload/package
   declarations. The source configuration chain also lacks
   `etc/client-env.materialization.json`; manifest-driven preview/package/upload
   cannot run until these reviewed release declarations are added.
3. Root topology still points at retired `configs/topology/**`. Its production
   cloud gateway allows any CORS origin with an empty allowlist, while
   standalone profiles incorrectly declare a platform API gateway. Migrating
   these production settings to `etc/` requires configuration and security
   owner review.
4. News, AppStore, and Skills Flutter App SDK families are not all materialized.
   Production Flutter feed and catalog adapters therefore fail closed instead
   of using demo data or raw HTTP.
5. Flutter production login still lacks the reviewed IAM TokenManager and
   unified session-recovery composition. The signed-out login action remains
   unavailable rather than fabricating an authenticated state.
6. All three app manifests remain `DRAFT`; governed icons, screenshots,
   signing, SBOM, provenance, artifact checksums, rollout, and rollback evidence
   are incomplete.
7. Android artifact production is blocked by local license/Maven readiness; iOS
   build and signing require an approved macOS runner and signing identity.
8. Flutter Web JavaScript release passes, but `flutter_secure_storage_web` is
   not compatible with the current Wasm dry run.

Gate decision: the source is a verified development candidate, not a release
candidate or production release.
