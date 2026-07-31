# SDKWork News PRD

Status: active
Owner: SDKWork News
Application: sdkwork-news
Updated: 2026-07-31
Specs: REQUIREMENTS_SPEC.md, DOCUMENTATION_SPEC.md, COMPOSABLE_ARCHITECTURE_SPEC.md

## Document Map

- Add `PRD-<topic>.md` shards in this directory when the PRD grows beyond one reviewable screen.

## 1. Background And Problem

Recommendation feeds maximize engagement but require users to continuously scan, compare, and
remember information. In an AI-native workflow, the user should delegate recurring reading to
specialized agents and spend attention only on evidence-backed changes, risks, and decisions.

SDKWork News combines two complementary modes: agent-assisted reading for efficiency and a
traditional categorized feed for discovery. It must offer the same product model on PC, H5, and
Flutter without cloning chat, identity, SDK, or scheduling infrastructure inside each client.

## 2. Target Users

- Professionals who monitor industries, companies, policy, markets, or technology every day.
- Teams that need scheduled briefings and traceable source evidence.
- General readers who still expect a fast categorized news feed and saved reading history.
- AI builders who discover products, Skills, and MCP connectors in one catalog.

## 3. Goals And Non-Goals

Goals:

- Let each user create multiple reading agents with distinct scopes, sources, output formats, and schedules.
- Make one IM conversation the durable interaction surface for each reading agent.
- Deliver incremental streaming answers, unread state, history, reconnect, and conversation ordering through SDKWork IM.
- Provide daily time slots, weekly summaries, and monthly reviews through a validated schedule policy.
- Provide a cursor-paginated category feed, AI Store, and a complete account area on all three clients.
- Keep every capability independently installable and replaceable through public exports and declared ports.

Non-goals:

- Reimplementing conversations, messages, realtime transport, or unread synchronization in the news domain.
- Adding raw HTTP clients, local generated SDK forks, or client-specific copies of domain DTOs.
- Introducing a new database migration in the first client delivery slice.
- Using a WebView to ship the H5 implementation as Flutter.

## 4. Scope

### Assistant

- Agent list is the first mobile tab and the primary PC workspace.
- Agent create/edit supports name, mission, reading scope, trusted sources, output format, and schedule.
- Selecting an agent opens its SDKWork IM conversation.
- Agent results render as normal IM messages plus news-owned citation, digest, risk, and action cards.
- Profile supports multiple daily times, weekday summaries, monthly reviews, timezone, pause, and next-run preview.

### News

- Category tabs, recommended feed, breaking/live states, search, article detail, save, share, and feedback.
- Interactive lists use server pagination and preserve reading position per category.

### AI Store

- Separate catalogs for AI products, Skills, and MCP connectors.
- Search, filter, detail, install/connect state, trust metadata, and publisher identity.

### Account

- Identity, subscription, saved items, history, downloads, agent usage, notifications, appearance,
  language, privacy, security, help, and sign-out.

### Client Experience

- PC uses a quiet WeChat-inspired three-pane work surface: compact global navigation, contextual list,
  and content workspace. It does not duplicate a second feature sidebar inside the active capability.
- H5 and Flutter use four stable bottom tabs: Assistant, News, AI Store, and Account.
- H5 and Flutter share contracts, route ids, tokens, fixtures, and service ports, not UI runtime code.

## 5. User Scenarios

1. A market analyst creates three agents for policy, competitors, and product launches, then receives
   scheduled briefings in three independent IM conversations.
2. A user asks an agent to explain a claim. The answer streams into the existing conversation and
   includes source citations, uncertainty, and a follow-up action.
3. A reader switches to News, browses category pages, opens an article, saves it, and returns without
   losing the feed position.
4. A builder discovers an MCP connector, reviews its permissions and publisher, then initiates the
   SDKWork installation flow.
5. A user reviews agent run history, subscription usage, notification policy, and privacy controls in Account.

## 6. Success Metrics

- Median time from app open to useful agent digest under 10 seconds when a completed digest exists.
- At least 70% of scheduled runs surface one or more cited, deduplicated findings.
- Conversation resume preserves unread count and message order across PC, H5, and Flutter.
- Feed first page requests no more than the declared page size and never downloads the full collection.
- Core four-tab navigation and Assistant conversation flow pass visual and interaction parity review on all clients.
- Zero raw IM/news HTTP wrappers and zero private cross-package `src/**` imports in authored consumers.

## 7. Phases

1. Foundation: shared contracts, IM boundary, schedule model, route identity, and commercial shell.
2. Vertical slice: Assistant list, profile, schedule editor, IM conversation, and result cards on all clients.
3. Discovery: paginated News and AI Store capabilities.
4. Trust and account: profile, privacy/security, subscriptions, notifications, observability, and release gates.
5. Production: real provider wiring, signed artifacts, store metadata, operational SLO evidence, and staged rollout.

## 8. Linked Requirements

- [REQ-2026-0001 AI-native news clients](../requirements/REQ-2026-0001-ai-native-news-clients.md)

## 9. Open Questions

- Production provider selection and editorial source contracts require product-owner approval.
- Billing SKUs, install permissions, and store revenue policy remain owned by their platform authorities.
- Any future persistence schema for agent schedules requires separate database review and migration approval.
