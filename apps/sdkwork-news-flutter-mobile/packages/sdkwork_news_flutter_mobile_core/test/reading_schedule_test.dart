import 'package:sdkwork_news_flutter_mobile_core/sdkwork_news_flutter_mobile_core.dart';
import 'package:test/test.dart';

void main() {
  test('materializes bounded daily, weekly, and monthly cron schedules', () {
    expect(
      const ReadingSchedule(
        cadence: ReadingCadence.daily,
        hour: 8,
        minute: 30,
        additionalDailyTimes: [(hour: 18, minute: 0)],
      ).toCronExpressions(),
      ['30 8 * * *', '0 18 * * *'],
    );
    expect(
      const ReadingSchedule(
        cadence: ReadingCadence.weekly,
        hour: 9,
        minute: 0,
        weekday: DateTime.friday,
      ).toCronExpressions(),
      ['0 9 * * 5'],
    );
    expect(
      const ReadingSchedule(
        cadence: ReadingCadence.monthly,
        hour: 7,
        minute: 15,
        dayOfMonth: 1,
      ).toCronExpressions(),
      ['15 7 1 * *'],
    );
  });
}
