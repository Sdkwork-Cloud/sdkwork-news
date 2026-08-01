import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:sdkwork_news_flutter_mobile_account/sdkwork_news_flutter_mobile_account.dart';

const newsAccountPreferencesStorageKey =
    'sdkwork.news.flutter.account.preferences.v1';

class SecureAccountPreferencesRepository
    implements AccountPreferencesRepository {
  const SecureAccountPreferencesRepository({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  @override
  Future<AccountPreferences> load() async {
    final raw = await _storage.read(key: newsAccountPreferencesStorageKey);
    if (raw == null || raw.isEmpty) {
      return const AccountPreferences();
    }
    try {
      final decoded = jsonDecode(raw);
      if (decoded is! Map) {
        return const AccountPreferences();
      }
      return AccountPreferences.fromJson(
        decoded.map((key, value) => MapEntry('$key', value)),
      );
    } on FormatException {
      return const AccountPreferences();
    }
  }

  @override
  Future<void> save(AccountPreferences preferences) => _storage.write(
        key: newsAccountPreferencesStorageKey,
        value: jsonEncode(preferences.toJson()),
      );
}
