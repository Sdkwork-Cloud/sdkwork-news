import '../models/account_profile.dart';

abstract interface class AccountRepository {
  Future<AccountProfile> currentProfile();

  Future<AccountProfile> updateDisplayName(String displayName);
}

class DemoAccountRepository implements AccountRepository {
  AccountProfile _profile = const AccountProfile(
    displayName: '林然',
    email: 'linran@sdkwork.com',
    initial: '林',
    planProgress: 0.68,
    favoriteCount: 128,
    historyCount: 46,
    offlineCount: 12,
  );

  @override
  Future<AccountProfile> currentProfile() async => _profile;

  @override
  Future<AccountProfile> updateDisplayName(String displayName) async {
    final normalized = displayName.trim();
    if (normalized.isEmpty) {
      throw const FormatException('displayName is required');
    }
    _profile = AccountProfile(
      displayName: normalized,
      email: _profile.email,
      initial: String.fromCharCode(normalized.runes.first),
      planProgress: _profile.planProgress,
      favoriteCount: _profile.favoriteCount,
      historyCount: _profile.historyCount,
      offlineCount: _profile.offlineCount,
    );
    return _profile;
  }
}
