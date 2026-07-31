import 'reading_schedule.dart';

class NewsAgent {
  const NewsAgent({
    required this.id,
    required this.code,
    required this.name,
    required this.initial,
    required this.colorValue,
    required this.description,
    required this.summary,
    required this.lastActivityLabel,
    required this.schedule,
    this.conversationId,
    this.unreadCount = 0,
    this.version,
    this.trustedSourcesOnly = true,
    this.scopes = const [],
  });

  final String id;
  final String code;
  final String name;
  final String initial;
  final int colorValue;
  final String description;
  final String summary;
  final String lastActivityLabel;
  final String? conversationId;
  final int unreadCount;
  final String? version;
  final bool trustedSourcesOnly;
  final List<String> scopes;
  final ReadingSchedule schedule;

  NewsAgent copyWith({
    String? conversationId,
    int? unreadCount,
    String? summary,
    ReadingSchedule? schedule,
    bool? trustedSourcesOnly,
  }) {
    return NewsAgent(
      id: id,
      code: code,
      name: name,
      initial: initial,
      colorValue: colorValue,
      description: description,
      summary: summary ?? this.summary,
      lastActivityLabel: lastActivityLabel,
      conversationId: conversationId ?? this.conversationId,
      unreadCount: unreadCount ?? this.unreadCount,
      version: version,
      trustedSourcesOnly: trustedSourcesOnly ?? this.trustedSourcesOnly,
      scopes: scopes,
      schedule: schedule ?? this.schedule,
    );
  }
}

class NewsAgentDraft {
  const NewsAgentDraft({
    required this.name,
    required this.description,
    required this.scopes,
    required this.schedule,
    this.trustedSourcesOnly = true,
  });

  final String name;
  final String description;
  final List<String> scopes;
  final ReadingSchedule schedule;
  final bool trustedSourcesOnly;
}

class NewsAgentPage {
  const NewsAgentPage({
    required this.items,
    this.nextCursor,
    this.hasMore = false,
  });

  final List<NewsAgent> items;
  final String? nextCursor;
  final bool hasMore;
}
