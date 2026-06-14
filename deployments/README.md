# Deployments

## Purpose

`deployments/` stores deployment descriptors, environment topology, packaging handoff files, and deployment runbooks.

## Owner

The `sdkwork-news` repository owns deployment descriptors for news-owned deployable artifacts.

## Allowed Content

- Docker, Kubernetes, systemd, nginx, and release handoff examples.
- Deployment runbooks and topology notes.

## Forbidden Content

- Live secrets, private keys, local overrides, or runtime user config.
- Application source code or generated SDK output.

## Related Specs

- `../sdkwork-specs/DEPLOYMENT_SPEC.md`
- `../sdkwork-specs/NGINX_SPEC.md`
- `../sdkwork-specs/RELEASE_SPEC.md`

## Verification

Review deployment additions for secret-bearing values and profile-specific release evidence.
