import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_news_flutter_mobile/bootstrap/app_config.dart';
import 'package:sdkwork_news_flutter_mobile/bootstrap/runtime.dart';
import 'package:sdkwork_news_flutter_mobile/routes/news_route_registry.dart';
import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';
import 'package:sdkwork_news_flutter_mobile_shell/sdkwork_news_flutter_mobile_shell.dart';

void main() {
  group('application configuration', () {
    test('accepts production SDK endpoints', () {
      const config = NewsAppConfig(
        environment: 'production',
        deploymentProfile: 'cloud',
        demoMode: false,
        applicationPublicHttpUrl: 'https://news.sdkwork.com',
        applicationPublicWebSocketUrl: 'wss://news.sdkwork.com',
        agentsAppApiUrl: 'https://agents.sdkwork.com/app/v3/api',
        iamAppApiUrl: 'https://iam.sdkwork.com/app/v3/api',
        mcpAppApiUrl: 'https://mcp.sdkwork.com/app/v3/api',
      );
      expect(config.validate, returnsNormally);
    });

    test('rejects invalid profiles and malformed SDK endpoints', () {
      const invalidProfile = NewsAppConfig(
        environment: 'production',
        deploymentProfile: 'desktop',
        demoMode: true,
        applicationPublicHttpUrl: '',
        applicationPublicWebSocketUrl: '',
        agentsAppApiUrl: '',
        iamAppApiUrl: '',
        mcpAppApiUrl: '',
      );
      expect(invalidProfile.validate, throwsArgumentError);

      const invalidEndpoint = NewsAppConfig(
        environment: 'production',
        deploymentProfile: 'cloud',
        demoMode: false,
        applicationPublicHttpUrl: 'https://news.sdkwork.com?token=secret',
        applicationPublicWebSocketUrl: 'https://news.sdkwork.com/socket',
        agentsAppApiUrl: 'https://agents.sdkwork.com/v1',
        iamAppApiUrl: 'https://iam.sdkwork.com/app/v3/api',
        mcpAppApiUrl: 'https://mcp.sdkwork.com/app/v3/api',
      );
      expect(invalidEndpoint.validate, throwsArgumentError);
    });
  });

  group('route registry', () {
    const registry = NewsRouteRegistry();

    test('maps typed route ids to the expected shell tabs', () {
      expect(
          registry.resolveTab(NewsRoutes.assistant.id), NewsShellTab.assistant);
      expect(registry.resolveTab(NewsRoutes.conversation.id),
          NewsShellTab.assistant);
      expect(registry.resolveTab(NewsRoutes.news.id), NewsShellTab.news);
      expect(registry.resolveTab(NewsRoutes.article.id), NewsShellTab.news);
      expect(registry.resolveTab(NewsRoutes.store.id), NewsShellTab.store);
      expect(registry.resolveTab(NewsRoutes.storeEntry.id), NewsShellTab.store);
      expect(registry.resolveTab(NewsRoutes.account.id), NewsShellTab.account);
      expect(
        registry.resolveTab(NewsRoutes.accountDetail.id),
        NewsShellTab.account,
      );
      expect(() => registry.resolveTab('unknown'), throwsArgumentError);
    });

    test('decodes typed feature detail links and rejects missing ids', () {
      expect(
        registry
            .decodeArticle(Uri.parse('/news/article?articleId=story-1'))
            .articleId,
        'story-1',
      );
      final entry = registry.decodeStoreEntry(
        Uri.parse('/store/entry?entryId=skill-1&kind=skill'),
      );
      expect(entry.entryId, 'skill-1');
      expect(entry.kind, 'skill');
      expect(
        registry
            .decodeAccountDetail(
              Uri.parse('/account/detail?section=notifications'),
            )
            .section,
        'notifications',
      );
      expect(
        () => registry.decodeArticle(Uri.parse('/news/article')),
        throwsFormatException,
      );
      expect(
        () => registry.decodeStoreEntry(
          Uri.parse('/store/entry?entryId=skill-1'),
        ),
        throwsFormatException,
      );
    });

    test('requires a non-empty agent id on conversation deep links', () {
      final args = registry.decodeConversation(
        Uri.parse('/assistant/conversation?agentId=market-radar'),
      );
      expect(args.agentId, 'market-radar');
      expect(
        () => registry.decodeConversation(Uri.parse('/assistant/conversation')),
        throwsFormatException,
      );
      expect(
        () => registry
            .decodeConversation(Uri.parse('/news?agentId=market-radar')),
        throwsFormatException,
      );
    });
  });

  test('signed-out production runtime does not construct demo controllers', () {
    final runtime = NewsRuntime.signedOut();

    expect(runtime.requiresSignIn, isTrue);
    expect(runtime.shellController, isNull);
    expect(runtime.assistantController, isNull);
    expect(runtime.newsController, isNull);
    expect(runtime.storeController, isNull);
    expect(runtime.accountController, isNull);
  });
}
