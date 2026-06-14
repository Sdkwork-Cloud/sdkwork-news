# Scripts

## Purpose

`scripts/` contains thin command entrypoints for build, verification, generation, migration, packaging, and release workflows.

## Owner

The `sdkwork-news` repository owns script entrypoints placed here.

## Allowed Content

- Thin wrappers that call canonical tools or package scripts.
- Platform-specific command entrypoints with minimal logic.

## Forbidden Content

- Reusable generator, validator, parser, migration, or operator logic; that belongs in `tools/`.
- Runtime application code.
- Secrets or local-only credentials.

## Related Specs

- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/ENGINEERING_WORKFLOW_SPEC.md`
- `../sdkwork-specs/TEST_SPEC.md`

## Verification

Check scripts delegate to canonical package, Cargo, or tool commands.
