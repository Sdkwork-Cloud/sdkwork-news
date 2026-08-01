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

class NewsArticleArgs {
  const NewsArticleArgs({required this.articleId});

  final String articleId;
}

class AiStoreEntryArgs {
  const AiStoreEntryArgs({required this.entryId, required this.kind});

  final String entryId;
  final String kind;
}

class AccountDetailArgs {
  const AccountDetailArgs({required this.section});

  final String section;
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
  static const article = NewsRoute<NewsArticleArgs, void>(
    id: 'app.news.feed.article',
    titleKey: 'news.detail',
    location: '/news/article',
  );
  static const store = NewsRoute<void, void>(
    id: 'app.news.store.home',
    titleKey: 'nav.store',
    location: '/store',
  );
  static const storeEntry = NewsRoute<AiStoreEntryArgs, void>(
    id: 'app.news.store.entry',
    titleKey: 'store.detail',
    location: '/store/entry',
  );
  static const account = NewsRoute<void, void>(
    id: 'app.news.account.home',
    titleKey: 'nav.account',
    location: '/account',
  );
  static const accountDetail = NewsRoute<AccountDetailArgs, void>(
    id: 'app.news.account.detail',
    titleKey: 'account.title',
    location: '/account/detail',
  );

  static const all = [
    assistant,
    conversation,
    news,
    article,
    store,
    storeEntry,
    account,
    accountDetail,
  ];
}
