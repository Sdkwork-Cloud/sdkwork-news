import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';
import 'package:test/test.dart';

void main() {
  test('materializes simultaneous daily, weekly, and monthly cron schedules', () {
    const schedule = ReadingSchedule.standard();

    expect(schedule.toCronExpressions(), [
      '30 8 * * *',
      '0 18 * * *',
      '30 17 * * 5',
      '30 9 1 * *',
    ]);
    expect(schedule.toJson(), {
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

  test('migrates the previous single-cadence JSON shape', () {
    final schedule = ReadingSchedule.fromJson({
      'cadence': 'weekly',
      'hour': 9,
      'minute': 0,
      'weekday': DateTime.friday,
      'timezone': 'Asia/Shanghai',
      'enabled': true,
    });

    expect(schedule.toCronExpressions(), ['0 9 * * 5']);
    expect(schedule.toJson()['weekly'], {
      'enabled': true,
      'time': '09:00',
      'weekdays': [DateTime.friday],
    });
  });
}
