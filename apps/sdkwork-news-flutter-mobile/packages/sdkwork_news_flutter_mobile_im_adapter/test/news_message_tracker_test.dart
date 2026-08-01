import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';
import 'package:sdkwork_news_flutter_mobile_im_adapter/src/news_message_tracker.dart';
import 'package:test/test.dart';

void main() {
  test('publishes each realtime message once per conversation', () {
    final tracker = NewsMessageTracker();
    final history = _message('history-1', 'conversation-a');
    final incremental = _message('incremental-1', 'conversation-a');

    tracker.track('conversation-a', [history]);

    expect(
      tracker.takeUnseen('conversation-a', [history, incremental]),
      [incremental],
    );
    expect(
      tracker.takeUnseen('conversation-a', [history, incremental]),
      isEmpty,
    );
    expect(
      tracker.takeUnseen('conversation-b', [history]),
      [history],
    );

    tracker.clear();
    expect(tracker.takeUnseen('conversation-a', [history]), [history]);
  });
}

NewsMessage _message(String id, String conversationId) {
  return NewsMessage(
    id: id,
    conversationId: conversationId,
    role: NewsMessageRole.agent,
    text: id,
    occurredAt: DateTime.utc(2026, 8, 1),
  );
}
