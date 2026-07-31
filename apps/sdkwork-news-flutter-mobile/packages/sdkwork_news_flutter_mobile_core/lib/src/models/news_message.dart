enum NewsMessageRole { user, agent, system }

class NewsMessage {
  const NewsMessage({
    required this.id,
    required this.conversationId,
    required this.role,
    required this.text,
    required this.occurredAt,
    this.sequence = 0,
    this.streaming = false,
  });

  final String id;
  final String conversationId;
  final NewsMessageRole role;
  final String text;
  final DateTime occurredAt;
  final int sequence;
  final bool streaming;
}

class NewsMessagePage {
  const NewsMessagePage({
    required this.items,
    this.nextCursor,
    this.hasMore = false,
  });

  final List<NewsMessage> items;
  final String? nextCursor;
  final bool hasMore;
}
