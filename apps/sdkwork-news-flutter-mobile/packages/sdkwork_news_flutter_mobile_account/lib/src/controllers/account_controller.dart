import 'package:flutter/foundation.dart';

import '../models/account_profile.dart';
import '../services/account_repository.dart';

class AccountController extends ChangeNotifier {
  AccountController(this._repository);

  final AccountRepository _repository;
  AccountProfile? profile;
  bool isLoading = false;
  String? errorMessage;

  Future<void> initialize() async {
    if (isLoading || profile != null) {
      return;
    }
    isLoading = true;
    notifyListeners();
    try {
      profile = await _repository.currentProfile();
      errorMessage = null;
    } catch (error) {
      errorMessage = '$error';
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
