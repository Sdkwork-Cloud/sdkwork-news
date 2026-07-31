# News Technical Architecture

Status: active
Owner: SDKWork News
Updated: 2026-07-31
Specs: ARCHITECTURE_DECISION_SPEC.md, DOCUMENTATION_SPEC.md, COMPOSABLE_ARCHITECTURE_SPEC.md,
APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md

## Document Map

- [TECH-2026-06-06-sdkwork-news-industry-upgrade-design.md](TECH-2026-06-06-sdkwork-news-industry-upgrade-design.md)
- [TECH-2026-06-06-sdkwork-news-industry-upgrade.md](TECH-2026-06-06-sdkwork-news-industry-upgrade.md)
- [TECH-2026-06-06-sdkwork-news-migration-design.md](TECH-2026-06-06-sdkwork-news-migration-design.md)
- [TECH-2026-06-13-news-professional-implementation.md](TECH-2026-06-13-news-professional-implementation.md)
- [TECH-news-professional-engineering-skeleton.md](TECH-news-professional-engineering-skeleton.md)

## 1. Architecture Overview

SDKWork News is a multi-client composition of independent capability packages. PC, H5, and Flutter
share domain contracts, route identities, SDK facades, service ports, and fixtures while retaining
platform-native UI packages and composition roots.

Conversation capability is composed from SDKWork IM. News owns the reading-agent domain but does not
own message transport or persistence. This boundary is recorded in
[ADR-20260731](../decisions/ADR-20260731-im-backed-news-agent-conversations.md).


## 2. Technology Choices

- PC and H5: strict TypeScript, React, Vite, public workspace packages, injected composed SDK clients.
- Flutter: Dart 3 / Flutter, controller-driven feature state, typed routes, composed SDK packages.
- Backend authority: existing Rust news services and generated SDK families; this client slice does not add migrations.
- Realtime and conversations: SDKWork IM public SDK and chat feature packages.

## 3. System Boundaries And Modules

- `news-contracts`: news entities plus agent, schedule, digest, and cross-client route contracts.
- `news-service`: news/agent application use cases over injected ports.
- `news-im-adapter`: IM facade translation; the only common package aware of IM contracts.
- `<client>-core`: SDK registry, runtime/session, and module registration.
- `<client>-shell`: global navigation, route contribution assembly, and layout.
- `<client>-assistant|feed|ai-store|account`: one capability per feature package.
- Client root: construction and wiring only.

Dependency direction is root -> shell/features -> common services -> contracts/ports. Core and commons
never depend on feature packages. Cross-client packages never import UI runtime code.

## 4. Directory And Package Layout

```text
apps/sdkwork-news-common/packages/
  sdkwork-news-contracts
  sdkwork-news-sdk-ports
  sdkwork-news-service
  sdkwork-news-im-adapter
apps/sdkwork-news-pc/packages/sdkwork-news-pc-<capability>
apps/sdkwork-news-h5/packages/sdkwork-news-h5-<capability>
apps/sdkwork-news-flutter-mobile/packages/sdkwork_news_flutter_mobile_<capability>
```

## 5. API, SDK, And Data Ownership

- News HTTP consumers use `@sdkwork/news-app-sdk` through news ports.
- IM app APIs use `@sdkwork/im-app-sdk`; IM open/realtime behavior uses `@sdkwork/im-sdk`.
- UI packages never import generated transports or construct auth headers.
- Feed, store, inbox, and history lists use server pagination and preserve `pageInfo` semantics.
- News stores only the agent-to-conversation reference; IM remains the message and conversation authority.

## 6. Security, Privacy, And Observability

The application root owns one token manager and injects configured clients. Agent schedules and source
preferences are user-scoped. Message bodies are not copied into news-owned client storage. Traces use
SDKWork trace ids from composed clients; production logging must redact tokens and private content.

## 7. Deployment And Runtime Topology

PC, H5, and Flutter are independently built application roots supporting the root application's cloud
and standalone profiles where their manifests declare support. Dependency endpoints are supplied by
typed source configuration. No client hard-codes production URLs.

## 8. Architecture Decision Index

- [ADR-20260731 IM-backed news agent conversations](../decisions/ADR-20260731-im-backed-news-agent-conversations.md)

## 9. Verification

- Package type checks, unit tests, and production builds.
- Component port, frontend composition, app SDK import, pagination, route, and repository validators.
- Playwright desktop/mobile screenshots and Flutter widget/render verification.
