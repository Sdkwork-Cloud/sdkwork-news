import '../models/account_preferences.dart';

abstract interface class AccountPreferencesRepository {
  Future<AccountPreferences> load();

  Future<void> save(AccountPreferences preferences);
}

class MemoryAccountPreferencesRepository
    implements AccountPreferencesRepository {
  MemoryAccountPreferencesRepository([
    this._preferences = const AccountPreferences(),
  ]);

  AccountPreferences _preferences;

  @override
  Future<AccountPreferences> load() async => _preferences;

  @override
  Future<void> save(AccountPreferences preferences) async {
    _preferences = preferences;
  }
}
