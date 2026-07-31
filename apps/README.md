# apps/

Application: sdkwork-news
Status: active
Owner: SDKWork maintainers
Specs: APPLICATION_SPEC.md, SDKWORK_WORKSPACE_SPEC.md

## Primary App Surface

The repository root is the primary runnable app surface.
The repository root `sdkwork.app.config.json` governs the primary application manifest.

## Directory Index

| Directory | Surface role | Runnable | Purpose | Entry |
| --- | --- | --- | --- | --- |
| sdkwork-news-common | shared | no | Cross-client agent contracts, orchestration, and public SDK adapters. | `sdkwork-news-common/` |
| sdkwork-news-pc | pc | yes | WeChat-inspired PC workspace with one global rail. | `sdkwork-news-pc/` |
| sdkwork-news-h5 | h5 | yes | Mobile web application with four bottom tabs. | `sdkwork-news-h5/` |
| sdkwork-news-flutter-mobile | app | yes | Native Android/iOS Flutter phone application. | `sdkwork-news-flutter-mobile/` |

## Allowed Content

- Selected language/architecture application roots with `README.md`, `AGENTS.md`, `.sdkwork/`, and `specs/` when authored packages exist.
- Architecture-local `packages/`, `config/`, `src/`, `lib/`, `App/`, or `entry/` directories required by the owning architecture standard.

## Forbidden Content

- Repository-root API contracts, generated SDK workspaces, Rust crates, or deployment descriptors moved under `apps/`.
- Runtime secrets, user-private state, generated SDK transport output, or cross-application copied business logic.

## Related Specs

- `../sdkwork-specs/APPLICATION_SPEC.md`
- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md`

## Verification

```bash
node ../sdkwork-specs/tools/check-apps-directory-index.mjs --root .
```
