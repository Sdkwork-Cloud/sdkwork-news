# Flutter Conversion Record

Status: verified development slice; release gate blocked
Owner: SDKWork News
Updated: 2026-08-01
Source reference: `apps/sdkwork-news-h5`
Target root: `apps/sdkwork-news-flutter-mobile`

## 1. Scope And Boundary

The Flutter client is a native package composition, not an H5 WebView. Its first
tab is the reading-assistant inbox. Agent profiles belong to SDKWork Agents;
conversations, message history, read state, sending, and realtime refresh belong
to SDKWork IM. News owns only reading scope, schedule policy, digest metadata,
and the agent-to-conversation reference.

The production composition is real for Agents, IM, IAM current-user identity,
and the MCP catalog when demo mode is disabled and a valid session exists.
News feed, AI product catalog, Skill catalog, installation workflows, and
account metrics fail closed behind typed repository ports because their owning
Flutter App SDK surfaces are not materialized. Production does not use demo
repositories; demo data is limited to explicit demo mode.

## 2. Visual Parity Matrix

| Capability | H5 reference | Flutter evidence | Result |
| --- | --- | --- | --- |
| Assistant-first shell | Four fixed bottom tabs | `assistant-390x844.png`, `assistant-430x932.png` | Pass |
| Conversation | Agent header, history, composer, streaming state | `assistant-chat-390x844.png`, `assistant-stream-390x844.png` | Pass |
| Reading schedule | Daily slots, weekly summary, monthly review | `schedule-daily-390x844.png`, `schedule-weekly-390x844.png` | Pass |
| News | Category tabs, localized search, lead story, paged feed cards | `news-390x844.png`, `news-430x932.png`, `news-search-390x844.png` | Pass |
| AI Store | Product/Skill/MCP segments and install lifecycle | `ai-store-installed-390x844.png`, `ai-store-430x932.png` | Pass |
| Account | Profile, plan usage, content and settings groups | `account-390x844.png`, `account-430x932.png` | Pass |

Screenshots are stored in `docs/quality/screenshots/flutter/`. Browser checks at
390x844 and 430x932 reported `scrollWidth == innerWidth` for every tab and no
warning/error console entries.

## 3. Functional Parity Matrix

| Flow | Flutter implementation | Evidence | Status |
| --- | --- | --- | --- |
| Create assistant | Controller creates Agents profile and links one IM dialog | `assistant_controller_test.dart` | Pass |
| Load/send messages | IM chat service history, send, read marker, realtime refresh | `assistant_controller_test.dart` | Pass |
| Streaming presentation | One in-progress entry is replaced by final IM state | `assistant_controller_test.dart` and browser QA | Pass |
| Schedule edit | Multiple daily times, weekday/time, month day/time, timezone | Unit tests and browser QA | Pass |
| Feed pagination | Cursor page requests with overlap de-duplication | `catalog_controllers_test.dart` | Pass |
| Feed search | Localized search sheet propagates the query through controller and paged repository, suppresses stale requests, and supports clearing | `catalog_controllers_test.dart`, `widget_test.dart`, and browser QA | Pass |
| Store install lifecycle | Serialized install/uninstall with failure preservation | `catalog_controllers_test.dart` and browser QA | Pass |
| MCP catalog adapter | MCP App SDK page maps to feature-owned entries without copied transport DTOs | `sdk_adapters_test.dart` | Pass |
| IAM identity adapter | IAM current-user identity maps without fabricated plan or activity metrics | `sdk_adapters_test.dart` | Pass |
| Typed four-tab routing | Route ids map to stable shell destinations | `app_contract_test.dart`, `widget_test.dart` | Pass |
| Production config | Validates Agents, IM, IAM, and MCP URLs and keeps demo mode explicit | `app_contract_test.dart` | Pass |

## 4. Dependency Provenance

| Consumer package | Authority | Approved dependency |
| --- | --- | --- |
| Agent adapter | `sdkwork-agents` | `sdkwork_agents_app_sdk` generated Flutter App SDK |
| IM adapter | `sdkwork-im` | `sdkwork_im_flutter_mobile_core` and `sdkwork_im_flutter_mobile_chat` |
| MCP Store adapter | `sdkwork-mcp` | `sdkwork_mcp_app_sdk_generated_flutter` generated Flutter App SDK |
| Account identity adapter | `sdkwork-iam` | `sdkwork_iam_app_sdk` generated Flutter App SDK |
| Auth/session storage | SDKWork Flutter commons | `sdkwork_common_flutter` and `flutter_secure_storage` transitively |
| News UI contracts | News-owned packages | `sdkwork_news_flutter_mobile_core` public exports |

No authored Flutter feature package uses raw HTTP, manual auth headers, a local
SDK fork, or private sibling `src/**` imports. The composition root constructs
SDK clients once and injects repositories/controllers.

