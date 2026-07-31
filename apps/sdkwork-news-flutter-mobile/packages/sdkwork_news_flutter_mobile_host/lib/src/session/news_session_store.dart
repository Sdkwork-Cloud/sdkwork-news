import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';

const newsFlutterSessionStorageKey = 'sdkwork-news:flutter:session:v1';

abstract interface class NewsSessionStore {
  Future<ImAppSession?> read();

  Future<void> write(ImAppSession session);

  Future<void> clear();
}

class SecureNewsSessionStore implements NewsSessionStore {
  const SecureNewsSessionStore({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  @override
  Future<ImAppSession?> read() async {
    final raw = await _storage.read(key: newsFlutterSessionStorageKey);
    if (raw == null || raw.isEmpty) {
      return null;
    }
    try {
      final decoded = jsonDecode(raw);
      if (decoded is! Map<String, dynamic>) {
        await clear();
        return null;
      }
      final session = ImAppSession.fromJson(decoded);
      if (!session.isComplete) {
        await clear();
        return null;
      }
      return session;
    } catch (_) {
      await clear();
      return null;
    }
  }

  @override
  Future<void> write(ImAppSession session) {
    if (!session.isComplete) {
      throw ArgumentError.value(session, 'session', 'Session is incomplete');
    }
    return _storage.write(
      key: newsFlutterSessionStorageKey,
      value: jsonEncode(session.toJson()),
    );
  }

  @override
  Future<void> clear() => _storage.delete(key: newsFlutterSessionStorageKey);
}

class MemoryNewsSessionStore implements NewsSessionStore {
  ImAppSession? _session;

  @override
  Future<void> clear() async => _session = null;

  @override
  Future<ImAppSession?> read() async => _session;

  @override
  Future<void> write(ImAppSession session) async => _session = session;
}
