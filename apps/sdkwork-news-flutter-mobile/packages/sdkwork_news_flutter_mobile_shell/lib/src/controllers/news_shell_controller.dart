import 'package:flutter/foundation.dart';

enum NewsShellTab { assistant, news, store, account }

class NewsShellController extends ChangeNotifier {
  NewsShellTab activeTab = NewsShellTab.assistant;
  bool isSecondaryPage = false;

  void select(NewsShellTab tab) {
    if (activeTab == tab) {
      return;
    }
    activeTab = tab;
    notifyListeners();
  }

  void setSecondaryPage(bool value) {
    if (isSecondaryPage == value) {
      return;
    }
    isSecondaryPage = value;
    notifyListeners();
  }
}
