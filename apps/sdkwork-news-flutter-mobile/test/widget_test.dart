import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:sdkwork_news_flutter_mobile/app.dart';
import 'package:sdkwork_news_flutter_mobile/bootstrap/runtime.dart';

void main() {
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
}
