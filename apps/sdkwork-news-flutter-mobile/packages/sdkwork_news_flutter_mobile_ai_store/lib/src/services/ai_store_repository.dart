import '../models/ai_store_entry.dart';

abstract interface class AiStoreRepository {
  Future<AiStorePageResult> list({
    required AiStoreKind kind,
    String? cursor,
    int pageSize = 20,
    String? query,
  });

  Future<void> install(String entryId);

  Future<void> uninstall(String entryId);
}

class AiStoreCapabilityUnavailable implements Exception {
  const AiStoreCapabilityUnavailable(this.kind, this.operation);

  final AiStoreKind kind;
  final String operation;

  @override
  String toString() =>
      '${kind.name} AI Store capability does not support $operation';
}

class UnavailableAiStoreRepository implements AiStoreRepository {
  const UnavailableAiStoreRepository();

  @override
  Future<AiStorePageResult> list({
    required AiStoreKind kind,
    String? cursor,
    int pageSize = 20,
    String? query,
  }) =>
      Future.error(AiStoreCapabilityUnavailable(kind, 'catalog listing'));

  @override
  Future<void> install(String entryId) => Future.error(
        const AiStoreCapabilityUnavailable(
          AiStoreKind.product,
          'installation',
        ),
      );

  @override
  Future<void> uninstall(String entryId) => Future.error(
        const AiStoreCapabilityUnavailable(
          AiStoreKind.product,
          'uninstallation',
        ),
      );
}

class DemoAiStoreRepository implements AiStoreRepository {
  @override
  Future<AiStorePageResult> list({
    required AiStoreKind kind,
    String? cursor,
    int pageSize = 20,
    String? query,
  }) async {
    final offset = int.tryParse(cursor ?? '') ?? 0;
    final size = pageSize.clamp(1, 200);
    final filtered =
        demoAiStoreEntries.where((entry) => entry.kind == kind).where((entry) {
      final normalized = query?.trim().toLowerCase();
      if (normalized == null || normalized.isEmpty) return true;
      return entry.name.toLowerCase().contains(normalized) ||
          entry.publisher.toLowerCase().contains(normalized) ||
          entry.description.toLowerCase().contains(normalized);
    }).toList(growable: false);
    final end = (offset + size).clamp(0, filtered.length);
    return AiStorePageResult(
      items:
          offset >= filtered.length ? const [] : filtered.sublist(offset, end),
      hasMore: end < filtered.length,
      nextCursor: end < filtered.length ? '$end' : null,
    );
  }

  @override
  Future<void> install(String entryId) async {}

  @override
  Future<void> uninstall(String entryId) async {}
}

const demoAiStoreEntries = <AiStoreEntry>[
  AiStoreEntry(
    id: 'deep-research',
    kind: AiStoreKind.product,
    name: 'Deep Research',
    publisher: 'SDKWork Labs',
    description: '跨来源深度研究与证据报告',
    monogram: 'DR',
    colorValue: 0xFF15634F,
    rating: 4.9,
    userCount: '12.4k',
    capabilities: ['跨来源检索', '证据链报告', '定时研究'],
  ),
  AiStoreEntry(
    id: 'data-brief',
    kind: AiStoreKind.product,
    name: 'Data Brief',
    publisher: 'Northstar AI',
    description: '把业务数据转成每日管理简报',
    monogram: 'DB',
    colorValue: 0xFF75558F,
    rating: 4.7,
    userCount: '3.1k',
    capabilities: ['数据摘要', '管理简报', '趋势提醒'],
  ),
  AiStoreEntry(
    id: 'financial-reader',
    kind: AiStoreKind.skill,
    name: 'Financial Reader',
    publisher: 'SDKWork',
    description: '阅读财报、公告与电话会',
    monogram: 'FR',
    colorValue: 0xFF2F638E,
    rating: 4.8,
    userCount: '8.7k',
    capabilities: ['财报阅读', '公告解析', '电话会摘要'],
  ),
  AiStoreEntry(
    id: 'policy-tracker',
    kind: AiStoreKind.skill,
    name: 'Policy Tracker',
    publisher: 'Open Policy',
    description: '持续跟踪政策与生效时间线',
    monogram: 'PT',
    colorValue: 0xFF83553E,
    rating: 4.7,
    userCount: '5.2k',
    capabilities: ['政策跟踪', '生效时间线', '影响分析'],
  ),
  AiStoreEntry(
    id: 'notion-mcp',
    kind: AiStoreKind.mcp,
    name: 'Notion MCP',
    publisher: 'Notion',
    description: '连接团队知识库中的授权页面',
    monogram: 'N',
    colorValue: 0xFF252525,
    rating: 4.9,
    userCount: '24.8k',
    capabilities: ['授权页面检索', '知识库引用', '团队空间'],
  ),
  AiStoreEntry(
    id: 'github-mcp',
    kind: AiStoreKind.mcp,
    name: 'GitHub MCP',
    publisher: 'GitHub',
    description: '检索仓库、Issue 与发布记录',
    monogram: 'GH',
    colorValue: 0xFF3B4248,
    rating: 4.9,
    userCount: '31.6k',
    capabilities: ['仓库检索', 'Issue 跟踪', '发布记录'],
  ),
];
