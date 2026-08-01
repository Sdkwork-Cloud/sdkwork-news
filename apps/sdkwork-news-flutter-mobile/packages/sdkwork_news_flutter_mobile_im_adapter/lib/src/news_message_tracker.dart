import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';

class NewsMessageTracker {
  final Set<(String, String)> _seenMessages = {};

  void track(String conversationId, Iterable<NewsMessage> messages) {
    for (final message in messages) {
      _seenMessages.add((conversationId, message.id));
    }
  }

  List<NewsMessage> takeUnseen(
    String conversationId,
    Iterable<NewsMessage> messages,
  ) {
    final unseen = <NewsMessage>[];
    for (final message in messages) {
      if (_seenMessages.add((conversationId, message.id))) {
        unseen.add(message);
      }
    }
    return unseen;
  }

  void clear() {
    _seenMessages.clear();
  }
}
