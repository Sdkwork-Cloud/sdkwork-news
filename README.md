# sdkwork-news

SDKWork news domain workspace.

This repository owns news contracts, open/app/backend API surfaces, SDK generation inputs, Rust service and SQLx repository crates, route metadata crates, and PC React news workspace logic.

## Project Structure

- `apis/`: authored and materialized News OpenAPI inputs for open-api, app-api, and backend-api surfaces.
- `apps/`: PC News app-surface packages.
- `crates/`: Rust service, repository-sqlx, and route crates.
- `sdks/`: generated SDK family workspaces and SDK ownership manifests.
- `jobs/`: job definitions and schedules when News background processing is added.
- `tools/`: deterministic OpenAPI, SDK, and schema validation tooling.
- `plugins/`: runtime/application plugins owned by this repository when added.
- `examples/`: runnable or copyable API/SDK examples.
- `configs/`: safe checked-in config templates and schemas.
- `deployments/`: deployment descriptors and release handoff docs.
- `scripts/`: thin build, verification, generation, and migration entrypoints.
- `docs/`: architecture notes, plans, and runbooks.
- `tests/`: cross-package/static/integration verification fixtures.

## Rust Crate Responsibilities

- `crates/sdkwork-content-news-service`: News business service contracts, domain models, and use-case rules.
- `crates/sdkwork-content-news-repository-sqlx`: SQLx persistence, migrations, table catalog, and repository implementation contracts.
- `crates/sdkwork-routes-news-open-api`: News open-api route metadata.
- `crates/sdkwork-routes-news-app-api`: News app-api route metadata.
- `crates/sdkwork-routes-news-backend-api`: News backend-api route metadata.

## SDKWork Documentation Contract

Domain: content
Capability: news-workspace
Package type: rust-crate
Status: standard

### Public API

Public exports are declared in `specs/component.spec.json` under `contracts.publicExports`.

### Required SDK Surface

- None declared in `specs/component.spec.json`.

### Configuration

Configuration keys and runtime entrypoints are declared in `specs/component.spec.json`.

### SaaS/Private/Local Behavior

This module follows the canonical standards linked from `specs/component.spec.json`, including deployment and runtime configuration rules where applicable.

### Security

Do not add secrets, live tokens, manual auth headers, or app-local credential handling to this module.

### Extension Points

Extension points are limited to declared public exports, runtime entrypoints, SDK clients, events, and config keys.

### Verification

- `pnpm typecheck`

### Owner And Status

Owner and lifecycle status are tracked in `specs/component.spec.json`.

## Documentation Canon

- [docs/README.md](docs/README.md)
- [docs/product/prd/PRD.md](docs/product/prd/PRD.md)
- [docs/architecture/tech/TECH_ARCHITECTURE.md](docs/architecture/tech/TECH_ARCHITECTURE.md)

## Application Roots

- [apps directory index](apps/README.md)
