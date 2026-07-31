class NewsRoute<TArgs, TResult> {
  const NewsRoute({
    required this.id,
    required this.titleKey,
    required this.location,
    this.permissionHint,
  });

  final String id;
  final String titleKey;
  final String location;
  final String? permissionHint;
}

class AgentConversationArgs {
  const AgentConversationArgs({required this.agentId});

  final String agentId;
}

abstract final class NewsRoutes {
  static const assistant = NewsRoute<void, void>(
    id: 'app.news.assistant.home',
    titleKey: 'nav.assistant',
    location: '/assistant',
  );
  static const conversation = NewsRoute<AgentConversationArgs, void>(
    id: 'app.news.assistant.conversation',
    titleKey: 'assistant.conversation',
    location: '/assistant/conversation',
  );
  static const news = NewsRoute<void, void>(
    id: 'app.news.feed.home',
    titleKey: 'nav.news',
    location: '/news',
  );
  static const store = NewsRoute<void, void>(
    id: 'app.news.store.home',
    titleKey: 'nav.store',
    location: '/store',
  );
  static const account = NewsRoute<void, void>(
    id: 'app.news.account.home',
    titleKey: 'nav.account',
    location: '/account',
  );

  static const all = [assistant, conversation, news, store, account];
}
