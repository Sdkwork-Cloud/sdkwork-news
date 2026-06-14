# SDKWork News PC Application

This is the SDKWork News PC application root.

## Directory Structure

- `.sdkwork/`: SDKWork workspace metadata
- `bin/`: Cross-platform operational scripts
- `config/`: Checked-in non-secret config templates
- `docs/`: App architecture notes, runbooks, release notes
- `public/`: Browser-served static assets
- `scripts/`: Build, validation, generation, migration utilities
- `sdks/`: Application-root SDK workspaces and generator inputs
- `specs/`: Local component/application specs
- `src/`: Root shell entry and composition boundary
- `packages/`: Reusable runtime, shell, app, console, admin, and native host packages
- `tests/`: Application-level integration, runtime, route, package-boundary, and architecture verification tests

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm test
```
