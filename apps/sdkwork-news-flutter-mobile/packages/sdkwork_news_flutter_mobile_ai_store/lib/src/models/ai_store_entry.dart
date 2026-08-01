enum AiStoreKind { product, skill, mcp }

class AiStoreEntry {
  const AiStoreEntry({
    required this.id,
    required this.kind,
    required this.name,
    required this.publisher,
    required this.description,
    required this.monogram,
    required this.colorValue,
    this.rating,
    this.userCount,
    this.verified = true,
    this.installable = true,
    this.version = '1.0.0',
    this.capabilities = const <String>[],
  });

  final String id;
  final AiStoreKind kind;
  final String name;
  final String publisher;
  final String description;
  final String monogram;
  final int colorValue;
  final double? rating;
  final String? userCount;
  final bool verified;
  final bool installable;
  final String version;
  final List<String> capabilities;
}

class AiStorePageResult {
  const AiStorePageResult({
    required this.items,
    required this.hasMore,
    this.nextCursor,
  });

  final List<AiStoreEntry> items;
  final bool hasMore;
  final String? nextCursor;
}
