import 'package:flutter/material.dart';
import 'package:sdkwork_news_flutter_mobile_commons/sdkwork_news_flutter_mobile_commons.dart';

import '../controllers/news_shell_controller.dart';

class NewsMobileShell extends StatelessWidget {
  const NewsMobileShell({
    super.key,
    required this.controller,
    required this.assistant,
    required this.news,
    required this.store,
    required this.account,
  });

  final NewsShellController controller;
  final Widget assistant;
  final Widget news;
  final Widget store;
  final Widget account;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, _) {
        final strings = NewsStrings.of(context);
        final index = controller.activeTab.index;
        return Scaffold(
          body: IndexedStack(
            index: index,
            children: [assistant, news, store, account],
          ),
          bottomNavigationBar: NavigationBar(
            selectedIndex: index,
            onDestinationSelected: (value) =>
                controller.select(NewsShellTab.values[value]),
            destinations: [
              NavigationDestination(
                icon: const Icon(Icons.smart_toy_outlined),
                selectedIcon: const Icon(Icons.smart_toy_rounded),
                label: strings.text('nav.assistant'),
              ),
              NavigationDestination(
                icon: const Icon(Icons.newspaper_outlined),
                selectedIcon: const Icon(Icons.newspaper_rounded),
                label: strings.text('nav.news'),
              ),
              NavigationDestination(
                icon: const Icon(Icons.storefront_outlined),
                selectedIcon: const Icon(Icons.storefront_rounded),
                label: strings.text('nav.store'),
              ),
              NavigationDestination(
                icon: const Icon(Icons.person_outline_rounded),
                selectedIcon: const Icon(Icons.person_rounded),
                label: strings.text('nav.account'),
              ),
            ],
          ),
        );
      },
    );
  }
}
