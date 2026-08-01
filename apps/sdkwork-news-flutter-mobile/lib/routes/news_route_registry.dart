import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';
import 'package:sdkwork_news_flutter_mobile_shell/sdkwork_news_flutter_mobile_shell.dart';

class NewsRouteRegistry {
  const NewsRouteRegistry();

  NewsShellTab resolveTab(String routeId) {
    if (routeId == NewsRoutes.assistant.id ||
        routeId == NewsRoutes.conversation.id) {
      return NewsShellTab.assistant;
    }
    if (routeId == NewsRoutes.news.id || routeId == NewsRoutes.article.id) {
      return NewsShellTab.news;
    }
    if (routeId == NewsRoutes.store.id || routeId == NewsRoutes.storeEntry.id) {
      return NewsShellTab.store;
    }
    if (routeId == NewsRoutes.account.id ||
        routeId == NewsRoutes.accountDetail.id) {
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

  NewsArticleArgs decodeArticle(Uri uri) {
    _requirePath(uri, NewsRoutes.article.location);
    return NewsArticleArgs(
      articleId: _requiredQuery(uri, 'articleId'),
    );
  }

  AiStoreEntryArgs decodeStoreEntry(Uri uri) {
    _requirePath(uri, NewsRoutes.storeEntry.location);
    return AiStoreEntryArgs(
      entryId: _requiredQuery(uri, 'entryId'),
      kind: _requiredQuery(uri, 'kind'),
    );
  }

  AccountDetailArgs decodeAccountDetail(Uri uri) {
    _requirePath(uri, NewsRoutes.accountDetail.location);
    return AccountDetailArgs(section: _requiredQuery(uri, 'section'));
  }

  void _requirePath(Uri uri, String expected) {
    if (uri.path != expected) {
      throw FormatException('Unsupported route: ${uri.path}');
    }
  }

  String _requiredQuery(Uri uri, String name) {
    final value = uri.queryParameters[name]?.trim();
    if (value == null || value.isEmpty) {
      throw FormatException('$name is required');
    }
    return value;
  }
}
