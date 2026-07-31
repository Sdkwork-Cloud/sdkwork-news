import 'package:flutter/material.dart';
import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';

import '../controllers/news_feed_controller.dart';
import '../models/news_article.dart';

class NewsFeedPage extends StatefulWidget {
  const NewsFeedPage({super.key, required this.controller});

  final NewsFeedController controller;

  @override
  State<NewsFeedPage> createState() => _NewsFeedPageState();
}

class _NewsFeedPageState extends State<NewsFeedPage> {
  final _scrollController = ScrollController();

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

  @override
  void dispose() {
    _scrollController.removeListener(_handleScroll);
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: widget.controller,
      builder: (context, _) {
        final strings = NewsStrings.of(context);
        return SafeArea(
          bottom: false,
          child: Column(
            children: [
              Container(
                height: 58,
                padding: const EdgeInsets.symmetric(horizontal: 14),
                color: NewsPalette.surface,
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
                      tooltip:
                          MaterialLocalizations.of(context).searchFieldLabel,
                      onPressed: () {},
                      icon: const Icon(Icons.search_rounded),
                    ),
                    IconButton(
                      tooltip: strings.text('news.recommended'),
                      onPressed: () {},
                      icon: const Icon(Icons.tune_rounded),
                    ),
                  ],
                ),
              ),
              _CategoryTabs(controller: widget.controller, strings: strings),
              Expanded(
                child: RefreshIndicator(
                  onRefresh: widget.controller.refresh,
                  child: CustomScrollView(
                    controller: _scrollController,
                    key: const PageStorageKey('news-feed'),
                    slivers: [
                      SliverPadding(
                        padding: const EdgeInsets.fromLTRB(14, 13, 14, 0),
                        sliver: SliverToBoxAdapter(
                          child: _LeadStory(strings: strings),
                        ),
                      ),
                      SliverPadding(
                        padding: const EdgeInsets.fromLTRB(14, 18, 14, 4),
                        sliver: SliverToBoxAdapter(
                          child: NewsSectionHeader(
                            title: strings.text('news.latest'),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.local_fire_department_outlined,
                                    size: 15, color: NewsPalette.danger),
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
                      if (widget.controller.isLoading &&
                          widget.controller.articles.isEmpty)
                        const SliverFillRemaining(
                          hasScrollBody: false,
                          child: Center(child: CircularProgressIndicator()),
                        )
                      else
                        SliverPadding(
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          sliver: SliverList.separated(
                            itemCount: widget.controller.articles.length,
                            separatorBuilder: (_, __) => const Divider(),
                            itemBuilder: (context, index) {
                              final article = widget.controller.articles[index];
                              return _ArticleRow(
                                article: article,
                                saved: widget.controller.savedIds
                                    .contains(article.id),
                                onSaved: () =>
                                    widget.controller.toggleSaved(article.id),
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
      decoration: const BoxDecoration(
        color: NewsPalette.surface,
        border: Border(bottom: BorderSide(color: NewsPalette.line)),
      ),
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 13),
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final item = categories[index];
          final selected = controller.category == item.$1;
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
  const _LeadStory({required this.strings});

  final NewsStrings strings;

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 1.64,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(7),
        child: Stack(
          fit: StackFit.expand,
          children: [
            Image.asset(NewsAssets.newsroom, fit: BoxFit.cover),
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
                    strings.text('news.today'),
                    style: const TextStyle(
                      color: Color(0xFFB9EAD9),
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 7),
                  const Text(
                    '从信息流到智能体：新闻阅读正在发生结构性变化',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 19,
                      height: 1.4,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 7),
                  const Text(
                    'SDKWork 研究院 · 12 分钟前',
                    style: TextStyle(color: Colors.white70, fontSize: 10),
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

class _ArticleRow extends StatelessWidget {
  const _ArticleRow({
    required this.article,
    required this.saved,
    required this.onSaved,
  });

  final NewsArticle article;
  final bool saved;
  final VoidCallback onSaved;

  @override
  Widget build(BuildContext context) {
    final categoryLabels = {
      'technology': NewsStrings.of(context).text('news.technology'),
      'finance': NewsStrings.of(context).text('news.finance'),
      'business': NewsStrings.of(context).text('news.business'),
      'world': NewsStrings.of(context).text('news.world'),
    };
    return SizedBox(
      height: 135,
      child: Row(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 13),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    categoryLabels[article.category] ?? article.category,
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
                          color:
                              saved ? NewsPalette.primary : NewsPalette.muted,
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
    );
  }
}
