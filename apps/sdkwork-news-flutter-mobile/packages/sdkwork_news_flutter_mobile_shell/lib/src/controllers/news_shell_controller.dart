import 'package:flutter/foundation.dart';

enum NewsShellTab { assistant, news, store, account }

class NewsShellController extends ChangeNotifier {
  NewsShellTab activeTab = NewsShellTab.assistant;

  void select(NewsShellTab tab) {
    if (activeTab == tab) {
      return;
    }
    activeTab = tab;
    notifyListeners();
  }
}
