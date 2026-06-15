# Apps

## Purpose

`apps/` contains runnable or architecture-specific application surfaces for the news product.

## Owner

The `sdkwork-news` repository owns news application surfaces and their package-local specs.

## Allowed Content

- `sdkwork-news-pc/` and future news-owned app surface roots.
- Architecture-local `packages/`, `config/`, source, and app manifests inside an app surface root.

## Forbidden Content

- Cross-repository generated SDK output.
- Root-level API contract inputs, which belong in `apis/`.
- Generic shared packages that are not tied to an app surface.

## Related Specs

- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/APPLICATION_SPEC.md`
- `../sdkwork-specs/APP_PC_ARCHITECTURE_SPEC.md`

## Verification

Run `node --test sdks/test/news-workspace-standard.test.mjs`.
