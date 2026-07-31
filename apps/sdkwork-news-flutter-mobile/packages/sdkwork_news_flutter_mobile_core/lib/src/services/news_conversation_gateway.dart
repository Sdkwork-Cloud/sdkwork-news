import '../models/news_agent.dart';
import '../models/news_message.dart';

abstract interface class NewsConversationGateway {
  Future<String> ensureConversation(NewsAgent agent);

  Future<NewsMessagePage> loadMessages(
    String conversationId, {
    String? cursor,
    int pageSize = 50,
  });

  Stream<NewsMessage> watchMessages(String conversationId);

  Future<NewsMessage> sendText(String conversationId, String text);

  Future<void> markRead(String conversationId, int sequence);

  Future<void> dispose();
}
