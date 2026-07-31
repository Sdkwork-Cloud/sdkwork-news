import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';

import '../models/news_article.dart';

abstract interface class NewsFeedRepository {
  Future<NewsArticlePage> list({
    required String category,
    String? cursor,
    int pageSize = 20,
  });
}

class DemoNewsFeedRepository implements NewsFeedRepository {
  @override
  Future<NewsArticlePage> list({
    required String category,
    String? cursor,
    int pageSize = 20,
  }) async {
    final offset = int.tryParse(cursor ?? '') ?? 0;
    final boundedSize = pageSize.clamp(1, 200);
    final filtered = category == 'recommended'
        ? demoArticles
        : demoArticles
            .where((article) => article.category == category)
            .toList(growable: false);
    final end = (offset + boundedSize).clamp(0, filtered.length);
    return NewsArticlePage(
      items:
          offset >= filtered.length ? const [] : filtered.sublist(offset, end),
      hasMore: end < filtered.length,
      nextCursor: end < filtered.length ? '$end' : null,
    );
  }
}

const demoArticles = <NewsArticle>[
  NewsArticle(
    id: 'ai-agent-workflow',
    category: 'technology',
    title: 'AI Agent 开始进入企业核心工作流，评估标准正在改变',
    source: 'MIT Technology Review',
    timeLabel: '42 分钟前',
    imageAsset: NewsAssets.aiChips,
    commentCount: 186,
    summary: '可靠性、权限边界和可观察性成为采购决策的核心。',
  ),
  NewsArticle(
    id: 'market-liquidity',
    category: 'finance',
    title: '资金面延续宽松，市场关注下一阶段政策信号',
    source: '第一财经',
    timeLabel: '1 小时前',
    imageAsset: NewsAssets.markets,
    commentCount: 92,
    summary: '短端利率回落，但机构对趋势判断仍保持谨慎。',
  ),
  NewsArticle(
    id: 'software-pricing',
    category: 'business',
    title: '企业软件定价从席位转向结果，新的商业模型浮出水面',
    source: 'Bloomberg',
    timeLabel: '2 小时前',
    imageAsset: NewsAssets.workspace,
    commentCount: 64,
    summary: 'AI 产品开始按任务、调用或业务结果计费。',
  ),
  NewsArticle(
    id: 'supply-chain',
    category: 'world',
    title: '全球供应链继续区域化，制造企业重新校准库存策略',
    source: 'Reuters',
    timeLabel: '3 小时前',
    imageAsset: NewsAssets.logistics,
    commentCount: 41,
    summary: '关键零部件的多源策略明显增加。',
  ),
];
