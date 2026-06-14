# Plugins

## Purpose

`plugins/` stores news runtime or application plugin source packages when the repository authors installable extensions.

## Owner

The `sdkwork-news` repository owns plugin source placed here.

## Allowed Content

- Runtime or application plugin implementations.
- Plugin-local specs, tests, source, and manifests.

## Forbidden Content

- Repository-agent plugins, which belong in `.sdkwork/plugins/`.
- Generated SDK output.
- Vendored unrelated toolchains, runtime databases, caches, logs, or secrets.

## Related Specs

- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/COMPONENT_SPEC.md`
- `../sdkwork-specs/SECURITY_SPEC.md`

## Verification

Check plugin manifests and component specs before adding plugin source.
