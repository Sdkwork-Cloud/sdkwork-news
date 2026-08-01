class NewsLocaleFragment {
  const NewsLocaleFragment({
    required this.localeTag,
    required this.packageName,
    required this.sourcePath,
  });

  final String localeTag;
  final String packageName;
  final String sourcePath;

  String get sourceId => '$packageName/$sourcePath';
}

const newsCommonsLocaleFragments = <NewsLocaleFragment>[
  NewsLocaleFragment(
    localeTag: 'zh-CN',
    packageName: 'sdkwork_news_flutter_mobile_commons',
    sourcePath: 'lib/src/i18n/zh-CN/news/commons/common.json',
  ),
  NewsLocaleFragment(
    localeTag: 'en-US',
    packageName: 'sdkwork_news_flutter_mobile_commons',
    sourcePath: 'lib/src/i18n/en-US/news/commons/common.json',
  ),
];
