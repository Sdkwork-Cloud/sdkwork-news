import 'dart:async';

import 'package:sdkwork_im_flutter_mobile_chat/sdkwork_im_flutter_mobile_chat.dart';
import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';
import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';

import 'news_message_tracker.dart';

class SdkworkImNewsConversationGateway implements NewsConversationGateway {
  SdkworkImNewsConversationGateway(this._bundle)
      : _conversationService = createChatConversationService(_bundle),
        _realtimeService = createChatRealtimeService(_bundle);

  final ImSdkClientBundle _bundle;
  final ChatConversationService _conversationService;
  final ChatRealtimeService _realtimeService;
  final Map<String, StreamController<NewsMessage>> _controllers = {};
  final NewsMessageTracker _messageTracker = NewsMessageTracker();
  bool _disposed = false;

  @override
  Future<String> ensureConversation(NewsAgent agent) async {
    final current = agent.conversationId?.trim();
    if (current != null && current.isNotEmpty) {
      return current;
    }
    final response = await _bundle.imSdk.chat.conversationsAgentDialogsCreate(
      CreateAgentDialogRequest(agentId: agent.id),
    );
    final data = _asMap(response?.data);
    final item = _asMap(data?['item']) ?? data;
    final conversationId = item?['conversationId']?.toString();
    if (conversationId == null || conversationId.isEmpty) {
      throw const FormatException(
        'IM agent dialog response is missing data.item.conversationId',
      );
    }
    return conversationId;
  }

  @override
  Future<NewsMessagePage> loadMessages(
    String conversationId, {
    String? cursor,
    int pageSize = 50,
  }) async {
    final page = await _fetchMessagePage(
      conversationId,
      cursor: cursor,
      pageSize: pageSize,
    );
    _messageTracker.track(conversationId, page.items);
    return page;
  }

  Future<NewsMessagePage> _fetchMessagePage(
    String conversationId, {
    String? cursor,
    int pageSize = 50,
  }) async {
    final response = await _conversationService.fetchMessageHistory(
      conversationId,
      cursor: cursor,
      pageSize: pageSize,
    );
    final items = response.items.map(_fromEntry).toList(growable: false);
    return NewsMessagePage(
      items: items,
      nextCursor: response.pagination.nextCursor,
      hasMore: response.pagination.hasMore,
    );
  }

  @override
  Stream<NewsMessage> watchMessages(String conversationId) {
    if (_disposed) {
      throw StateError('Conversation gateway is disposed');
    }
    final existing = _controllers[conversationId];
    if (existing != null) {
      return existing.stream;
    }
    late final StreamController<NewsMessage> controller;
    controller = StreamController<NewsMessage>.broadcast(
      onListen: () {
        unawaited(
          _realtimeService.startConversation(
            conversationId: conversationId,
            onRefresh: () => _refreshConversation(conversationId, controller),
          ),
        );
      },
      onCancel: () {
        if (!controller.hasListener) {
          unawaited(_realtimeService.stopConversation());
        }
      },
    );
    _controllers[conversationId] = controller;
    return controller.stream;
  }

  Future<void> _refreshConversation(
    String conversationId,
    StreamController<NewsMessage> controller,
  ) async {
    try {
      final page = await _fetchMessagePage(conversationId, pageSize: 50);
      for (final message
          in _messageTracker.takeUnseen(conversationId, page.items)) {
        if (!controller.isClosed) {
          controller.add(message);
        }
      }
    } catch (error, stackTrace) {
      if (!controller.isClosed) {
        controller.addError(error, stackTrace);
      }
    }
  }

  @override
  Future<NewsMessage> sendText(String conversationId, String text) async {
    final result = await _conversationService.sendText(
      conversationId,
      text,
      clientMsgId:
          'news-flutter-${DateTime.now().toUtc().microsecondsSinceEpoch}',
    );
    if (result == null) {
      throw const FormatException('IM send response is missing data.item');
    }
    final message = NewsMessage(
      id: result.messageId,
      conversationId: conversationId,
      role: NewsMessageRole.user,
      text: text.trim(),
      occurredAt: DateTime.now().toUtc(),
      sequence: result.messageSeq,
    );
    _messageTracker.track(conversationId, [message]);
    return message;
  }

  @override
  Future<void> markRead(String conversationId, int sequence) {
    return _conversationService.markConversationRead(
      conversationId,
      readSeq: sequence,
    );
  }

  @override
  Future<void> dispose() async {
    if (_disposed) {
      return;
    }
    _disposed = true;
    await _realtimeService.stop();
    for (final controller in _controllers.values) {
      await controller.close();
    }
    _controllers.clear();
    _messageTracker.clear();
  }
}

NewsMessage _fromEntry(ConversationMessageEntry entry) {
  final kind = entry.sender.kind.toLowerCase();
  return NewsMessage(
    id: entry.messageId,
    conversationId: entry.conversationId,
    role: kind.contains('agent') || kind.contains('assistant')
        ? NewsMessageRole.agent
        : kind.contains('system')
            ? NewsMessageRole.system
            : NewsMessageRole.user,
    text: entry.body.text ?? entry.body.summary ?? entry.summary ?? '',
    occurredAt: DateTime.tryParse(entry.occurredAt)?.toUtc() ??
        DateTime.fromMillisecondsSinceEpoch(0, isUtc: true),
    sequence: entry.messageSeq,
    streaming: entry.deliveryMode.toLowerCase().contains('stream'),
  );
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
