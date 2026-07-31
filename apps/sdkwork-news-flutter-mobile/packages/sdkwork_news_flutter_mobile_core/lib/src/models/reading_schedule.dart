enum ReadingCadence { daily, weekly, monthly }

class ReadingSchedule {
  const ReadingSchedule({
    required this.cadence,
    required this.hour,
    required this.minute,
    this.additionalDailyTimes = const [],
    this.weekday = DateTime.monday,
    this.dayOfMonth = 1,
    this.timezone = 'Asia/Shanghai',
    this.enabled = true,
  })  : assert(hour >= 0 && hour <= 23),
        assert(minute >= 0 && minute <= 59),
        assert(weekday >= DateTime.monday && weekday <= DateTime.sunday),
        assert(dayOfMonth >= 1 && dayOfMonth <= 28);

  final ReadingCadence cadence;
  final int hour;
  final int minute;
  final List<({int hour, int minute})> additionalDailyTimes;
  final int weekday;
  final int dayOfMonth;
  final String timezone;
  final bool enabled;

  List<String> toCronExpressions() {
    if (!enabled) {
      return const [];
    }
    return switch (cadence) {
      ReadingCadence.daily => [
          '$minute $hour * * *',
          ...additionalDailyTimes.map(
            (time) => '${time.minute} ${time.hour} * * *',
          ),
        ],
      ReadingCadence.weekly => [
          '$minute $hour * * ${weekday == DateTime.sunday ? 0 : weekday}',
        ],
      ReadingCadence.monthly => ['$minute $hour $dayOfMonth * *'],
    };
  }

  ReadingSchedule copyWith({
    ReadingCadence? cadence,
    int? hour,
    int? minute,
    List<({int hour, int minute})>? additionalDailyTimes,
    int? weekday,
    int? dayOfMonth,
    String? timezone,
    bool? enabled,
  }) {
    return ReadingSchedule(
      cadence: cadence ?? this.cadence,
      hour: hour ?? this.hour,
      minute: minute ?? this.minute,
      additionalDailyTimes: additionalDailyTimes ?? this.additionalDailyTimes,
      weekday: weekday ?? this.weekday,
      dayOfMonth: dayOfMonth ?? this.dayOfMonth,
      timezone: timezone ?? this.timezone,
      enabled: enabled ?? this.enabled,
    );
  }

  Map<String, Object?> toJson() => {
        'cadence': cadence.name,
        'hour': hour,
        'minute': minute,
        'additionalDailyTimes': [
          for (final time in additionalDailyTimes)
            {'hour': time.hour, 'minute': time.minute},
        ],
        'weekday': weekday,
        'dayOfMonth': dayOfMonth,
        'timezone': timezone,
        'enabled': enabled,
        'cron': toCronExpressions(),
      };

  factory ReadingSchedule.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return const ReadingSchedule(
        cadence: ReadingCadence.daily,
        hour: 8,
        minute: 30,
        additionalDailyTimes: [(hour: 18, minute: 0)],
      );
    }
    final cadenceName = json['cadence']?.toString();
    final times = json['additionalDailyTimes'];
    return ReadingSchedule(
      cadence: ReadingCadence.values.firstWhere(
        (value) => value.name == cadenceName,
        orElse: () => ReadingCadence.daily,
      ),
      hour: _boundedInt(json['hour'], 0, 23, 8),
      minute: _boundedInt(json['minute'], 0, 59, 30),
      additionalDailyTimes: times is List
          ? times
              .whereType<Map>()
              .map(
                (item) => (
                  hour: _boundedInt(item['hour'], 0, 23, 18),
                  minute: _boundedInt(item['minute'], 0, 59, 0),
                ),
              )
              .toList(growable: false)
          : const [],
      weekday: _boundedInt(
        json['weekday'],
        DateTime.monday,
        DateTime.sunday,
        DateTime.friday,
      ),
      dayOfMonth: _boundedInt(json['dayOfMonth'], 1, 28, 1),
      timezone: json['timezone']?.toString() ?? 'Asia/Shanghai',
      enabled: json['enabled'] is bool ? json['enabled'] as bool : true,
    );
  }
}

int _boundedInt(dynamic value, int min, int max, int fallback) {
  final parsed = value is int ? value : int.tryParse(value?.toString() ?? '');
  if (parsed == null || parsed < min || parsed > max) {
    return fallback;
  }
  return parsed;
}
