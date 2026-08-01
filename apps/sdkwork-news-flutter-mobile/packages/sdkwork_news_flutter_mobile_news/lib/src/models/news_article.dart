class NewsArticle {
  const NewsArticle({
    required this.id,
    required this.category,
    required this.title,
    required this.source,
    required this.timeLabel,
    required this.imageAsset,
    required this.commentCount,
    this.summary = '',
    this.body = const <String>[],
  });

  final String id;
  final String category;
  final String title;
  final String source;
  final String timeLabel;
  final String imageAsset;
  final int commentCount;
  final String summary;
  final List<String> body;
}

class NewsArticlePage {
  const NewsArticlePage({
    required this.items,
    required this.hasMore,
    this.nextCursor,
  });

  final List<NewsArticle> items;
  final bool hasMore;
  final String? nextCursor;
}
