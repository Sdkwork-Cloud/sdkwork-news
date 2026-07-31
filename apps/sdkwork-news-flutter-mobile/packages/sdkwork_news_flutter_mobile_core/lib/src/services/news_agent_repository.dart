import '../models/news_agent.dart';

abstract interface class NewsAgentRepository {
  Future<NewsAgentPage> list({
    String? cursor,
    int pageSize = 20,
    String? query,
  });

  Future<NewsAgent> create(NewsAgentDraft draft);

  Future<NewsAgent> updateSchedule(
    NewsAgent agent,
    NewsAgent updated,
  );

  Future<NewsAgent> linkConversation(
    NewsAgent agent,
    String conversationId,
  );
}

int normalizeNewsPageSize(int pageSize) {
  if (pageSize <= 0) {
    return 20;
  }
  return pageSize > 200 ? 200 : pageSize;
}
