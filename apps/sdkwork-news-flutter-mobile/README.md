# SDKWork News Flutter Mobile

Native Flutter client for the SDKWork News AI-assisted reading product. The
mobile shell exposes Assistant, News, AI Store, and Account as independent
feature packages.

## Architecture

- `sdkwork_news_flutter_mobile_assistant` owns assistant presentation and state.
- `sdkwork_news_flutter_mobile_agent_sdk_adapter` maps the Agents App SDK to the news agent port.
- `sdkwork_news_flutter_mobile_im_adapter` maps SDKWork IM chat and realtime packages to the conversation port.
- `sdkwork_news_flutter_mobile_mcp_sdk_adapter` maps the MCP App SDK catalog to the AI Store port.
- `sdkwork_news_flutter_mobile_iam_sdk_adapter` maps IAM current-user identity to the Account port.
- `sdkwork_news_flutter_mobile_news`, `ai_store`, and `account` own their feature UI and repository contracts.
- `lib/bootstrap/runtime.dart` is the composition root; feature packages do not construct SDK clients.

Production mode fails closed unless the Agents, IM, IAM, and MCP application
URLs are provided. Missing News, AppStore, and Skills Flutter SDK capabilities
render explicit unavailable states; production never falls back to demo data.
Demo mode is intended only for development, tests, and visual QA.

## Development

```bash
flutter pub get
flutter analyze
flutter test
flutter run --dart-define-from-file=config/app/runtime-env.development.example.json
```

Build the web preview used for cross-client parity review:

```bash
flutter build web --release --dart-define-from-file=config/app/runtime-env.development.example.json
```

For a production build, supply an approved dart-define JSON document with
`SDKWORK_NEWS_DEMO_MODE=false`, `SDKWORK_APPLICATION_PUBLIC_HTTP_URL`, optional
`SDKWORK_APPLICATION_PUBLIC_WEBSOCKET_URL`, `SDKWORK_AGENTS_APP_API_URL`,
`SDKWORK_IAM_APP_API_URL`, and `SDKWORK_MCP_APP_API_URL`. Do not commit
credentials or tokens to configuration files.

See [the conversion record](../../../docs/quality/flutter/CONVERSION_RECORD.md)
for parity evidence, dependency provenance, and current release limitations.
