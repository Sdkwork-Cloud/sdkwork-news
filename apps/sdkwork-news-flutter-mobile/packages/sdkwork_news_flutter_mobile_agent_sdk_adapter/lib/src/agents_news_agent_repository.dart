import 'package:sdkwork_agents_app_sdk/sdkwork_agents_app_sdk.dart';
import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';

import 'news_agent_manifest_codec.dart';

class AgentsNewsAgentRepository implements NewsAgentRepository {
  AgentsNewsAgentRepository(this._client);

  final SdkworkAppClient _client;

  @override
  Future<NewsAgentPage> list({
    String? cursor,
    int pageSize = 20,
    String? query,
  }) async {
    final normalizedPageSize = normalizeNewsPageSize(pageSize);
    final page = int.tryParse(cursor ?? '') ?? 1;
    final response = await _client.ai.agentsList(
      false,
      null,
      page,
      normalizedPageSize,
      query,
    );
    final data = _asMap(response?.data);
    final records = _asList(data?['items'])
        .map(_asMap)
        .whereType<Map<String, dynamic>>()
        .map(AgentRecord.fromJson)
        .where((record) =>
            record.manifest['kind'] == newsReaderAgentManifestKind)
        .map(_fromRecord)
        .toList(growable: false);
    final pageInfo = _asMap(data?['pageInfo']);
    final hasMore = pageInfo?['hasMore'] == true ||
        ((pageInfo?['totalPages'] as num?)?.toInt() ?? page) > page;
    return NewsAgentPage(
      items: records,
      hasMore: hasMore,
      nextCursor: hasMore ? '${page + 1}' : null,
    );
  }

  @override
  Future<NewsAgent> create(NewsAgentDraft draft) async {
    final now = DateTime.now().toUtc();
    final id = 'news-reader-${now.microsecondsSinceEpoch}';
    final response = await _client.ai.agentsCreate(
      CreateAgentRequest(
        agentId: id,
        code: _slug(draft.name, id),
        displayName: draft.name.trim(),
        description: draft.description.trim(),
        manifest: NewsAgentManifestCodec.fromDraft(draft),
        managementProfile: AgentManagementProfile(
          type: 'news-reader',
          memoryEnabled: true,
        ),
        implementationKind: 'managed-agent',
        implementationType: 'AGENT',
        visibility: 'private',
        tags: const ['news-reader'],
        requestedAt: now.toIso8601String(),
      ),
    );
    return _fromRecord(_readAgentRecord(response?.data));
  }

  @override
  Future<NewsAgent> linkConversation(
    NewsAgent agent,
    String conversationId,
  ) {
    final updated = agent.copyWith(conversationId: conversationId);
    return _update(
      agent,
      updated,
    );
  }

  @override
  Future<NewsAgent> update(
    NewsAgent current,
    NewsAgent updated,
  ) {
    return _update(current, updated);
  }

  Future<NewsAgent> _update(NewsAgent current, NewsAgent updated) async {
    final response = await _client.ai.agentsUpdate(
      current.id,
      UpdateAgentRequest(
        displayName: updated.name,
        description: updated.description,
        manifest: NewsAgentManifestCodec.fromAgent(
          updated,
          conversationId: updated.conversationId,
        ),
        expectedVersion: current.version,
        requestedAt: DateTime.now().toUtc().toIso8601String(),
      ),
    );
    return _fromRecord(_readAgentRecord(response?.data));
  }
}

AgentRecord _readAgentRecord(dynamic data) {
  final map = _asMap(data);
  final item = _asMap(map?['item']) ?? map;
  if (item == null) {
    throw const FormatException('Agents SDK response is missing data.item');
  }
  return AgentRecord.fromJson(item);
}

NewsAgent _fromRecord(AgentRecord record) {
  final news = _asMap(record.manifest['newsReader']) ??
      _asMap(record.manifest['news']) ??
      const {};
  final readingScope = _asMap(news['readingScope']) ?? const {};
  final categories = _asList(readingScope['categories'])
      .map((item) => '$item')
      .toList(growable: false);
  final keywords = _asList(readingScope['keywords'])
      .map((item) => '$item')
      .toList(growable: false);
  final legacyScopes =
      _asList(news['scopes']).map((item) => '$item').toList(growable: false);
  final trustedSources = _asList(readingScope['trustedSources']).isNotEmpty
      ? _asList(readingScope['trustedSources'])
          .map((item) => '$item')
          .toList(growable: false)
      : _asList(news['trustedSources'])
          .map((item) => '$item')
          .toList(growable: false);
  final color = record.managementProfile?.color ??
      news['accent']?.toString() ??
      news['color']?.toString();
  return NewsAgent(
    id: record.agentId,
    code: record.code,
    name: record.displayName,
    initial: _initial(record.displayName),
    colorValue: _parseColor(color),
    description: record.description ?? '',
    summary: news['lastDigestSummary']?.toString() ??
        news['lastSummary']?.toString() ??
        '',
    lastActivityLabel: news['lastActivityLabel']?.toString() ?? '',
    conversationId: news['conversationId']?.toString(),
    unreadCount: (news['unreadCount'] as num?)?.toInt() ?? 0,
    version: record.version,
    trustedSourcesOnly: news['trustedSourcesOnly'] != false,
    trustedSources: trustedSources,
    scopes: categories.isEmpty && keywords.isEmpty
        ? legacyScopes
        : {...categories, ...keywords}.toList(growable: false),
    outputStyle: _readOutputStyle(news['tone'] ?? news['outputStyle']),
    schedule: ReadingSchedule.fromJson(_asMap(news['schedule'])),
  );
}

String _initial(String name) {
  final trimmed = name.trim();
  return trimmed.isEmpty ? 'AI' : trimmed[0].toUpperCase();
}

String _slug(String name, String fallback) {
  final slug = name
      .trim()
      .toLowerCase()
      .replaceAll(RegExp(r'[^a-z0-9]+'), '-')
      .replaceAll(RegExp(r'^-+|-+$'), '');
  return slug.isEmpty ? fallback : slug;
}

int _parseColor(String? value) {
  final normalized = value?.replaceFirst('#', '');
  final parsed = int.tryParse(normalized ?? '', radix: 16);
  if (parsed == null) {
    return 0xFF08775A;
  }
  return normalized!.length == 6 ? 0xFF000000 | parsed : parsed;
}

Map<String, dynamic>? _asMap(dynamic value) {
  if (value is Map<String, dynamic>) {
    return value;
  }
  if (value is Map) {
    return value.map((key, item) => MapEntry('$key', item));
  }
  return null;
}

List<dynamic> _asList(dynamic value) => value is List ? value : const [];

NewsAgentOutputStyle _readOutputStyle(dynamic value) {
  return NewsAgentOutputStyle.values.firstWhere(
    (style) => style.name == value,
    orElse: () => NewsAgentOutputStyle.analytical,
  );
}
