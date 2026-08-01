import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

import 'generated/news_catalog.dart';
import 'manifest.dart';

class NewsStrings {
  const NewsStrings._(this.locale, this._values);

  final Locale locale;
  final Map<String, String> _values;

  static NewsStrings of(BuildContext context) {
    final strings = Localizations.of<NewsStrings>(context, NewsStrings);
    assert(strings != null, 'NewsStringsDelegate is not registered');
    return strings!;
  }

  String text(String key) => _values[key] ?? key;

  String cronCount(int count) {
    final key =
        count == 1 ? 'assistant.cronCount.one' : 'assistant.cronCount.many';
    return text(key).replaceAll('{count}', '$count');
  }

  static const supportedLocales = <Locale>[
    Locale('zh', 'CN'),
    Locale('en', 'US'),
  ];
}

class NewsStringsDelegate extends LocalizationsDelegate<NewsStrings> {
  const NewsStringsDelegate(this.fragments);

  final List<NewsLocaleFragment> fragments;

  @override
  bool isSupported(Locale locale) => NewsStrings.supportedLocales
      .any((candidate) => candidate.languageCode == locale.languageCode);

  @override
  Future<NewsStrings> load(Locale locale) {
    final expectedSources = fragments.map((item) => item.sourceId).toSet();
    if (!setEquals(expectedSources, newsGeneratedLocaleSources.toSet())) {
      throw StateError(
        'Generated locale catalog does not match the composed fragments',
      );
    }
    final localeTag = locale.languageCode == 'en' ? 'en-US' : 'zh-CN';
    final fallback = newsGeneratedLocaleCatalog['zh-CN'];
    if (fallback == null) {
      throw StateError('Generated locale catalog is missing zh-CN');
    }
    final values = localeTag == 'zh-CN'
        ? fallback
        : <String, String>{
            ...fallback,
            ...?newsGeneratedLocaleCatalog[localeTag],
          };
    final resolvedLocale = localeTag == 'en-US'
        ? const Locale('en', 'US')
        : const Locale('zh', 'CN');
    return SynchronousFuture(
      NewsStrings._(resolvedLocale, Map.unmodifiable(values)),
    );
  }

  @override
  bool shouldReload(covariant NewsStringsDelegate old) => false;
}
