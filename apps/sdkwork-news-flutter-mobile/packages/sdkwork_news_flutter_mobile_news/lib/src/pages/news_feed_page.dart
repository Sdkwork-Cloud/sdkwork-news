import 'package:flutter/material.dart';
import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';

import '../controllers/news_feed_controller.dart';
import '../models/news_article.dart';

class NewsFeedPage extends StatefulWidget {
  const NewsFeedPage({
    super.key,
    required this.controller,
    this.onSecondaryPageChanged,
  });

  final NewsFeedController controller;
  final ValueChanged<bool>? onSecondaryPageChanged;

  @override
  State<NewsFeedPage> createState() => _NewsFeedPageState();
}

class _NewsFeedPageState extends State<NewsFeedPage> {
  final _scrollController = ScrollController();
  NewsArticle? _selectedArticle;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_handleScroll);
    widget.controller.initialize();
  }

  void _handleScroll() {
    if (_scrollController.position.extentAfter < 280) {
      widget.controller.loadMore();
    }
  }

  void _openArticle(NewsArticle article) {
    setState(() => _selectedArticle = article);
    widget.onSecondaryPageChanged?.call(true);
  }

  void _closeArticle() {
    setState(() => _selectedArticle = null);
    widget.onSecondaryPageChanged?.call(false);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_handleScroll);
    _scrollController.dispose();
    widget.onSecondaryPageChanged?.call(false);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: widget.controller,
      builder: (context, _) {
        final strings = NewsStrings.of(context);
        if (_selectedArticle != null) {
          return NewsArticleDetailPage(
            article: _selectedArticle!,
            onBack: _closeArticle,
            onSaved: () => widget.controller.toggleSaved(_selectedArticle!.id),
            saved: widget.controller.savedIds.contains(_selectedArticle!.id),
          );
        }
        final articles = widget.controller.articles;
        final failed = widget.controller.errorMessage != null &&
            articles.isEmpty &&
            !widget.controller.isLoading;
        return SafeArea(
          bottom: false,
          child: Column(
            children: [
              Container(
                height: 58,
                padding: const EdgeInsets.symmetric(horizontal: 14),
                color: Theme.of(context).colorScheme.surface,
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        strings.text('news.title'),
                        style: Theme.of(context)
                            .textTheme
                            .headlineSmall
                            ?.copyWith(fontWeight: FontWeight.w800),
                      ),
                    ),
                    IconButton(
                      key: const ValueKey('news.search.open'),
                      tooltip: strings.text('news.search'),
                      onPressed: () => _showSearchSheet(context, strings),
                      icon: const Icon(Icons.search_rounded),
                    ),
                  ],
                ),
              ),
              _CategoryTabs(controller: widget.controller, strings: strings),
              if (widget.controller.query != null)
                _SearchContextBar(
                  onClear: () => widget.controller.search(null),
                  query: widget.controller.query!,
                  strings: strings,
                ),
              Expanded(
                child: RefreshIndicator(
                  onRefresh: widget.controller.refresh,
                  child: CustomScrollView(
                    controller: _scrollController,
                    key: const PageStorageKey('news-feed'),
                    slivers: [
                      if (articles.isNotEmpty)
                        SliverPadding(
                          padding: const EdgeInsets.fromLTRB(14, 13, 14, 0),
                          sliver: SliverToBoxAdapter(
                            child: _LeadStory(
                              article: articles.first,
                              onOpen: () => _openArticle(articles.first),
                            ),
                          ),
                        ),
                      if (articles.length > 1 ||
                          widget.controller.query != null)
                        SliverPadding(
                          padding: const EdgeInsets.fromLTRB(14, 18, 14, 4),
                          sliver: SliverToBoxAdapter(
                            child: NewsSectionHeader(
                              title: widget.controller.query == null
                                  ? strings.text('news.latest')
                                  : strings.text('news.searchResults'),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(
                                    Icons.local_fire_department_outlined,
                                    size: 15,
                                    color: NewsPalette.danger,
                                  ),
                                  const SizedBox(width: 3),
                                  Text(
                                    strings.text('news.live'),
                                    style: const TextStyle(
                                      color: NewsPalette.danger,
                                      fontSize: 10,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      if (widget.controller.isLoading && articles.isEmpty)
                        const SliverFillRemaining(
                          hasScrollBody: false,
                          child: Center(child: CircularProgressIndicator()),
                        )
                      else if (failed)
                        SliverFillRemaining(
                          hasScrollBody: false,
                          child: _NewsLoadFailure(
                            message: strings.text('news.loadFailed'),
                            retryLabel: strings.text('common.retry'),
                            onRetry: widget.controller.refresh,
                          ),
                        )
                      else if (articles.isEmpty)
                        SliverFillRemaining(
                          hasScrollBody: false,
                          child: Center(
                            child: Text(
                              strings.text(widget.controller.query == null
                                  ? 'news.empty'
                                  : 'news.searchEmpty'),
                            ),
                          ),
                        )
                      else
                        SliverPadding(
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          sliver: SliverList.separated(
                            itemCount: articles.length - 1,
                            separatorBuilder: (_, __) => const Divider(),
                            itemBuilder: (context, index) {
                              final article = articles[index + 1];
                              return _ArticleRow(
                                article: article,
                                saved: widget.controller.savedIds
                                    .contains(article.id),
                                onSaved: () =>
                                    widget.controller.toggleSaved(article.id),
                                onOpen: () => _openArticle(article),
                              );
                            },
                          ),
                        ),
                      if (widget.controller.isLoadingMore)
                        const SliverToBoxAdapter(
                          child: Padding(
                            padding: EdgeInsets.all(16),
                            child: Center(
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          ),
                        ),
                      const SliverToBoxAdapter(child: SizedBox(height: 28)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _showSearchSheet(
    BuildContext context,
    NewsStrings strings,
  ) async {
    final selectedQuery = await showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (context) => _NewsSearchSheet(
        initialQuery: widget.controller.query ?? '',
        strings: strings,
      ),
    );
    if (selectedQuery != null && mounted) {
      await widget.controller.search(selectedQuery);
    }
  }
}

class NewsArticleDetailPage extends StatelessWidget {
  const NewsArticleDetailPage({
    super.key,
    required this.article,
    required this.onBack,
    required this.onSaved,
    required this.saved,
  });

  final NewsArticle article;
  final VoidCallback onBack;
  final VoidCallback onSaved;
  final bool saved;

  @override
  Widget build(BuildContext context) {
    final strings = NewsStrings.of(context);
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) onBack();
      },
      child: SafeArea(
        bottom: false,
        child: Column(
          children: [
            Container(
              height: 58,
              padding: const EdgeInsets.symmetric(horizontal: 10),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                border: Border(
                  bottom: BorderSide(
                    color: Theme.of(context).colorScheme.outline,
                  ),
                ),
              ),
              child: Row(
                children: [
                  IconButton(
                    key: const ValueKey('news.detail.back'),
                    tooltip:
                        MaterialLocalizations.of(context).backButtonTooltip,
                    onPressed: onBack,
                    icon: const Icon(Icons.arrow_back_rounded),
                  ),
                  Expanded(
                    child: Text(
                      strings.text('news.detail'),
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium
                          ?.copyWith(fontWeight: FontWeight.w800),
                    ),
                  ),
                  IconButton(
                    key: const ValueKey('news.detail.save'),
                    tooltip: saved
                        ? strings.text('news.unsave')
                        : strings.text('news.save'),
                    onPressed: onSaved,
                    icon: Icon(
                      saved
                          ? Icons.bookmark_rounded
                          : Icons.bookmark_border_rounded,
                      color: saved ? NewsPalette.primary : NewsPalette.muted,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 18, 16, 36),
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(7),
                    child: Image.asset(
                      article.imageAsset,
                      height: 210,
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 18),
                  Text(
                    _categoryLabel(strings, article.category),
                    style: const TextStyle(
                      color: NewsPalette.primary,
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    article.title,
                    style: Theme.of(context)
                        .textTheme
                        .headlineSmall
                        ?.copyWith(fontWeight: FontWeight.w800, height: 1.35),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    '${article.source} · ${article.timeLabel}',
                    style: const TextStyle(
                      color: NewsPalette.muted,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(height: 18),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: NewsPalette.primarySoft,
                      borderRadius: BorderRadius.circular(5),
                      border: const Border(
                        left: BorderSide(color: NewsPalette.primary, width: 3),
                      ),
                    ),
                    child: Text(
                      article.summary,
                      style: const TextStyle(
                        color: NewsPalette.primaryDark,
                        fontSize: 14,
                        height: 1.7,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  const SizedBox(height: 22),
                  if (article.body.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.surface,
                        borderRadius: BorderRadius.circular(5),
                        border: Border.all(
                          color: Theme.of(context).colorScheme.outline,
                        ),
                      ),
                      child: Text(
                        strings.text('news.summaryOnly'),
                        style: const TextStyle(
                          color: NewsPalette.muted,
                          fontSize: 12,
                          height: 1.6,
                        ),
                      ),
                    )
                  else
                    ...article.body.map(
                      (paragraph) => Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Text(
                          paragraph,
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.onSurface,
                            fontSize: 15,
                            height: 1.9,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NewsSearchSheet extends StatefulWidget {
  const _NewsSearchSheet({
    required this.initialQuery,
    required this.strings,
  });

  final String initialQuery;
  final NewsStrings strings;

  @override
  State<_NewsSearchSheet> createState() => _NewsSearchSheetState();
}

class _NewsSearchSheetState extends State<_NewsSearchSheet> {
  late final TextEditingController _controller =
      TextEditingController(text: widget.initialQuery);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submit() {
    Navigator.of(context).pop(_controller.text.trim());
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(
        16,
        14,
        16,
        16 + MediaQuery.viewInsetsOf(context).bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.strings.text('news.search'),
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 10),
          TextField(
            key: const ValueKey('news.search.input'),
            autofocus: true,
            controller: _controller,
            onSubmitted: (_) => _submit(),
            textInputAction: TextInputAction.search,
            decoration: InputDecoration(
              hintText: widget.strings.text('news.searchHint'),
              prefixIcon: const Icon(Icons.search_rounded),
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              key: const ValueKey('news.search.submit'),
              onPressed: _submit,
              icon: const Icon(Icons.search_rounded, size: 18),
              label: Text(widget.strings.text('news.searchAction')),
            ),
          ),
        ],
      ),
    );
  }
}

class _SearchContextBar extends StatelessWidget {
  const _SearchContextBar({
    required this.onClear,
    required this.query,
    required this.strings,
  });

  final VoidCallback onClear;
  final String query;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 42,
      padding: const EdgeInsets.only(left: 16, right: 6),
      decoration: const BoxDecoration(
        color: NewsPalette.primarySoft,
        border: Border(bottom: BorderSide(color: NewsPalette.line)),
      ),
      child: Row(
        children: [
          const Icon(Icons.search_rounded,
              color: NewsPalette.primary, size: 16),
          const SizedBox(width: 7),
          Expanded(
            child: Text(
              '“$query”',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: NewsPalette.primaryDark,
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          IconButton(
            key: const ValueKey('news.search.clear'),
            tooltip: strings.text('news.clearSearch'),
            onPressed: onClear,
            icon: const Icon(Icons.close_rounded, size: 18),
          ),
        ],
      ),
    );
  }
}

class _CategoryTabs extends StatelessWidget {
  const _CategoryTabs({required this.controller, required this.strings});

  final NewsFeedController controller;
  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    final categories = <(String, String)>[
      ('recommended', strings.text('news.recommended')),
      ('headlines', strings.text('news.headlines')),
      ('technology', strings.text('news.technology')),
      ('finance', strings.text('news.finance')),
      ('business', strings.text('news.business')),
      ('world', strings.text('news.world')),
      ('policy', strings.text('news.policy')),
    ];
    return Container(
      height: 46,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        border: Border(
          bottom: BorderSide(color: Theme.of(context).colorScheme.outline),
        ),
      ),
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 13),
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final item = categories[index];
          final selected =
              controller.query == null && controller.category == item.$1;
          return TextButton(
            onPressed: () => controller.selectCategory(item.$1),
            style: TextButton.styleFrom(
              foregroundColor:
                  selected ? NewsPalette.primary : NewsPalette.muted,
              shape: const RoundedRectangleBorder(),
              side: BorderSide(
                color: selected ? NewsPalette.primary : Colors.transparent,
                width: 0,
                strokeAlign: BorderSide.strokeAlignOutside,
              ),
            ),
            child: Text(
              item.$2,
              style: TextStyle(
                fontSize: 12,
                fontWeight: selected ? FontWeight.w700 : FontWeight.w400,
              ),
            ),
          );
        },
      ),
    );
  }
}

class _LeadStory extends StatelessWidget {
  const _LeadStory({required this.article, required this.onOpen});

  final NewsArticle article;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: '阅读 ${article.title}',
      child: InkWell(
        onTap: onOpen,
        borderRadius: BorderRadius.circular(7),
        child: AspectRatio(
          aspectRatio: 1.64,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(7),
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.asset(article.imageAsset, fit: BoxFit.cover),
                const DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Color(0xE8121C18)],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        NewsStrings.of(context).text('news.today'),
                        style: const TextStyle(
                          color: Color(0xFFB9EAD9),
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 7),
                      Text(
                        article.title,
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 19,
                          height: 1.4,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 7),
                      Text(
                        '${article.source} · ${article.timeLabel}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NewsLoadFailure extends StatelessWidget {
  const _NewsLoadFailure({
    required this.message,
    required this.retryLabel,
    required this.onRetry,
  });

  final String message;
  final String retryLabel;
  final Future<void> Function() onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.cloud_off_outlined, color: NewsPalette.muted),
            const SizedBox(height: 10),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 12),
            IconButton.filledTonal(
              tooltip: retryLabel,
              onPressed: onRetry,
              icon: const Icon(Icons.refresh_rounded),
            ),
          ],
        ),
      ),
    );
  }
}

class _ArticleRow extends StatelessWidget {
  const _ArticleRow({
    required this.article,
    required this.saved,
    required this.onOpen,
    required this.onSaved,
  });

  final NewsArticle article;
  final bool saved;
  final VoidCallback onOpen;
  final VoidCallback onSaved;

  @override
  Widget build(BuildContext context) {
    final strings = NewsStrings.of(context);
    return Semantics(
      button: true,
      label: '阅读 ${article.title}',
      child: InkWell(
        onTap: onOpen,
        child: SizedBox(
          height: 154,
          child: Row(
            children: [
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 13),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _categoryLabel(strings, article.category),
                        style: const TextStyle(
                          color: NewsPalette.primary,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 5),
                      Text(
                        article.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 14,
                          height: 1.45,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        '${article.source} · ${article.timeLabel}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: NewsPalette.muted,
                          fontSize: 10,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.chat_bubble_outline_rounded,
                              size: 14, color: NewsPalette.muted),
                          const SizedBox(width: 4),
                          Text('${article.commentCount}',
                              style: const TextStyle(
                                  color: NewsPalette.muted, fontSize: 10)),
                          const Spacer(),
                          IconButton(
                            visualDensity: VisualDensity.compact,
                            tooltip: MaterialLocalizations.of(context)
                                .viewLicensesButtonLabel,
                            onPressed: onSaved,
                            icon: Icon(
                              saved
                                  ? Icons.bookmark_rounded
                                  : Icons.bookmark_border_rounded,
                              size: 19,
                              color: saved
                                  ? NewsPalette.primary
                                  : NewsPalette.muted,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: Image.asset(
                  article.imageAsset,
                  width: 116,
                  height: 94,
                  fit: BoxFit.cover,
                  cacheWidth: 360,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

String _categoryLabel(NewsStrings strings, String category) =>
    switch (category) {
      'technology' => strings.text('news.technology'),
      'finance' => strings.text('news.finance'),
      'business' => strings.text('news.business'),
      'world' => strings.text('news.world'),
      'policy' => strings.text('news.policy'),
      'headlines' => strings.text('news.headlines'),
      _ => category,
    };
