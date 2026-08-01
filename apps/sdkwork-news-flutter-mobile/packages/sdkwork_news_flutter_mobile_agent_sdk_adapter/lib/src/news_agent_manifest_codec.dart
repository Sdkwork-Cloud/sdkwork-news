import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';

const newsReaderAgentManifestKind = 'sdkwork.news.reader-agent';

class NewsAgentManifestCodec {
  const NewsAgentManifestCodec._();

  static Map<String, dynamic> fromDraft(NewsAgentDraft draft) => {
        'kind': newsReaderAgentManifestKind,
        'schemaVersion': 1,
        'newsReader': {
          'accent': '#08775a',
          'trustedSourcesOnly': draft.trustedSourcesOnly,
          'readingScope': {
            'categories': draft.scopes,
            'keywords': const <String>[],
            'languages': const ['zh-CN'],
            'regions': const ['CN'],
            'trustedSources': draft.trustedSources,
          },
          'schedule': draft.schedule.toJson(),
          'status': 'active',
          'tone': draft.outputStyle.name,
        },
      };

  static Map<String, dynamic> fromAgent(
    NewsAgent agent, {
    required String? conversationId,
  }) =>
      {
        'kind': newsReaderAgentManifestKind,
        'schemaVersion': 1,
        'newsReader': {
          'accent': _colorHex(agent.colorValue),
          if (conversationId != null && conversationId.isNotEmpty)
            'conversationId': conversationId,
          'trustedSourcesOnly': agent.trustedSourcesOnly,
          'readingScope': {
            'categories': agent.scopes,
            'keywords': const <String>[],
            'languages': const ['zh-CN'],
            'regions': const ['CN'],
            'trustedSources': agent.trustedSources,
          },
          'schedule': agent.schedule.toJson(),
          if (agent.summary.isNotEmpty) 'lastDigestSummary': agent.summary,
          'lastActivityLabel': agent.lastActivityLabel,
          'status': 'active',
          'tone': agent.outputStyle.name,
        },
      };
}

String _colorHex(int colorValue) =>
    '#${(colorValue & 0xFFFFFF).toRadixString(16).padLeft(6, '0')}';
