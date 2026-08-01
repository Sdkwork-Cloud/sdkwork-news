import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_news_flutter_mobile_assistant/sdkwork_news_flutter_mobile_assistant.dart';
import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';

void main() {
  group('AssistantController', () {
    test('replaces streaming chunks and keeps one final IM message', () async {
      final repository = _MemoryAgentRepository([_agent()]);
      final gateway = _MemoryConversationGateway();
      final controller = AssistantController(
        agentRepository: repository,
        conversationGateway: gateway,
      );
      addTearDown(controller.dispose);

      await controller.initialize();
      await controller.selectAgent(controller.agents.single);

      gateway.emit(_message(id: 'reply-1', text: '正在核对', streaming: true));
      gateway.emit(
        _message(id: 'reply-1', text: '正在核对来源', streaming: true),
      );
      gateway.emit(
        _message(id: 'reply-1', text: '已核对来源并形成结论。'),
      );
      await Future<void>.delayed(Duration.zero);

      final replies = controller.messages
          .where((message) => message.id == 'reply-1')
          .toList();
      expect(replies, hasLength(1));
      expect(replies.single.text, '已核对来源并形成结论。');
      expect(replies.single.streaming, isFalse);
      expect(gateway.markedReadSequence, 2);
    });

    test('creates an agent, links one conversation, and persists its profile',
        () async {
      final repository = _MemoryAgentRepository([_agent()]);
      final gateway = _MemoryConversationGateway();
      final controller = AssistantController(
        agentRepository: repository,
        conversationGateway: gateway,
      );
      addTearDown(controller.dispose);

      await controller.initialize();
      await controller.createAgent(
        const NewsAgentDraft(
          name: '政策观察',
          description: '跟踪政策变化',
          scopes: ['政策'],
          schedule: ReadingSchedule.standard(),
        ),
      );

      final created = controller.agents.first;
      expect(created.conversationId, 'conversation-${created.id}');
      expect(repository.linkCalls, 1);
      expect(gateway.ensureCalls, 1);

      await controller.selectAgent(created);
      final updated = created.copyWith(
        name: '政策周报',
        description: '跟踪政策变化并输出决策摘要',
        scopes: const ['政策', '监管'],
        trustedSources: const ['国务院', '央行'],
        outputStyle: NewsAgentOutputStyle.executive,
        schedule: created.schedule.copyWith(
          monthly: created.schedule.monthly.copyWith(
            day: 1,
            hour: 9,
            minute: 15,
          ),
        ),
      );
      await controller.saveProfile(updated);

      expect(repository.updateCalls, 1);
      expect(controller.selectedAgent?.name, '政策周报');
      expect(controller.selectedAgent?.trustedSources, ['国务院', '央行']);
      expect(
        controller.selectedAgent?.outputStyle,
        NewsAgentOutputStyle.executive,
      );
      expect(controller.selectedAgent?.schedule.toCronExpressions(), [
        '30 8 * * *',
        '0 18 * * *',
        '30 17 * * 5',
        '15 9 1 * *',
      ]);
      expect(controller.agents.first.schedule.toCronExpressions(), [
        '30 8 * * *',
        '0 18 * * *',
        '30 17 * * 5',
        '15 9 1 * *',
      ]);
    });
  });
}

NewsAgent _agent({String? conversationId = 'conversation-market'}) => NewsAgent(
      id: 'market',
      code: 'market-radar',
      name: '市场雷达',
      initial: '市',
      colorValue: 0xFF0B7D5E,
      description: '宏观政策',
      summary: '今日摘要',
      lastActivityLabel: '08:30',
      conversationId: conversationId,
      schedule: const ReadingSchedule.standard(),
    );

NewsMessage _message({
  required String id,
  required String text,
  bool streaming = false,
}) =>
    NewsMessage(
      id: id,
      conversationId: 'conversation-market',
      role: NewsMessageRole.agent,
      text: text,
      occurredAt: DateTime.utc(2026, 7, 31, 1, 0),
      sequence: 3,
      streaming: streaming,
    );

class _MemoryAgentRepository implements NewsAgentRepository {
  _MemoryAgentRepository(List<NewsAgent> agents) : agents = [...agents];

  final List<NewsAgent> agents;
  int linkCalls = 0;
  int updateCalls = 0;

  @override
  Future<NewsAgentPage> list({
    String? cursor,
    int pageSize = 20,
    String? query,
  }) async =>
      NewsAgentPage(items: List.unmodifiable(agents));

  @override
  Future<NewsAgent> create(NewsAgentDraft draft) async {
    final agent = NewsAgent(
      id: 'created',
      code: 'created',
      name: draft.name,
      initial: draft.name.substring(0, 1),
      colorValue: 0xFF336699,
      description: draft.description,
      summary: '',
      lastActivityLabel: '刚刚',
      scopes: draft.scopes,
      schedule: draft.schedule,
    );
    agents.insert(0, agent);
    return agent;
  }

  @override
  Future<NewsAgent> linkConversation(
    NewsAgent agent,
    String conversationId,
  ) async {
    linkCalls += 1;
    final linked = agent.copyWith(conversationId: conversationId);
    _replace(linked);
    return linked;
  }

  @override
  Future<NewsAgent> update(NewsAgent current, NewsAgent updated) async {
    updateCalls += 1;
    _replace(updated);
    return updated;
  }

  void _replace(NewsAgent updated) {
    final index = agents.indexWhere((agent) => agent.id == updated.id);
    if (index >= 0) agents[index] = updated;
  }
}

class _MemoryConversationGateway implements NewsConversationGateway {
  final StreamController<NewsMessage> _messages =
      StreamController<NewsMessage>.broadcast();
  int ensureCalls = 0;
  int? markedReadSequence;

  void emit(NewsMessage message) => _messages.add(message);

  @override
  Future<String> ensureConversation(NewsAgent agent) async {
    ensureCalls += 1;
    return agent.conversationId ?? 'conversation-${agent.id}';
  }

  @override
  Future<NewsMessagePage> loadMessages(
    String conversationId, {
    String? cursor,
    int pageSize = 50,
  }) async =>
      NewsMessagePage(
        items: [
          NewsMessage(
            id: 'history-user',
            conversationId: conversationId,
            role: NewsMessageRole.user,
            text: '开始阅读',
            occurredAt: DateTime.utc(2026, 7, 31),
            sequence: 1,
          ),
          NewsMessage(
            id: 'history-agent',
            conversationId: conversationId,
            role: NewsMessageRole.agent,
            text: '阅读完成',
            occurredAt: DateTime.utc(2026, 7, 31, 0, 1),
            sequence: 2,
          ),
        ],
      );

  @override
  Stream<NewsMessage> watchMessages(String conversationId) => _messages.stream;

  @override
  Future<NewsMessage> sendText(String conversationId, String text) async =>
      NewsMessage(
        id: 'sent',
        conversationId: conversationId,
        role: NewsMessageRole.user,
        text: text,
        occurredAt: DateTime.utc(2026, 7, 31, 2),
        sequence: 4,
      );

  @override
  Future<void> markRead(String conversationId, int sequence) async {
    markedReadSequence = sequence;
  }

  @override
  Future<void> dispose() => _messages.close();
}
