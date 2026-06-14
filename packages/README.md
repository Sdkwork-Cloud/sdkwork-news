# Packages

## Purpose

`packages/` is an existing shared TypeScript package-family collection for news runtime, contracts, services, and SDK ports.

## Owner

The `sdkwork-news` repository owns these shared TypeScript package families.

## Allowed Content

- `packages/common/news/*` shared TypeScript packages that are governed by package-local specs.
- Package-local source, tests, and component specs.

## Forbidden Content

- Treating `packages/` as a replacement for standard root directories such as `apis/`, `sdks/`, `crates/`, or `apps/`.
- Generated SDK transport output.
- Runtime config, deployment descriptors, or scripts that belong in standard root directories.

## Related Specs

- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/TYPESCRIPT_CODE_SPEC.md`
- `../sdkwork-specs/COMPONENT_SPEC.md`

## Verification

Run `pnpm test:vitest` for package-local TypeScript verification.
