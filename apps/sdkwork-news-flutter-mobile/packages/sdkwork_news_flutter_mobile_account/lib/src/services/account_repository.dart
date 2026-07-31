import '../models/account_profile.dart';

abstract interface class AccountRepository {
  Future<AccountProfile> currentProfile();
}

class DemoAccountRepository implements AccountRepository {
  @override
  Future<AccountProfile> currentProfile() async => const AccountProfile(
        displayName: '林然',
        email: 'linran@sdkwork.com',
        initial: '林',
        planProgress: 0.68,
        favoriteCount: 128,
        historyCount: 46,
        offlineCount: 12,
      );
}
