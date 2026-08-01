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
  String? nextCursor;
  bool hasMore = false;
  bool isLoading = false;
  bool isLoadingMore = false;
  String? errorMessage;

  Future<void> initialize() => _load(reset: true);

  Future<void> retry() => _load(reset: true);

  Future<void> selectKind(AiStoreKind next) async {
    if (kind == next) {
      return;
    }
    kind = next;
    entries = const [];
    nextCursor = null;
    hasMore = false;
    notifyListeners();
    await _load(reset: true);
  }

  Future<void> loadMore() => _load(reset: false);

  Future<void> _load({required bool reset}) async {
    if (isLoading || isLoadingMore || (!reset && !hasMore)) {
      return;
    }
    if (reset) {
      isLoading = true;
    } else {
      isLoadingMore = true;
    }
    errorMessage = null;
    notifyListeners();
    try {
      final page = await _repository.list(
        kind: kind,
        cursor: reset ? null : nextCursor,
        pageSize: 20,
      );
      final byId = <String, AiStoreEntry>{
        if (!reset)
          for (final entry in entries) entry.id: entry,
      };
      for (final entry in page.items) {
        byId[entry.id] = entry;
      }
      entries = List.unmodifiable(byId.values);
      nextCursor = page.nextCursor;
      hasMore = page.hasMore;
    } catch (error) {
      errorMessage = '$error';
    } finally {
      isLoading = false;
      isLoadingMore = false;
      notifyListeners();
    }
  }

  Future<void> toggleInstalled(String id) async {
    final entry = entries.where((item) => item.id == id).firstOrNull;
    if (busyIds.contains(id) || entry == null || !entry.installable) {
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
