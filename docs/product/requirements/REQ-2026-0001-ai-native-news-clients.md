# REQ-2026-0001 AI-native news clients

id: REQ-2026-0001  
title: Deliver AI-native news clients backed by SDKWork IM  
owner: SDKWork News  
status: in-progress  
source: customer

## Problem

Users spend too much time repeatedly scanning recommendation feeds. SDKWork News needs a delegated
reading workflow while retaining a familiar news-discovery experience across PC, H5, and Flutter.

## Goals

- Provide multiple specialized reading agents per user.
- Bind each agent to one SDKWork IM conversation with streaming and realtime behavior.
- Support validated daily, weekly, and monthly reading schedules.
- Deliver News, AI Store, and Account capabilities beside Assistant on every client.
- Keep feature packages independently testable through public ports and composition roots.

## Non-goals

- Owning IM conversations, messages, realtime transport, or unread state in sdkwork-news.
- Changing generated SDK ownership or introducing raw HTTP fallbacks.
- Changing database schemas or production deployment settings in this delivery unit.
- Achieving Flutter delivery through H5 embedding or WebView.

## Users

- Professional reader
- General news reader
- AI product and connector buyer
- SDKWork application operator

## Acceptance Criteria

- PC presents a WeChat-inspired workspace with global navigation, an agent conversation list, and an active conversation surface.
- H5 and Flutter present Assistant, News, AI Store, and Account as four stable bottom tabs.
- Creating or selecting a reading agent resolves an IM conversation id; news code does not create a parallel message store.
- Conversation history and new messages are consumed through composed SDKWork IM packages or injected IM ports.
- Schedule policy validates timezone, one or more daily slots, weekday summaries, and monthly day/time rules.
- Feed and store lists request bounded pages and consume server page metadata.
- Every new package declares a component spec, public exports, layer role, ports, and SDK dependencies.
- Type checks, unit tests, builds, composition checks, SDK import scans, pagination checks, and visual QA evidence are recorded.

## Non-functional Requirements

- Security: reuse the application token manager and IM/news SDK auth; no manual auth headers.
- Privacy: minimize profile data, expose schedule pause/delete controls, and do not persist message copies in news clients.
- Performance: first interactive page uses at most 20 feed/store items; IM history uses cursor pagination.
- Reliability: reconnect and message ordering remain IM-owned; schedules expose next-run and paused state.

## Affected Surfaces

- composition
- pc
- h5
- flutter-mobile
- sdk

## Trace

Specs: REQUIREMENTS_SPEC.md, COMPOSABLE_ARCHITECTURE_SPEC.md, APP_SDK_INTEGRATION_SPEC.md,
APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md, APP_PC_ARCHITECTURE_SPEC.md,
APP_H5_ARCHITECTURE_SPEC.md, FLUTTER_APP_MOBILE_ARCHITECTURE_SPEC.md, PAGINATION_SPEC.md.  
Decision: [ADR-20260731 IM-backed news agent conversations](../../architecture/decisions/ADR-20260731-im-backed-news-agent-conversations.md)

## Verification

- `pnpm typecheck`
- `pnpm test:vitest`
- Client-specific production builds
- `node ../sdkwork-specs/tools/check-app-sdk-consumer-imports.mjs --workspace .`
- `node ../sdkwork-specs/tools/check-pagination.mjs --workspace .`
- SDKWork component/composition validators
- Desktop and mobile Playwright screenshots; Flutter widget/golden review where supported
