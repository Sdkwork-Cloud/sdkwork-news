# Tools

## Purpose

`tools/` contains reusable repository-local generators, validators, migration helpers, and operator utilities.

## Owner

The `sdkwork-news` repository owns the news OpenAPI, SDK, schema, and validation tools stored here.

## Allowed Content

- OpenAPI export and SDK generation orchestration.
- Schema quality gates.
- Reusable validation, migration, and operator utilities.

## Forbidden Content

- Runtime application code.
- Thin command wrappers that belong in `scripts/`.
- Generated SDK transport output.

## Related Specs

- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/TYPESCRIPT_CODE_SPEC.md`
- `../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`

## Verification

Run `pnpm sdk:check`.
