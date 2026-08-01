import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_news_flutter_mobile/app.dart';
import 'package:sdkwork_news_flutter_mobile/bootstrap/runtime.dart';
import 'package:sdkwork_news_flutter_mobile_account/sdkwork_news_flutter_mobile_account.dart';
import 'package:sdkwork_news_flutter_mobile_ai_store/sdkwork_news_flutter_mobile_ai_store.dart';
import 'package:sdkwork_news_flutter_mobile_assistant/sdkwork_news_flutter_mobile_assistant.dart';
import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';
import 'package:sdkwork_news_flutter_mobile_news/sdkwork_news_flutter_mobile_news.dart';
import 'package:sdkwork_news_flutter_mobile_shell/sdkwork_news_flutter_mobile_shell.dart';

const _testLocaleFragments = <NewsLocaleFragment>[
  ...newsCommonsLocaleFragments,
  ...newsShellLocaleFragments,
  ...newsAssistantLocaleFragments,
  ...newsFeedLocaleFragments,
  ...newsAiStoreLocaleFragments,
  ...newsAccountLocaleFragments,
];

void main() {
  test('clears a secondary page when switching primary tabs', () {
    final controller = NewsShellController();
    controller.setSecondaryPage(true);

    controller.select(NewsShellTab.news);

    expect(controller.activeTab, NewsShellTab.news);
    expect(controller.isSecondaryPage, isFalse);
  });

  testWidgets('renders the four-tab assistant-first shell', (tester) async {
    final runtime = NewsRuntime.demo();
    await tester.pumpWidget(NewsApp(runtime: runtime));
    await tester.pumpAndSettle();

    expect(find.text('阅读助手'), findsOneWidget);
    expect(find.byType(NavigationBar), findsOneWidget);
    expect(find.text('助手'), findsOneWidget);
    expect(find.text('新闻'), findsOneWidget);
    expect(find.text('AI Store'), findsOneWidget);
    expect(find.text('我的'), findsOneWidget);
  });

  testWidgets('hides the bottom tab bar inside assistant conversations',
      (tester) async {
    final runtime = NewsRuntime.demo();
    await tester.pumpWidget(NewsApp(runtime: runtime));
    await tester.pumpAndSettle();

    await tester.tap(find.text('市场雷达'));
    await tester.pumpAndSettle();
    expect(find.byType(NavigationBar), findsNothing);

    await tester.tap(find.byTooltip('返回'));
    await tester.pumpAndSettle();
    expect(find.byType(NavigationBar), findsOneWidget);
  });

  testWidgets('renders explicit unavailable states without demo fallback',
      (tester) async {
    final newsController =
        NewsFeedController(const UnavailableNewsFeedRepository());
    await tester.pumpWidget(
      _TestApp(child: NewsFeedPage(controller: newsController)),
    );
    await tester.pumpAndSettle();
    expect(
      find.text('新闻服务暂时不可用'),
      findsOneWidget,
      reason: _visibleText(tester),
    );

    final storeController =
        AiStoreController(const UnavailableAiStoreRepository());
    await tester.pumpWidget(
      _TestApp(child: AiStorePage(controller: storeController)),
    );
    await tester.pumpAndSettle();
    expect(find.text('此目录暂时不可用'), findsOneWidget);

    final accountController =
        AccountController(_UnavailableAccountRepository());
    await tester.pumpWidget(
      _TestApp(child: AccountPage(controller: accountController)),
    );
    await tester.pumpAndSettle();
    expect(find.text('账号资料暂时无法加载'), findsOneWidget);

    newsController.dispose();
    storeController.dispose();
    accountController.dispose();
  });

  testWidgets('loads feature-owned English locale fragments', (tester) async {
    final runtime = NewsRuntime.demo();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en', 'US'),
        supportedLocales: NewsStrings.supportedLocales,
        localizationsDelegates: const [
          NewsStringsDelegate(_testLocaleFragments),
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        home: NewsMobileShell(
          controller: runtime.shellController!,
          assistant: AssistantPage(controller: runtime.assistantController!),
          news: NewsFeedPage(controller: runtime.newsController!),
          store: AiStorePage(controller: runtime.storeController!),
          account: AccountPage(controller: runtime.accountController!),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(
      find.text('Reading Assistants'),
      findsOneWidget,
      reason: _visibleText(tester),
    );
    expect(find.text('Assistant'), findsOneWidget);
    expect(find.text('News'), findsOneWidget);
    expect(find.text('AI Store'), findsOneWidget);
    expect(find.text('Account'), findsOneWidget);

    runtime.dispose();
  });

  testWidgets('switches locale from account settings', (tester) async {
    final runtime = NewsRuntime.demo();
    await tester.pumpWidget(NewsApp(runtime: runtime));
    await tester.pumpAndSettle();

    await tester.tap(find.text('我的'));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('account.settings.open')));
    await tester.pumpAndSettle();

    expect(find.text('English (US)'), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('account.locale.en-US')));
    await tester.pumpAndSettle();

    expect(find.text('Account'), findsNWidgets(2));
    expect(find.text('Assistant'), findsOneWidget);
    expect(find.text('News'), findsOneWidget);
    expect(find.byTooltip('Settings'), findsOneWidget);
  });

  testWidgets('searches the Flutter news feed', (tester) async {
    final controller = NewsFeedController(DemoNewsFeedRepository());
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      _TestApp(child: NewsFeedPage(controller: controller)),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const ValueKey('news.search.open')));
    await tester.pumpAndSettle();
    await tester.enterText(
      find.byKey(const ValueKey('news.search.input')),
      '供应链',
    );
    await tester.tap(find.byKey(const ValueKey('news.search.submit')));
    await tester.pumpAndSettle();

    expect(find.text('“供应链”'), findsOneWidget);
    expect(find.text('全球供应链继续区域化，制造企业重新校准库存策略'), findsOneWidget);
    expect(find.text('AI Agent 开始进入企业核心工作流，评估标准正在改变'), findsNothing);
    expect(find.byKey(const ValueKey('news.search.clear')), findsOneWidget);
  });

  testWidgets('edits an assistant profile with simultaneous cron rules',
      (tester) async {
    final runtime = NewsRuntime.demo();
    await tester.pumpWidget(NewsApp(runtime: runtime));
    await tester.pumpAndSettle();

    await tester.tap(find.text('市场雷达'));
    await tester.pumpAndSettle();
    await tester.tap(find.byTooltip('助手设置'));
    await tester.pumpAndSettle();

    expect(find.text('30 8 * * *'), findsOneWidget);
    expect(find.text('0 18 * * *'), findsOneWidget);
    expect(find.text('30 17 * * 5'), findsOneWidget);
    expect(find.text('30 9 1 * *'), findsOneWidget);

    await tester.enterText(
      find.widgetWithText(TextField, '智能体名称'),
      '政策决策雷达',
    );
    await tester.enterText(
      find.widgetWithText(TextField, '可信来源'),
      '央行、国务院',
    );
    final save = find.widgetWithText(FilledButton, '保存设置');
    await tester.ensureVisible(save);
    await tester.tap(save);
    await tester.pumpAndSettle();

    expect(find.text('政策决策雷达'), findsOneWidget);
    expect(
      runtime.assistantController!.selectedAgent?.trustedSources,
      ['央行', '国务院'],
    );
  });
}

class _TestApp extends StatelessWidget {
  const _TestApp({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) => MaterialApp(
        locale: const Locale('zh', 'CN'),
        supportedLocales: NewsStrings.supportedLocales,
        localizationsDelegates: const [
          NewsStringsDelegate(_testLocaleFragments),
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        home: Scaffold(body: child),
      );
}

class _UnavailableAccountRepository implements AccountRepository {
  @override
  Future<AccountProfile> currentProfile() =>
      Future.error(StateError('IAM unavailable'));
}

String _visibleText(WidgetTester tester) => tester
    .widgetList<Text>(find.byType(Text))
    .map((widget) => widget.data ?? widget.textSpan?.toPlainText() ?? '')
    .where((value) => value.isNotEmpty)
    .join(' | ');
