# Jobs

## Purpose

`jobs/` is reserved for news-owned schedules, queue bindings, batch descriptors, and maintenance runbooks.

## Owner

The `sdkwork-news` repository owns job definitions for news capabilities when they are introduced.

## Allowed Content

- Schedules, queue bindings, batch descriptors, and job runbooks.
- References to Rust worker crates when a worker is implemented under `crates/`.

## Forbidden Content

- Rust worker implementation code.
- Runtime state, local queues, or live credentials.
- Generic scripts that belong in `scripts/` or reusable tooling that belongs in `tools/`.

## Related Specs

- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/RUST_CODE_SPEC.md`
- `../sdkwork-specs/TEST_SPEC.md`

## Verification

Check that job implementation remains in `crates/sdkwork-<domain>-<capability>-worker/` when added.
