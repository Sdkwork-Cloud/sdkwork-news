import 'dart:async';

import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';

class DemoNewsAgentRepository implements NewsAgentRepository {
  DemoNewsAgentRepository() : _agents = [...demoNewsAgents];

  final List<NewsAgent> _agents;

  @override
  Future<NewsAgentPage> list({
    String? cursor,
    int pageSize = 20,
    String? query,
  }) async {
    final size = normalizeNewsPageSize(pageSize);
    final offset = int.tryParse(cursor ?? '') ?? 0;
    final normalizedQuery = query?.trim().toLowerCase();
    final filtered = normalizedQuery == null || normalizedQuery.isEmpty
        ? _agents
        : _agents
            .where(
              (agent) =>
                  agent.name.toLowerCase().contains(normalizedQuery) ||
                  agent.description.toLowerCase().contains(normalizedQuery),
            )
            .toList(growable: false);
    final end = (offset + size).clamp(0, filtered.length);
    final items = offset >= filtered.length
        ? const <NewsAgent>[]
        : filtered.sublist(offset, end);
    return NewsAgentPage(
      items: items,
      hasMore: end < filtered.length,
      nextCursor: end < filtered.length ? '$end' : null,
    );
  }

  @override
  Future<NewsAgent> create(NewsAgentDraft draft) async {
    final id = 'demo-${DateTime.now().microsecondsSinceEpoch}';
    final agent = NewsAgent(
      id: id,
      code: id,
      name: draft.name.trim(),
      initial: draft.name.trim().isEmpty ? 'AI' : draft.name.trim()[0],
      colorValue: 0xFF5B5F73,
      description: draft.description.trim(),
      summary: '等待首次阅读任务',
      lastActivityLabel: '刚刚',
      conversationId: 'conversation-$id',
      schedule: draft.schedule,
      scopes: draft.scopes,
      trustedSourcesOnly: draft.trustedSourcesOnly,
    );
    _agents.insert(0, agent);
    return agent;
  }

  @override
  Future<NewsAgent> linkConversation(
    NewsAgent agent,
    String conversationId,
  ) async {
    final updated = agent.copyWith(conversationId: conversationId);
    _replace(updated);
    return updated;
  }

  @override
  Future<NewsAgent> updateSchedule(
    NewsAgent agent,
    NewsAgent updated,
  ) async {
    _replace(updated);
    return updated;
  }

  void _replace(NewsAgent updated) {
    final index = _agents.indexWhere((agent) => agent.id == updated.id);
    if (index >= 0) {
      _agents[index] = updated;
    }
  }
}

class DemoNewsConversationGateway implements NewsConversationGateway {
  final Map<String, StreamController<NewsMessage>> _streams = {};
  bool _disposed = false;

  @override
  Future<String> ensureConversation(NewsAgent agent) async =>
      agent.conversationId ?? 'conversation-${agent.id}';

  @override
  Future<NewsMessagePage> loadMessages(
    String conversationId, {
    String? cursor,
    int pageSize = 50,
  }) async {
    return NewsMessagePage(
      items: [
        NewsMessage(
          id: '$conversationId-user-1',
          conversationId: conversationId,
          role: NewsMessageRole.user,
          text: '按早间策略执行，重点看政策变化和市场传导。',
          occurredAt: DateTime.now().subtract(const Duration(minutes: 8)),
          sequence: 1,
        ),
        NewsMessage(
          id: '$conversationId-agent-1',
          conversationId: conversationId,
          role: NewsMessageRole.agent,
          text: '已完成 126 个来源的增量阅读，去重后保留 9 条。下面 3 条需要你今天关注。',
          occurredAt: DateTime.now().subtract(const Duration(minutes: 7)),
          sequence: 2,
        ),
      ],
    );
  }

  @override
  Stream<NewsMessage> watchMessages(String conversationId) {
    if (_disposed) {
      throw StateError('Demo conversation gateway is disposed');
    }
    return _streams
        .putIfAbsent(
          conversationId,
          () => StreamController<NewsMessage>.broadcast(),
        )
        .stream;
  }

