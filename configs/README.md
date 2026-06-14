# Configs

## Purpose

`configs/` stores source-controlled safe config templates, schemas, profile examples, and non-secret defaults.

## Owner

The `sdkwork-news` repository owns committed news config templates.

## Allowed Content

- Config schemas.
- Safe profile examples.
- Non-secret defaults.

## Forbidden Content

- `.local` config files.
- Live secrets, access tokens, refresh tokens, private keys, or runtime user config.
- Architecture-local app surface config that belongs under `apps/<surface>/config/`.

## Related Specs

- `../sdkwork-specs/CONFIG_SPEC.md`
- `../sdkwork-specs/ENVIRONMENT_SPEC.md`
- `../sdkwork-specs/RUNTIME_DIRECTORY_SPEC.md`

## Verification

Review config additions for secret-bearing values and local override files.
