# Repository Guidelines

Read `../../AGENTS.md` first and resolve standards through `../../../sdkwork-specs/`. This root owns the H5 shell and its Assistant, News, AI Store, and Account packages.

Use `sdkwork.app.config.json` only for application identity and release metadata. Use `specs/component.spec.json` for ownership and `etc/sdkwork.deployment.config.json` for parent deployment delegation. Consume Agents and IM through public composed SDKs and the news adapters; do not add raw HTTP, manual auth headers, private sibling source imports, or client-side full-list pagination.

For UI changes, load the TypeScript/frontend standards plus `APP_H5_ARCHITECTURE_SPEC.md`. Verify with `pnpm build`, scoped tests, responsive browser QA, and repository SDK/pagination checks when those contracts change. Human review is required for public naming, security, migrations, production deployment, generated SDK ownership, and destructive operations.
