import 'package:flutter/foundation.dart';

import '../models/news_article.dart';
import '../services/news_feed_repository.dart';

class NewsFeedController extends ChangeNotifier {
  NewsFeedController(this._repository);

  final NewsFeedRepository _repository;
  String category = 'recommended';
  List<NewsArticle> articles = const [];
  Set<String> savedIds = const {};
  String? nextCursor;
  bool hasMore = false;
  bool isLoading = false;
  bool isLoadingMore = false;
  String? errorMessage;

  Future<void> initialize() => refresh();

  Future<void> selectCategory(String value) async {
    if (category == value) {
      return;
    }
    category = value;
    articles = const [];
    nextCursor = null;
    hasMore = false;
    notifyListeners();
    await refresh();
  }

  Future<void> refresh() async {
    if (isLoading) {
      return;
    }
    isLoading = true;
    errorMessage = null;
    notifyListeners();
    try {
      final page = await _repository.list(category: category, pageSize: 20);
      articles = List.unmodifiable(page.items);
      nextCursor = page.nextCursor;
      hasMore = page.hasMore;
    } catch (error) {
      errorMessage = '$error';
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadMore() async {
    if (!hasMore || isLoadingMore || nextCursor == null) {
      return;
    }
    isLoadingMore = true;
    notifyListeners();
    try {
      final page = await _repository.list(
        category: category,
        cursor: nextCursor,
        pageSize: 20,
      );
      final byId = {for (final article in articles) article.id: article};
      for (final article in page.items) {
        byId[article.id] = article;
      }
      articles = List.unmodifiable(byId.values);
      nextCursor = page.nextCursor;
      hasMore = page.hasMore;
    } catch (error) {
      errorMessage = '$error';
    } finally {
      isLoadingMore = false;
      notifyListeners();
    }
  }

  void toggleSaved(String id) {
    final next = {...savedIds};
    next.contains(id) ? next.remove(id) : next.add(id);
    savedIds = Set.unmodifiable(next);
    notifyListeners();
  }
}
