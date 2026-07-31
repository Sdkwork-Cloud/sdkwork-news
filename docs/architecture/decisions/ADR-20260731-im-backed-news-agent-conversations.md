# ADR-20260731 IM-backed news agent conversations

Status: accepted  
Requirement: REQ-2026-0001  
Owner: SDKWork News  
Date: 2026-07-31  
Specs: ARCHITECTURE_DECISION_SPEC.md, COMPOSABLE_ARCHITECTURE_SPEC.md,
APP_SDK_INTEGRATION_SPEC.md, APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md

## Context

Reading agents need durable conversations, streaming output, unread counts, ordering, pagination,
reconnect, and multi-client continuity. SDKWork IM already owns those capabilities and exposes
composed TypeScript and Flutter surfaces. Reimplementing them in sdkwork-news would create conflicting
protocols, state, and operational ownership.

## Decision

SDKWork IM is the sole owner of conversation lifecycle, membership, messages, history pagination,
read cursors, unread counts, stream frames, realtime reconnect, and message ordering.

SDKWork News owns agent identity and mission, reading scopes, trusted-source policy, schedule policy,
run orchestration, digest semantics, citation/risk/action cards, and the mapping from `agentId` to
`conversationId`.

The clients consume an explicit `NewsAgentConversationPort`. Runtime adapters bind that port to the
public `@sdkwork/im-app-sdk` and `@sdkwork/im-sdk` facades on TypeScript clients and to the composed
IM Flutter packages on mobile. UI feature packages receive the adapter through dependency injection.
No news package imports IM private `src/**` files, raw endpoints, manual credential headers, or
generated transport packages.

```text
PC / H5 / Flutter composition root
  -> News Assistant feature
     -> News agent application service
        -> News app SDK port
        -> NewsAgentConversationPort
           -> SDKWork IM composed facade / public chat feature
```

One agent maps to one IM conversation. News-specific results are encoded as typed message content or
attachment metadata owned by the news contract, while delivery and persistence remain IM-owned.

## Package Boundary

- Common contracts: agent profile, schedule policy, digest card, route ids, and conversation port.
- Common service: agent use cases and schedule validation; no browser, Flutter, transport, or storage code.
- IM adapter: only public composed IM imports; translates facade models into the common port.
- Client feature: pages/widgets, controllers/hooks, and client-only interaction state.
- Client root: token manager, SDK construction, adapters, providers, route assembly, and host bindings.

## Alternatives

- News-owned chat tables and websocket protocol: rejected because it duplicates IM authority and breaks continuity.
- Copying IM UI source into each news client: rejected because it forks fixes and violates public component boundaries.
- Embedding H5 in PC or Flutter: rejected because it weakens native interaction, accessibility, offline behavior, and release independence.
- Calling IM endpoints from news services: rejected because it bypasses composed SDK ownership and auth policy.

## Consequences

Benefits include one conversation truth, shared realtime behavior, replaceable feature packages, and
cross-client continuity. Costs include explicit IM runtime configuration and a coordinated compatibility
contract between IM public exports and news adapters. Flutter integration inherits current IM package
maturity and must be upgraded at the IM owner rather than patched locally.

No database migration, security exception, generated SDK ownership change, or production deployment
change is authorized by this ADR.

## Verification

- Component specs declare `layerRole`, public exports, required/provided ports, and IM SDK dependency.
- Static scans reject raw HTTP, generated consumer imports, and private sibling imports.
- Contract tests prove agent-to-conversation mapping and schedule validation.
- Client tests prove that selecting an agent opens the injected IM conversation surface.
- Composition resolver and frontend composition validators pass.

## Supersedes / Superseded By

None.