## 5. Capability And Unresolved Ledger

| Capability | Current state | Production action |
| --- | --- | --- |
| Agents | Real SDK adapter | Provide approved Agents App API URL and authenticated session |
| IM conversations | Real SDKWork IM adapter | Provide approved HTTP/WebSocket URLs and authenticated session |
| News feed | Typed unavailable repository in production | Materialize the News Flutter App SDK, then inject its paged feed adapter |
| MCP catalog | Real MCP App SDK adapter | Add dependency-owned installation authority before enabling install controls |
| AI products | Typed unavailable state in production | Materialize the AppStore Flutter App SDK and inject its catalog/install adapter |
| Skills | Typed unavailable state in production | Materialize the Skills Flutter App SDK and inject its catalog/install adapter |
| Account identity | Real IAM App SDK adapter | Keep IAM as identity authority |
| Account metrics and plan | Omitted instead of fabricated | Compose News activity, membership/billing, privacy, and notification SDK facades |
| Android artifact | Source ready; artifact not produced on this host | Accept Android licenses and restore Maven connectivity |
| iOS artifact | Not buildable on Windows | Build/sign on macOS with Xcode and approved signing identity |
| Flutter Web Wasm | JavaScript web build passes | Upgrade secure-storage web dependency before enabling Wasm |

## 6. Verification Transcript

Executed from the repository root through the checked-in Flutter runner:

```text
pnpm check:flutter
  No issues found.

pnpm test:flutter
  17 tests passed.

pnpm build:flutter:web
  Built build/web.
  JavaScript release passed; Wasm dry run reported flutter_secure_storage_web incompatibility.

Browser QA: 390x844 and 430x932
  Assistant, News categories/search, AI Store install/uninstall, Account: passed.
  Flutter search results/clear and Account language settings: passed.
  Horizontal overflow: none.
  Console warning/error entries: [].
```

PC and H5 production builds and their targeted Assistant/Store tests also pass;
repository-wide conformance checks are recorded below.

## 7. Native Toolchain Limitations

`flutter doctor -v` reports Flutter and the Android SDK as installed, but Android
licenses are not fully accepted and the host cannot reliably reach
`https://maven.google.com/`. Previous Android build attempts therefore cannot be
treated as APK delivery evidence. The added Kotlin in-process settings reduce
local compiler-daemon instability but do not bypass licensing or dependency
provenance. iOS compilation and signing require a macOS release runner.

## 8. Repository Gate Status

The client slice remains verified after the composable-core and SDK port
normalization:

```text
pnpm typecheck
  Passed.

pnpm test:node
  16 tests passed.

pnpm test:vitest
  102 tests passed across 35 files.

pnpm check:flutter
  No issues found.

pnpm test:flutter
  17 tests passed.

pnpm build:pc
pnpm build:h5
pnpm build:flutter:web
  Passed.

node ../sdkwork-specs/tools/check-app-sdk-consumer-imports.mjs --workspace .
  Passed.

node ../sdkwork-specs/tools/check-component-port-bindings.mjs --root . --strict
node ../sdkwork-specs/tools/check-application-layering.mjs --root .
node ../sdkwork-specs/tools/check-rust-backend-composition.mjs --root .
node ../sdkwork-specs/tools/resolve-composition.mjs --root . --write
node ../sdkwork-specs/tools/check-composition-resolver.mjs --root .
  Passed; generated/composition.resolved.json materialized.

cargo test --workspace
cargo clippy --workspace --tests -- -D warnings
  Passed.

node ../sdkwork-specs/tools/audit-gateway-alignment-repo.mjs --root . --strict
  Passed with score perfect.
```

The Flutter conversion static scan matrix found no raw HTTP, manual auth
headers, backend SDK imports, WebView shell, H5/React imports, or platform
plugin leakage from feature packages. Runtime environment reads remain in
`lib/bootstrap`, secure storage remains in the host package, and realtime IM
behavior remains in the IM adapter.

The locale catalog split, service-owned repository port, and complete API
assembly/gateway boundary are now implemented and verified. Repository-wide
release completion remains blocked on reviewed ownership changes:

- update the canonical `sdkwork-specs/workspace/consumers/sdkwork-news.json`
  registry with the IAM user-center package and the Agents, IM, AppStore,
  Skills, and MCP TypeScript SDK workspace paths before materializing
  `pnpm-workspace.yaml`;
- generate and register the missing News, AppStore, and Skills Flutter App SDK
  families through their owning OpenAPI and SDK generator workflows;
- complete reviewed IAM TokenManager login and unified session recovery;
- replace placeholder app media with governed Drive-backed assets and produce
  signed Android/iOS artifacts plus release, rollout, and rollback evidence.

These gaps are not represented as passing release evidence. They require the
registry, SDK-family, IAM security, media, or release owners to approve and
execute their respective authority changes.
