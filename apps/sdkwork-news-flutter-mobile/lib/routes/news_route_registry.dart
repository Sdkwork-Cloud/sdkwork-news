import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';
import 'package:sdkwork_news_flutter_mobile_shell/sdkwork_news_flutter_mobile_shell.dart';

class NewsRouteRegistry {
  const NewsRouteRegistry();

  NewsShellTab resolveTab(String routeId) {
    if (routeId == NewsRoutes.assistant.id ||
        routeId == NewsRoutes.conversation.id) {
      return NewsShellTab.assistant;
    }
    if (routeId == NewsRoutes.news.id) {
      return NewsShellTab.news;
    }
    if (routeId == NewsRoutes.store.id) {
      return NewsShellTab.store;
    }
    if (routeId == NewsRoutes.account.id) {
      return NewsShellTab.account;
    }
    throw ArgumentError.value(routeId, 'routeId', 'Unknown route id');
  }

  AgentConversationArgs decodeConversation(Uri uri) {
    if (uri.path != NewsRoutes.conversation.location) {
      throw FormatException('Unsupported conversation route: ${uri.path}');
    }
    final agentId = uri.queryParameters['agentId']?.trim();
    if (agentId == null || agentId.isEmpty) {
      throw const FormatException('agentId is required');
    }
    return AgentConversationArgs(agentId: agentId);
  }
}
