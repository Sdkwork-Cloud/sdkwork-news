# APIs

## Purpose

`apis/` is the owner-controlled API contract and materialization input workspace for `sdkwork-news`.

## Owner

The `sdkwork-news` repository owns these OpenAPI inputs before SDK generation.

## Allowed Content

- `open-api/content/news-open-api.openapi.json`
- `app-api/content/news-app-api.openapi.json`
- `backend-api/content/news-backend-api.openapi.json`
- API examples, changelogs, fixtures, and validation inputs for news-owned API surfaces.

## Forbidden Content

- Generated SDK packages or generated SDK control-plane `.sdkwork/` output.
- Rust route implementation code.
- Runtime configuration, secrets, or local override files.

## Related Specs

- `../sdkwork-specs/API_SPEC.md`
- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`

## Verification

Run `node --test sdks/test/news-workspace-standard.test.mjs`.
