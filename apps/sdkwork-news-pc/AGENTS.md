# Repository Guidelines

Read `../../AGENTS.md` first and resolve all standards through `../../../sdkwork-specs/`. This root owns the PC client composition, browser host, feature packages, and public application identity.

Read `sdkwork.app.config.json` for identity and release metadata, `specs/component.spec.json` for local ownership, and `etc/sdkwork.deployment.config.json` for parent deployment delegation. Runtime values belong to materialized environment files, not the application manifest.

For TypeScript and UI changes, load `CODE_STYLE_SPEC.md`, `NAMING_SPEC.md`, `TYPESCRIPT_CODE_SPEC.md`, `FRONTEND_CODE_SPEC.md`, `FRONTEND_SPEC.md`, `UI_ARCHITECTURE_SPEC.md`, and `APP_PC_ARCHITECTURE_SPEC.md`. Consume Agents and IM only through their public composed SDKs and application-owned adapters. Do not introduce raw HTTP, manual authorization headers, generated transport imports, private sibling source imports, or a second global navigation rail.

Verify scoped work with `pnpm build` and the package tests. Run repository SDK consumer, pagination, and manifest checks when their corresponding contracts change. Human review remains required for public naming, security, migrations, production deployment, generated SDK ownership, or destructive operations.
