import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_news_flutter_mobile/bootstrap/app_config.dart';
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
      );
      expect(invalidProfile.validate, throwsArgumentError);

      const invalidEndpoint = NewsAppConfig(
        environment: 'production',
        deploymentProfile: 'cloud',
        demoMode: false,
        applicationPublicHttpUrl: 'https://news.sdkwork.com?token=secret',
        applicationPublicWebSocketUrl: 'https://news.sdkwork.com/socket',
        agentsAppApiUrl: 'https://agents.sdkwork.com/v1',
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
      expect(registry.resolveTab(NewsRoutes.store.id), NewsShellTab.store);
      expect(registry.resolveTab(NewsRoutes.account.id), NewsShellTab.account);
      expect(() => registry.resolveTab('unknown'), throwsArgumentError);
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
}
