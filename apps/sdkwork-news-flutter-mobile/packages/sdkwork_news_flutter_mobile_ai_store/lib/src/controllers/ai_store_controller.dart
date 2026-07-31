import 'package:flutter/foundation.dart';

import '../models/ai_store_entry.dart';
import '../services/ai_store_repository.dart';

class AiStoreController extends ChangeNotifier {
  AiStoreController(this._repository);

  final AiStoreRepository _repository;
  AiStoreKind kind = AiStoreKind.product;
  List<AiStoreEntry> entries = const [];
  Set<String> installedIds = const {};
  Set<String> busyIds = const {};
  bool isLoading = false;
  String? errorMessage;

  Future<void> initialize() => _load();

  Future<void> selectKind(AiStoreKind next) async {
    if (kind == next) {
      return;
    }
    kind = next;
    entries = const [];
    notifyListeners();
    await _load();
  }

  Future<void> _load() async {
    if (isLoading) {
      return;
    }
    isLoading = true;
    errorMessage = null;
    notifyListeners();
    try {
      final page = await _repository.list(kind: kind, pageSize: 20);
      entries = List.unmodifiable(page.items);
    } catch (error) {
      errorMessage = '$error';
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> toggleInstalled(String id) async {
    if (busyIds.contains(id)) {
      return;
    }
    busyIds = Set.unmodifiable({...busyIds, id});
    notifyListeners();
    final next = {...installedIds};
    try {
      if (next.remove(id)) {
        await _repository.uninstall(id);
      } else {
        await _repository.install(id);
        next.add(id);
      }
      installedIds = Set.unmodifiable(next);
      errorMessage = null;
    } catch (error) {
      errorMessage = '$error';
    } finally {
      busyIds = Set.unmodifiable({...busyIds}..remove(id));
    }
    notifyListeners();
  }
}
