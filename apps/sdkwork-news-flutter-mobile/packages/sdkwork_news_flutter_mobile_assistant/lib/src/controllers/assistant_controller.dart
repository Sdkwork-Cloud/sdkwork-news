import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';

class AssistantController extends ChangeNotifier {
  AssistantController({
    required NewsAgentRepository agentRepository,
    required NewsConversationGateway conversationGateway,
  })  : _agentRepository = agentRepository,
        _conversationGateway = conversationGateway;

  final NewsAgentRepository _agentRepository;
  final NewsConversationGateway _conversationGateway;
  StreamSubscription<NewsMessage>? _messageSubscription;
  bool _disposed = false;
  bool _initialized = false;
  bool isLoading = false;
  bool isSending = false;
  String? errorMessage;
  List<NewsAgent> agents = const [];
  NewsAgent? selectedAgent;
  List<NewsMessage> messages = const [];

  Future<void> initialize() async {
    if (_initialized || isLoading) {
      return;
    }
    _initialized = true;
    isLoading = true;
    _notify();
    try {
      final page = await _agentRepository.list(pageSize: 20);
      agents = page.items;
      errorMessage = null;
    } catch (error) {
      errorMessage = '$error';
    } finally {
      isLoading = false;
      _notify();
    }
  }

  Future<void> selectAgent(NewsAgent agent) async {
    selectedAgent = agent;
    messages = const [];
    errorMessage = null;
    isLoading = true;
    _notify();
    await _messageSubscription?.cancel();
    try {
      final conversationId =
          await _conversationGateway.ensureConversation(agent);
      var linked = agent;
      if (agent.conversationId != conversationId) {
        linked = await _agentRepository.linkConversation(agent, conversationId);
        _replaceAgent(linked);
        selectedAgent = linked;
      }
      final page = await _conversationGateway.loadMessages(conversationId);
      messages = _sortedUnique(page.items);
      _messageSubscription = _conversationGateway
          .watchMessages(conversationId)
          .listen(_handleIncomingMessage, onError: _handleStreamError);
      final latestSequence = messages.isEmpty ? 0 : messages.last.sequence;
      await _conversationGateway.markRead(conversationId, latestSequence);
    } catch (error) {
      errorMessage = '$error';
    } finally {
      isLoading = false;
      _notify();
    }
  }

  Future<void> send(String text) async {
    final agent = selectedAgent;
    final conversationId = agent?.conversationId;
    final normalized = text.trim();
    if (agent == null ||
        conversationId == null ||
        normalized.isEmpty ||
        isSending) {
      return;
    }
    isSending = true;
    errorMessage = null;
    _notify();
    try {
      final message =
          await _conversationGateway.sendText(conversationId, normalized);
      _upsertMessage(message);
    } catch (error) {
      errorMessage = '$error';
    } finally {
      isSending = false;
      _notify();
    }
  }

  Future<void> createAgent(NewsAgentDraft draft) async {
    isLoading = true;
    errorMessage = null;
    _notify();
    try {
      var agent = await _agentRepository.create(draft);
      final conversationId =
          await _conversationGateway.ensureConversation(agent);
      if (agent.conversationId != conversationId) {
        agent = await _agentRepository.linkConversation(agent, conversationId);
      }
      agents = [agent, ...agents.where((item) => item.id != agent.id)];
    } catch (error) {
      errorMessage = '$error';
    } finally {
      isLoading = false;
      _notify();
    }
  }

  Future<void> saveSchedule(NewsAgent updated) async {
    final current = selectedAgent;
    if (current == null || current.id != updated.id) {
      return;
    }
    try {
      final saved = await _agentRepository.updateSchedule(current, updated);
      selectedAgent = saved;
      _replaceAgent(saved);
      errorMessage = null;
    } catch (error) {
      errorMessage = '$error';
    }
    _notify();
  }

  void closeConversation() {
    unawaited(_messageSubscription?.cancel());
    _messageSubscription = null;
    selectedAgent = null;
    messages = const [];
    errorMessage = null;
    _notify();
  }

  void markAllRead() {
    agents = [for (final agent in agents) agent.copyWith(unreadCount: 0)];
    _notify();
  }

  void _handleIncomingMessage(NewsMessage message) {
    _upsertMessage(message);
    _notify();
  }

  void _handleStreamError(Object error) {
    errorMessage = '$error';
    _notify();
  }

  void _upsertMessage(NewsMessage message) {
    final next = [...messages];
    final index = next.indexWhere((item) => item.id == message.id);
    if (index >= 0) {
      next[index] = message;
    } else {
      next.add(message);
    }
    messages = _sortedUnique(next);
  }

  List<NewsMessage> _sortedUnique(Iterable<NewsMessage> items) {
    final byId = <String, NewsMessage>{for (final item in items) item.id: item};
    final sorted = byId.values.toList()
      ..sort((left, right) {
        final sequence = left.sequence.compareTo(right.sequence);
        return sequence == 0
            ? left.occurredAt.compareTo(right.occurredAt)
            : sequence;
      });
    return List.unmodifiable(sorted);
  }

  void _replaceAgent(NewsAgent updated) {
    agents = [
      for (final agent in agents) agent.id == updated.id ? updated : agent,
    ];
  }

  void _notify() {
    if (!_disposed) {
      notifyListeners();
    }
  }

  @override
  void dispose() {
    _disposed = true;
    unawaited(_messageSubscription?.cancel());
    unawaited(_conversationGateway.dispose());
    super.dispose();
  }
}
