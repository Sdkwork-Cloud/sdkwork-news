import 'package:sdkwork_mcp_app_sdk_generated_flutter/sdkwork_mcp_app_sdk_generated_flutter.dart'
    as mcp_sdk;
import 'package:sdkwork_news_flutter_mobile_ai_store/sdkwork_news_flutter_mobile_ai_store.dart';

class McpCatalogRecord {
  const McpCatalogRecord({
    required this.id,
    required this.key,
    required this.name,
    required this.transport,
    required this.lifecycleStatus,
    required this.healthStatus,
    this.description,
    this.categoryCode,
  });

  final String id;
  final String key;
  final String name;
  final String transport;
  final String lifecycleStatus;
  final String healthStatus;
  final String? description;
  final String? categoryCode;
}

class McpCatalogPage {
  const McpCatalogPage({
    required this.items,
    required this.hasMore,
    this.nextCursor,
  });

  final List<McpCatalogRecord> items;
  final bool hasMore;
  final String? nextCursor;
}

abstract interface class McpCatalogGateway {
  Future<McpCatalogPage> listServers({
    String? cursor,
    int pageSize = 20,
    String? query,
  });
}

class SdkworkMcpCatalogGateway implements McpCatalogGateway {
  SdkworkMcpCatalogGateway(this._client);

  final mcp_sdk.SdkworkAppClient _client;

  @override
  Future<McpCatalogPage> listServers({
    String? cursor,
    int pageSize = 20,
    String? query,
  }) async {
    final response = await _client.mcp.listServers(
      null,
      pageSize.clamp(1, 200),
      cursor,
      query,
    );
    if (response == null || response.code != 0) {
      throw const FormatException('MCP SDK response is missing success data');
    }
    final data = _asMap(response.data);
    if (data == null) {
      throw const FormatException('MCP SDK response is missing data');
    }
    final items = _asList(data['items'])
        .map(_asMap)
        .whereType<Map<String, dynamic>>()
        .map(mcp_sdk.McpServerRecord.fromJson)
        .map(
          (record) => McpCatalogRecord(
            id: record.uuid,
            key: record.serverKey,
            name: record.name,
            description: record.description,
            categoryCode: record.categoryCode,
            transport: record.transport,
            lifecycleStatus: record.lifecycleStatus,
            healthStatus: record.healthStatus,
          ),
        )
        .toList(growable: false);
    final pageInfo = _asMap(data['pageInfo']);
    return McpCatalogPage(
      items: items,
      hasMore: pageInfo?['hasMore'] == true,
      nextCursor: pageInfo?['nextCursor']?.toString(),
    );
  }
}

class McpAiStoreRepository implements AiStoreRepository {
  McpAiStoreRepository(this._gateway);

  final McpCatalogGateway _gateway;

  @override
  Future<AiStorePageResult> list({
    required AiStoreKind kind,
    String? cursor,
    int pageSize = 20,
    String? query,
  }) async {
    if (kind != AiStoreKind.mcp) {
      throw AiStoreCapabilityUnavailable(kind, 'catalog listing');
    }
    final page = await _gateway.listServers(
      cursor: cursor,
      pageSize: pageSize,
      query: query,
    );
    return AiStorePageResult(
      items: page.items.map(_toStoreEntry).toList(growable: false),
      hasMore: page.hasMore,
      nextCursor: page.nextCursor,
    );
  }

  @override
  Future<void> install(String entryId) => Future.error(
        const AiStoreCapabilityUnavailable(
          AiStoreKind.mcp,
          'installation',
        ),
      );

  @override
  Future<void> uninstall(String entryId) => Future.error(
        const AiStoreCapabilityUnavailable(
          AiStoreKind.mcp,
          'uninstallation',
        ),
      );
}

AiStoreEntry _toStoreEntry(McpCatalogRecord record) => AiStoreEntry(
      id: record.id,
      kind: AiStoreKind.mcp,
      name: record.name,
      publisher: _publisher(record),
      description: record.description?.trim().isNotEmpty == true
          ? record.description!.trim()
          : record.transport.toUpperCase(),
      monogram: _monogram(record.name),
      colorValue: _catalogColor(record.key),
      verified: record.lifecycleStatus.toLowerCase() == 'published' &&
          record.healthStatus.toLowerCase() != 'unhealthy',
      installable: false,
    );

String _publisher(McpCatalogRecord record) {
  final category = record.categoryCode?.trim();
  return category == null || category.isEmpty
      ? record.transport.toUpperCase()
      : category;
}

String _monogram(String value) {
  final words = value
      .trim()
      .split(RegExp(r'\s+'))
      .where((word) => word.isNotEmpty)
      .toList(growable: false);
  if (words.isEmpty) {
    return 'MCP';
  }
  if (words.length > 1) {
    return '${_firstGlyph(words.first)}${_firstGlyph(words[1])}'.toUpperCase();
  }
  final runes = words.first.runes.take(2).toList(growable: false);
  return String.fromCharCodes(runes).toUpperCase();
}

String _firstGlyph(String value) => String.fromCharCode(value.runes.first);

int _catalogColor(String key) {
  const colors = <int>[
    0xFF15634F,
    0xFF2F638E,
    0xFF75558F,
    0xFF83553E,
    0xFF3B4248,
  ];
  final hash = key.codeUnits.fold<int>(0, (value, unit) => value + unit);
  return colors[hash % colors.length];
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
