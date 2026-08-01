import 'dart:convert';
import 'dart:io';

const _i18nMarker = '/lib/src/i18n/';
const _outputPath =
    'packages/sdkwork_news_flutter_mobile_commons/lib/src/i18n/generated/news_catalog.dart';

void main() {
  final fragmentFiles = Directory('packages')
      .listSync(recursive: true, followLinks: false)
      .whereType<File>()
      .where((file) {
    final path = _normalize(file.path);
    return path.contains(_i18nMarker) && path.endsWith('.json');
  }).toList(growable: false)
    ..sort((left, right) =>
        _normalize(left.path).compareTo(_normalize(right.path)));

  final catalogs = <String, Map<String, String>>{};
  final sourceIds = <String>[];
  for (final file in fragmentFiles) {
    final path = _normalize(file.path);
    final markerIndex = path.indexOf(_i18nMarker);
    final packageRoot = path.substring(0, markerIndex);
    final packageName = packageRoot.split('/').last;
    final sourcePath = path.substring(markerIndex + 1);
    final afterMarker = path.substring(markerIndex + _i18nMarker.length);
    final localeTag = afterMarker.split('/').first;
    final decoded = jsonDecode(file.readAsStringSync());
    if (decoded is! Map) {
      throw FormatException('Locale fragment $path must contain an object');
    }

    final catalog = catalogs.putIfAbsent(localeTag, () => <String, String>{});
    for (final entry in decoded.entries) {
      final key = entry.key.toString();
      final value = entry.value;
      if (value is! String) {
        throw FormatException('Locale value $key in $path must be a string');
      }
      if (catalog.containsKey(key)) {
        throw StateError('Duplicate locale key $key for $localeTag');
      }
      catalog[key] = value;
    }
    sourceIds.add('$packageName/$sourcePath');
  }

  if (!catalogs.containsKey('zh-CN') || !catalogs.containsKey('en-US')) {
    throw StateError('Locale fragments must provide zh-CN and en-US');
  }

  final output = _render(catalogs, sourceIds);
  final outputFile = File(_outputPath);
  outputFile.parent.createSync(recursive: true);
  if (!outputFile.existsSync() || outputFile.readAsStringSync() != output) {
    outputFile.writeAsStringSync(output);
  }
}

String _render(
  Map<String, Map<String, String>> catalogs,
  List<String> sourceIds,
) {
  final buffer = StringBuffer()
    ..writeln('// GENERATED CODE - DO NOT MODIFY BY HAND.')
    ..writeln('// Source: package-local JSON fragments under lib/src/i18n/.')
    ..writeln()
    ..writeln('const newsGeneratedLocaleSources = <String>[');
  for (final sourceId in sourceIds..sort()) {
    buffer.writeln('  ${_dartString(sourceId)},');
  }
  buffer
    ..writeln('];')
    ..writeln()
    ..writeln(
      'const newsGeneratedLocaleCatalog = <String, Map<String, String>>{',
    );
  final localeTags = catalogs.keys.toList(growable: false)..sort();
  for (final localeTag in localeTags) {
    buffer.writeln('  ${_dartString(localeTag)}: <String, String>{');
    final catalog = catalogs[localeTag]!;
    final keys = catalog.keys.toList(growable: false)..sort();
    for (final key in keys) {
      buffer.writeln(
        '    ${_dartString(key)}: ${_dartString(catalog[key]!)},',
      );
    }
    buffer.writeln('  },');
  }
  buffer.writeln('};');
  return buffer.toString();
}

String _dartString(String value) => jsonEncode(value).replaceAll(r'$', r'\$');

String _normalize(String value) => value.replaceAll('\\', '/');
