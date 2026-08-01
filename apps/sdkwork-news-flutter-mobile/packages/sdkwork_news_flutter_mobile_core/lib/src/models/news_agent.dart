import 'reading_schedule.dart';

enum NewsAgentOutputStyle { brief, analytical, executive }

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
    this.trustedSources = const [],
    this.scopes = const [],
    this.outputStyle = NewsAgentOutputStyle.analytical,
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
  final List<String> trustedSources;
  final List<String> scopes;
  final NewsAgentOutputStyle outputStyle;
  final ReadingSchedule schedule;

  NewsAgent copyWith({
    String? name,
    String? description,
    String? conversationId,
    int? unreadCount,
    String? summary,
    List<String>? scopes,
    List<String>? trustedSources,
    ReadingSchedule? schedule,
    bool? trustedSourcesOnly,
    NewsAgentOutputStyle? outputStyle,
  }) {
    final nextName = name ?? this.name;
    return NewsAgent(
      id: id,
      code: code,
      name: nextName,
      initial: name == null ? initial : _initialFromName(nextName),
      colorValue: colorValue,
      description: description ?? this.description,
      summary: summary ?? this.summary,
      lastActivityLabel: lastActivityLabel,
      conversationId: conversationId ?? this.conversationId,
      unreadCount: unreadCount ?? this.unreadCount,
      version: version,
      trustedSourcesOnly: trustedSourcesOnly ?? this.trustedSourcesOnly,
      trustedSources: trustedSources ?? this.trustedSources,
      scopes: scopes ?? this.scopes,
      outputStyle: outputStyle ?? this.outputStyle,
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
    this.trustedSources = const [],
    this.outputStyle = NewsAgentOutputStyle.analytical,
  });

  final String name;
  final String description;
  final List<String> scopes;
  final ReadingSchedule schedule;
  final bool trustedSourcesOnly;
  final List<String> trustedSources;
  final NewsAgentOutputStyle outputStyle;
}

String _initialFromName(String name) {
  final trimmed = name.trim();
  return trimmed.isEmpty ? 'AI' : trimmed[0].toUpperCase();
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
