import 'package:flutter/foundation.dart';

import '../models/news_article.dart';
import '../services/news_feed_repository.dart';

class NewsFeedController extends ChangeNotifier {
  NewsFeedController(this._repository);

  final NewsFeedRepository _repository;
  int _requestId = 0;
  String category = 'recommended';
  String? query;
  List<NewsArticle> articles = const [];
  Set<String> savedIds = const {};
  String? nextCursor;
  bool hasMore = false;
  bool isLoading = false;
  bool isLoadingMore = false;
  String? errorMessage;

  Future<void> initialize() => refresh();

  Future<void> selectCategory(String value) async {
    if (category == value && query == null) {
      return;
    }
    category = value;
    query = null;
    _resetResults();
    await refresh();
  }

  Future<void> search(String? value) async {
    final normalized = value?.trim();
    final nextQuery =
        normalized == null || normalized.isEmpty ? null : normalized;
    if (query == nextQuery && category == 'recommended') {
      return;
    }
    category = 'recommended';
    query = nextQuery;
    _resetResults();
    await refresh();
  }

  Future<void> refresh() async {
    final requestId = ++_requestId;
    isLoading = true;
    errorMessage = null;
    notifyListeners();
    try {
      final page = await _repository.list(
        category: category,
        pageSize: 20,
        query: query,
      );
      if (requestId != _requestId) {
        return;
      }
      articles = List.unmodifiable(page.items);
      nextCursor = page.nextCursor;
      hasMore = page.hasMore;
    } catch (error) {
      if (requestId == _requestId) {
        errorMessage = '$error';
      }
    } finally {
      if (requestId == _requestId) {
        isLoading = false;
        notifyListeners();
      }
    }
  }

  Future<void> loadMore() async {
    if (!hasMore || isLoadingMore || nextCursor == null) {
      return;
    }
    final requestId = _requestId;
    isLoadingMore = true;
    notifyListeners();
    try {
      final page = await _repository.list(
        category: category,
        cursor: nextCursor,
        pageSize: 20,
        query: query,
      );
      if (requestId != _requestId) {
        return;
      }
      final byId = {for (final article in articles) article.id: article};
      for (final article in page.items) {
        byId[article.id] = article;
      }
      articles = List.unmodifiable(byId.values);
      nextCursor = page.nextCursor;
      hasMore = page.hasMore;
    } catch (error) {
      if (requestId == _requestId) {
        errorMessage = '$error';
      }
    } finally {
      if (requestId == _requestId) {
        isLoadingMore = false;
        notifyListeners();
      }
    }
  }

  void toggleSaved(String id) {
    final next = {...savedIds};
    next.contains(id) ? next.remove(id) : next.add(id);
    savedIds = Set.unmodifiable(next);
    notifyListeners();
  }

  void _resetResults() {
    _requestId += 1;
    articles = const [];
    nextCursor = null;
    hasMore = false;
    isLoadingMore = false;
    errorMessage = null;
    notifyListeners();
  }
}
