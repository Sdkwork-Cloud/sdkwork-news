import 'package:sdkwork_news_flutter_mobile_agent_sdk_adapter/src/news_agent_manifest_codec.dart';
import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';
import 'package:test/test.dart';

void main() {
  test('emits the cross-client newsReader manifest contract', () {
    final manifest = NewsAgentManifestCodec.fromDraft(
      const NewsAgentDraft(
        name: '政策雷达',
        description: '跟踪政策变化',
        scopes: ['政策', '金融'],
        trustedSources: ['央行', '国务院'],
        outputStyle: NewsAgentOutputStyle.executive,
        schedule: ReadingSchedule.standard(),
      ),
    );
    final newsReader = manifest['newsReader'] as Map<String, dynamic>;
    final readingScope =
        newsReader['readingScope'] as Map<String, dynamic>;

    expect(manifest['kind'], newsReaderAgentManifestKind);
    expect(manifest['schemaVersion'], 1);
    expect(manifest.containsKey('news'), isFalse);
    expect(readingScope['categories'], ['政策', '金融']);
    expect(readingScope['trustedSources'], ['央行', '国务院']);
    expect(newsReader['tone'], 'executive');
    expect(newsReader['schedule'], {
      'daily': [
        {'id': 'morning', 'enabled': true, 'time': '08:30'},
        {'id': 'evening', 'enabled': true, 'time': '18:00'},
      ],
      'enabled': true,
      'monthly': {'day': 1, 'enabled': true, 'time': '09:30'},
      'timezone': 'Asia/Shanghai',
      'weekly': {
        'enabled': true,
        'time': '17:30',
        'weekdays': [DateTime.friday],
      },
    });
  });
}
