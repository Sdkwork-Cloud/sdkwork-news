# Tests

## Purpose

`tests/` contains cross-package, contract, integration, end-to-end, fixture, and static verification inputs.

## Owner

The `sdkwork-news` repository owns root-level cross-boundary test assets.

## Allowed Content

- Contract, integration, e2e, static, and fixture test assets.
- Cross-package test data that does not belong to a single crate or package.

## Forbidden Content

- Package-local unit tests that belong beside the package or crate.
- Real secrets, tokens, private customer data, or runtime state.
- Generated SDK transport output.

## Related Specs

- `../sdkwork-specs/TEST_SPEC.md`
- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/SECURITY_SPEC.md`

## Verification

Run `pnpm verify` for cross-boundary verification.
