import 'package:flutter/foundation.dart';

import '../models/account_profile.dart';
import '../models/account_preferences.dart';
import '../services/account_preferences_repository.dart';
import '../services/account_repository.dart';

class AccountController extends ChangeNotifier {
  AccountController(
    this._repository, {
    AccountPreferencesRepository? preferencesRepository,
  }) : _preferencesRepository =
            preferencesRepository ?? MemoryAccountPreferencesRepository();

  final AccountRepository _repository;
  final AccountPreferencesRepository _preferencesRepository;
  AccountProfile? profile;
  AccountPreferences preferences = const AccountPreferences();
  bool isLoading = false;
  bool isSaving = false;
  String? errorMessage;
  String? mutationError;
  String? mutationMessage;

  Future<void> retry() => initialize(force: true);

  Future<void> initialize({bool force = false}) async {
    if (isLoading || (!force && profile != null)) {
      return;
    }
    isLoading = true;
    notifyListeners();
    await Future.wait([_loadProfile(), _loadPreferences()]);
    isLoading = false;
    notifyListeners();
  }

  Future<void> _loadProfile() async {
    try {
      profile = await _repository.currentProfile();
      errorMessage = null;
    } catch (error) {
      errorMessage = '$error';
    }
  }

  Future<void> _loadPreferences() async {
    try {
      preferences = await _preferencesRepository.load();
      mutationError = null;
    } catch (error) {
      mutationError = '$error';
    }
  }

  Future<bool> updateDisplayName(String value) async {
    final normalized = value.trim();
    if (normalized.isEmpty || isSaving) return false;
    isSaving = true;
    mutationError = null;
    mutationMessage = null;
    notifyListeners();
    try {
      profile = await _repository.updateDisplayName(normalized);
      mutationMessage = 'account.profile.updated';
      return true;
    } catch (error) {
      mutationError = '$error';
      return false;
    } finally {
      isSaving = false;
      notifyListeners();
    }
  }

  Future<void> updatePreferences(
    AccountPreferences Function(AccountPreferences current) update,
  ) async {
    final previous = preferences;
    final next = update(previous);
    preferences = next;
    mutationError = null;
    notifyListeners();
    try {
      await _preferencesRepository.save(next);
    } catch (error) {
      preferences = previous;
      mutationError = '$error';
      notifyListeners();
    }
  }

  Future<void> removeSavedItem(String id) => updatePreferences(
        (current) => current.copyWith(
          savedItems:
              current.savedItems.where((item) => item.id != id).toList(),
        ),
      );

  Future<void> removeOfflineItem(String id) => updatePreferences(
        (current) => current.copyWith(
          offlineItems:
              current.offlineItems.where((item) => item.id != id).toList(),
        ),
      );

  Future<void> clearHistory() => updatePreferences(
        (current) => current.copyWith(historyItems: const []),
      );

  Future<void> removeDevice(String id) => updatePreferences(
        (current) => current.copyWith(
          devices: current.devices
              .where((device) => device.current || device.id != id)
              .toList(),
        ),
      );
}