  @override
  Future<NewsMessage> sendText(String conversationId, String text) async {
    final now = DateTime.now();
    final userMessage = NewsMessage(
      id: 'user-${now.microsecondsSinceEpoch}',
      conversationId: conversationId,
      role: NewsMessageRole.user,
      text: text.trim(),
      occurredAt: now,
      sequence: now.millisecondsSinceEpoch,
    );
    unawaited(_emitStreamingReply(conversationId));
    return userMessage;
  }

  Future<void> _emitStreamingReply(String conversationId) async {
    final controller = _streams[conversationId];
    if (controller == null || controller.isClosed) {
      return;
    }
    final id = 'agent-${DateTime.now().microsecondsSinceEpoch}';
    const chunks = [
      '正在核对来源',
      '正在核对来源与时间线，',
      '正在核对来源与时间线，稍后给出可执行结论。',
    ];
    for (var index = 0; index < chunks.length; index += 1) {
      await Future<void>.delayed(const Duration(milliseconds: 70));
      if (controller.isClosed) {
        return;
      }
      controller.add(
        NewsMessage(
          id: id,
          conversationId: conversationId,
          role: NewsMessageRole.agent,
          text: chunks[index],
          occurredAt: DateTime.now(),
          sequence: DateTime.now().millisecondsSinceEpoch,
          streaming: index < chunks.length - 1,
        ),
      );
    }
  }

  @override
  Future<void> markRead(String conversationId, int sequence) async {}

  @override
  Future<void> dispose() async {
    _disposed = true;
    for (final controller in _streams.values) {
      await controller.close();
    }
    _streams.clear();
  }
}

const demoNewsAgents = <NewsAgent>[
  NewsAgent(
    id: 'market',
    code: 'market-radar',
    name: '市场雷达',
    initial: '市',
    colorValue: 0xFF0B7D5E,
    description: '宏观政策 · 资本市场 · 产业资金',
    summary: '央行公开市场操作出现边际变化，3 个行业受影响',
    lastActivityLabel: '08:31',
    conversationId: 'news-agent-market',
    unreadCount: 3,
    scopes: ['宏观政策', '资本市场', '产业资金'],
    schedule: ReadingSchedule(
      cadence: ReadingCadence.daily,
      hour: 8,
      minute: 30,
      additionalDailyTimes: [(hour: 18, minute: 0)],
    ),
  ),
  NewsAgent(
    id: 'ai',
    code: 'ai-frontier',
    name: 'AI 前沿',
    initial: 'A',
    colorValue: 0xFF2567A3,
    description: '模型 · Agent · 开发工具',
    summary: '两项模型能力更新值得进入本周技术评审',
    lastActivityLabel: '07:46',
    conversationId: 'news-agent-ai',
    unreadCount: 1,
    scopes: ['模型', 'Agent', '开发工具'],
    schedule: ReadingSchedule(
      cadence: ReadingCadence.daily,
      hour: 7,
      minute: 30,
    ),
  ),
  NewsAgent(
    id: 'competitor',
    code: 'competitor-watch',
    name: '竞品观察',
    initial: '竞',
    colorValue: 0xFF9A6428,
    description: '发布 · 定价 · 客户动向',
    summary: '竞品 A 调整企业版定价，核心功能边界未变',
    lastActivityLabel: '昨天',
    conversationId: 'news-agent-competitor',
    scopes: ['产品发布', '定价', '客户动向'],
    schedule: ReadingSchedule(
      cadence: ReadingCadence.weekly,
      hour: 9,
      minute: 0,
      weekday: DateTime.friday,
    ),
  ),
  NewsAgent(
    id: 'policy',
    code: 'policy-brief',
    name: '政策简报',
    initial: '政',
    colorValue: 0xFF9B3F59,
    description: '监管文件 · 生效时间 · 风险',
    summary: '本周政策周报已完成，共识别 4 项行动要求',
    lastActivityLabel: '周三',
    conversationId: 'news-agent-policy',
    scopes: ['监管文件', '生效时间', '风险'],
    schedule: ReadingSchedule(
      cadence: ReadingCadence.monthly,
      hour: 9,
      minute: 0,
      dayOfMonth: 1,
    ),
  ),
];
