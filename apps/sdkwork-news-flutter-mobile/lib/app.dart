import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:sdkwork_news_flutter_mobile_account/sdkwork_news_flutter_mobile_account.dart';
import 'package:sdkwork_news_flutter_mobile_ai_store/sdkwork_news_flutter_mobile_ai_store.dart';
import 'package:sdkwork_news_flutter_mobile_assistant/sdkwork_news_flutter_mobile_assistant.dart';
import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';
import 'package:sdkwork_news_flutter_mobile_news/sdkwork_news_flutter_mobile_news.dart';
import 'package:sdkwork_news_flutter_mobile_shell/sdkwork_news_flutter_mobile_shell.dart';

import 'bootstrap/runtime.dart';

const _newsLocaleFragments = <NewsLocaleFragment>[
  ...newsCommonsLocaleFragments,
  ...newsShellLocaleFragments,
  ...newsAssistantLocaleFragments,
  ...newsFeedLocaleFragments,
  ...newsAiStoreLocaleFragments,
  ...newsAccountLocaleFragments,
];

class NewsApp extends StatefulWidget {
  const NewsApp({super.key, required this.runtime});

  final NewsRuntime runtime;

  @override
  State<NewsApp> createState() => _NewsAppState();
}

class _NewsAppState extends State<NewsApp> {
  Locale _locale = const Locale('zh', 'CN');

  void _selectLocale(Locale locale) {
    if (_locale == locale) {
      return;
    }
    setState(() => _locale = locale);
  }

  @override
  void dispose() {
    widget.runtime.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'SDKWork News',
      theme: NewsTheme.light(),
      locale: _locale,
      supportedLocales: NewsStrings.supportedLocales,
      localizationsDelegates: const [
        NewsStringsDelegate(_newsLocaleFragments),
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: widget.runtime.requiresSignIn
          ? const NewsAuthRequiredPage()
          : NewsMobileShell(
              controller: widget.runtime.shellController!,
              assistant: AssistantPage(
                controller: widget.runtime.assistantController!,
              ),
              news: NewsFeedPage(controller: widget.runtime.newsController!),
              store: AiStorePage(controller: widget.runtime.storeController!),
              account: AccountPage(
                controller: widget.runtime.accountController!,
                locale: _locale,
                onLocaleChanged: _selectLocale,
              ),
            ),
    );
  }
}

class NewsAuthRequiredPage extends StatelessWidget {
  const NewsAuthRequiredPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(28),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 58,
                  height: 58,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: NewsPalette.primary,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.newspaper_rounded,
                      color: Colors.white, size: 30),
                ),
                const SizedBox(height: 18),
                Text(
                  NewsStrings.of(context).text('app.name'),
                  style: Theme.of(context)
                      .textTheme
                      .headlineSmall
                      ?.copyWith(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8),
                Text(
                  NewsStrings.of(context).text('auth.required'),
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: NewsPalette.muted),
                ),
                const SizedBox(height: 18),
                FilledButton.icon(
                  onPressed: null,
                  icon: const Icon(Icons.login_rounded),
                  label: Text(NewsStrings.of(context).text('auth.login')),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
