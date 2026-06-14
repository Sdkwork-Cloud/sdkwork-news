# SDKs

## Purpose

`sdks/` contains SDK family workspaces, generation manifests, generated language outputs, and SDK verification tests.

## Owner

The `sdkwork-news` repository owns the news public, app, and backend SDK families.

## Allowed Content

- `sdkwork-news-sdk/`
- `sdkwork-news-app-sdk/`
- `sdkwork-news-backend-sdk/`
- SDK manifests, assembly manifests, generated SDK output, and SDK-family tests.

## Forbidden Content

- Author-owned API source inputs; those belong in `apis/`.
- Hand-authored edits inside generated transport output.
- Runtime secrets, tokens, or local environment overrides.

## Related Specs

- `../sdkwork-specs/SDK_SPEC.md`
- `../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`
- `../sdkwork-specs/API_SPEC.md`

## Verification

Run `pnpm sdk:check`.
