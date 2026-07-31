# Repository Guidelines

Read `../../AGENTS.md` first and resolve standards through `../../../sdkwork-specs/`. This is a native Flutter phone application root; Flutter web exists only as a QA target and must not become the mobile delivery architecture.

Use `sdkwork.app.config.json` for identity and release metadata, `specs/component.spec.json` for ownership, and `etc/sdkwork.deployment.config.json` for parent deployment delegation. The root composes packages and SDK adapters; feature packages depend on typed ports and controllers. Consume public Agents and IM Flutter packages only. WebView delivery, raw HTTP, manual auth headers, private sibling `src/**` imports, local SDK forks, and copied IM state are forbidden.

Load the Dart/frontend standards plus `FLUTTER_APP_MOBILE_ARCHITECTURE_SPEC.md`, `APP_CLIENT_ARCHITECTURE_ALIGNMENT_SPEC.md`, and `APP_SDK_INTEGRATION_SPEC.md` for implementation changes. Verify with `flutter analyze`, `flutter test`, `dart test`, native builds where the host permits, and responsive visual QA. Human review is required for public naming, security, migrations, production deployment, generated SDK ownership, and destructive operations.
