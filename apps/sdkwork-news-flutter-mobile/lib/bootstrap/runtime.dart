import 'package:sdkwork_agents_app_sdk/sdkwork_agents_app_sdk.dart';
import 'package:sdkwork_iam_app_sdk/sdkwork_iam_app_sdk.dart' as iam_sdk;
import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';
import 'package:sdkwork_mcp_app_sdk_generated_flutter/sdkwork_mcp_app_sdk_generated_flutter.dart'
    as mcp_sdk;
import 'package:sdkwork_news_flutter_mobile_account/sdkwork_news_flutter_mobile_account.dart';
import 'package:sdkwork_news_flutter_mobile_agent_sdk_adapter/sdkwork_news_flutter_mobile_agent_sdk_adapter.dart';
import 'package:sdkwork_news_flutter_mobile_ai_store/sdkwork_news_flutter_mobile_ai_store.dart';
import 'package:sdkwork_news_flutter_mobile_assistant/sdkwork_news_flutter_mobile_assistant.dart';
import 'package:sdkwork_news_flutter_mobile_host/sdkwork_news_flutter_mobile_host.dart';
import 'package:sdkwork_news_flutter_mobile_iam_sdk_adapter/sdkwork_news_flutter_mobile_iam_sdk_adapter.dart';
import 'package:sdkwork_news_flutter_mobile_im_adapter/sdkwork_news_flutter_mobile_im_adapter.dart';
import 'package:sdkwork_news_flutter_mobile_mcp_sdk_adapter/sdkwork_news_flutter_mobile_mcp_sdk_adapter.dart';
import 'package:sdkwork_news_flutter_mobile_news/sdkwork_news_flutter_mobile_news.dart';
import 'package:sdkwork_news_flutter_mobile_shell/sdkwork_news_flutter_mobile_shell.dart';

import 'app_config.dart';

class NewsRuntime {
  NewsRuntime({
    required this.shellController,
    required this.assistantController,
    required this.newsController,
    required this.storeController,
    required this.accountController,
    this.requiresSignIn = false,
    this.demoMode = false,
  });

  NewsRuntime.signedOut()
      : shellController = null,
        assistantController = null,
        newsController = null,
        storeController = null,
        accountController = null,
        requiresSignIn = true,
        demoMode = false;

  final NewsShellController? shellController;
  final AssistantController? assistantController;
  final NewsFeedController? newsController;
  final AiStoreController? storeController;
  final AccountController? accountController;
  final bool requiresSignIn;
  final bool demoMode;

  factory NewsRuntime.demo() => NewsRuntime(
        shellController: NewsShellController(),
        assistantController: AssistantController(
          agentRepository: DemoNewsAgentRepository(),
          conversationGateway: DemoNewsConversationGateway(),
        ),
        newsController: NewsFeedController(DemoNewsFeedRepository()),
        storeController: AiStoreController(DemoAiStoreRepository()),
        accountController: AccountController(
          DemoAccountRepository(),
          preferencesRepository: MemoryAccountPreferencesRepository(
            const AccountPreferences.demo(),
          ),
        ),
        demoMode: true,
      );

  void dispose() {
    shellController?.dispose();
    assistantController?.dispose();
    newsController?.dispose();
    storeController?.dispose();
    accountController?.dispose();
  }
}

Future<NewsRuntime> bootstrapNewsRuntime({
  NewsAppConfig? config,
  NewsSessionStore? sessionStore,
}) async {
  final activeConfig = config ?? NewsAppConfig.fromEnvironment();
  if (activeConfig.demoMode) {
    return NewsRuntime.demo();
  }

  final store = sessionStore ?? const SecureNewsSessionStore();
  final session = await store.read();
  if (session == null) {
    return NewsRuntime.signedOut();
  }

  final agentsClient = SdkworkAppClient.withBaseUrl(
    baseUrl: _transportBaseUrl(activeConfig.agentsAppApiUrl),
    accessToken: session.accessToken,
    authToken: session.authToken,
  );
  final imBundle = createImSdkClient(
    applicationPublicHttpUrl: activeConfig.applicationPublicHttpUrl,
    applicationPublicWebSocketUrl:
        activeConfig.applicationPublicWebSocketUrl.isEmpty
            ? null
            : activeConfig.applicationPublicWebSocketUrl,
    accessToken: session.accessToken,
    authToken: session.authToken,
  );
  final iamClient = iam_sdk.SdkworkAppClient.withBaseUrl(
    baseUrl: _transportBaseUrl(activeConfig.iamAppApiUrl),
    accessToken: session.accessToken,
    authToken: session.authToken,
  );
  final mcpClient = mcp_sdk.SdkworkAppClient.withBaseUrl(
    baseUrl: _transportBaseUrl(activeConfig.mcpAppApiUrl),
    accessToken: session.accessToken,
    authToken: session.authToken,
  );
  return NewsRuntime(
    shellController: NewsShellController(),
    assistantController: AssistantController(
      agentRepository: AgentsNewsAgentRepository(agentsClient),
      conversationGateway: SdkworkImNewsConversationGateway(imBundle),
    ),
    newsController: NewsFeedController(const UnavailableNewsFeedRepository()),
    storeController: AiStoreController(
      McpAiStoreRepository(SdkworkMcpCatalogGateway(mcpClient)),
    ),
    accountController: AccountController(
      IamAccountRepository(SdkworkIamCurrentUserGateway(iamClient)),
      preferencesRepository: const SecureAccountPreferencesRepository(),
    ),
  );
}

String _transportBaseUrl(String appApiUrl) {
  final uri = Uri.parse(appApiUrl);
  const suffix = '/app/v3/api';
  final path = uri.path.substring(0, uri.path.length - suffix.length);
  return uri.replace(path: path).toString().replaceFirst(RegExp(r'/+$'), '');
}
