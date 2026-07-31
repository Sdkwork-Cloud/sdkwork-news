import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_news_flutter_mobile_ai_store/sdkwork_news_flutter_mobile_ai_store.dart';
import 'package:sdkwork_news_flutter_mobile_news/sdkwork_news_flutter_mobile_news.dart';

void main() {
  test('news feed requests cursor pages and deduplicates overlapping items',
      () async {
    final repository = _PagedNewsRepository();
    final controller = NewsFeedController(repository);

    await controller.initialize();
    expect(controller.articles.map((article) => article.id), ['a', 'b']);
    expect(controller.hasMore, isTrue);
    expect(controller.nextCursor, 'cursor-2');

    await controller.loadMore();
    expect(controller.articles.map((article) => article.id), ['a', 'b', 'c']);
    expect(controller.hasMore, isFalse);
    expect(repository.cursors, [null, 'cursor-2']);
  });

  test('AI Store serializes install lifecycle and preserves state on failure',
      () async {
    final repository = _StoreRepository();
    final controller = AiStoreController(repository);
    await controller.initialize();

    final first = controller.toggleInstalled('deep-research');
    final duplicate = controller.toggleInstalled('deep-research');
    expect(controller.busyIds, contains('deep-research'));
    repository.installCompleter.complete();
    await Future.wait([first, duplicate]);

    expect(repository.installCalls, 1);
    expect(controller.installedIds, contains('deep-research'));
    expect(controller.busyIds, isEmpty);

    repository.failUninstall = true;
    await controller.toggleInstalled('deep-research');
    expect(controller.installedIds, contains('deep-research'));
    expect(controller.errorMessage, contains('uninstall failed'));
  });
}

NewsArticle _article(String id) => NewsArticle(
      id: id,
      category: 'technology',
      title: 'Article $id',
      source: 'SDKWork News',
      timeLabel: '刚刚',
      imageAsset: 'unused',
      commentCount: 0,
    );

class _PagedNewsRepository implements NewsFeedRepository {
  final List<String?> cursors = [];

  @override
  Future<NewsArticlePage> list({
    required String category,
    String? cursor,
    int pageSize = 20,
  }) async {
    cursors.add(cursor);
    if (cursor == null) {
      return NewsArticlePage(
        items: [_article('a'), _article('b')],
        hasMore: true,
        nextCursor: 'cursor-2',
      );
    }
    return NewsArticlePage(
      items: [_article('b'), _article('c')],
      hasMore: false,
    );
  }
}

class _StoreRepository implements AiStoreRepository {
  final Completer<void> installCompleter = Completer<void>();
  int installCalls = 0;
  bool failUninstall = false;

  @override
  Future<AiStorePageResult> list({
    required AiStoreKind kind,
    String? cursor,
    int pageSize = 20,
  }) async =>
      const AiStorePageResult(items: [], hasMore: false);

  @override
  Future<void> install(String entryId) {
    installCalls += 1;
    return installCompleter.future;
  }

  @override
  Future<void> uninstall(String entryId) async {
    if (failUninstall) throw StateError('uninstall failed');
  }
}
