class ReadingDailySlot {
  const ReadingDailySlot({
    required this.id,
    required this.hour,
    required this.minute,
    this.enabled = true,
  })  : assert(hour >= 0 && hour <= 23),
        assert(minute >= 0 && minute <= 59);

  final String id;
  final int hour;
  final int minute;
  final bool enabled;

  ReadingDailySlot copyWith({int? hour, int? minute, bool? enabled}) =>
      ReadingDailySlot(
        id: id,
        hour: hour ?? this.hour,
        minute: minute ?? this.minute,
        enabled: enabled ?? this.enabled,
      );

  Map<String, Object?> toJson() => {
        'id': id,
        'enabled': enabled,
        'time': _formatTime(hour, minute),
      };

  factory ReadingDailySlot.fromJson(Map<String, dynamic> json, int index) {
    final time = _parseTime(json['time'], fallbackHour: 8, fallbackMinute: 30);
    return ReadingDailySlot(
      id: _nonEmptyString(json['id']) ?? 'daily-${index + 1}',
      hour: time.hour,
      minute: time.minute,
      enabled: json['enabled'] is bool ? json['enabled'] as bool : true,
    );
  }
}

class ReadingWeeklyRule {
  const ReadingWeeklyRule({
    required this.hour,
    required this.minute,
    this.enabled = true,
    this.weekdays = const [DateTime.friday],
  })  : assert(hour >= 0 && hour <= 23),
        assert(minute >= 0 && minute <= 59);

  final bool enabled;
  final int hour;
  final int minute;
  final List<int> weekdays;

  ReadingWeeklyRule copyWith({
    bool? enabled,
    int? hour,
    int? minute,
    List<int>? weekdays,
  }) =>
      ReadingWeeklyRule(
        enabled: enabled ?? this.enabled,
        hour: hour ?? this.hour,
        minute: minute ?? this.minute,
        weekdays: weekdays ?? this.weekdays,
      );

  Map<String, Object?> toJson() => {
        'enabled': enabled,
        'time': _formatTime(hour, minute),
        'weekdays': weekdays,
      };

  factory ReadingWeeklyRule.fromJson(Map<String, dynamic>? json) {
    final time = _parseTime(json?['time'], fallbackHour: 17, fallbackMinute: 30);
    final weekdays = _intList(json?['weekdays'])
        .where((day) => day >= DateTime.monday && day <= DateTime.sunday)
        .toSet()
        .toList()
      ..sort();
    return ReadingWeeklyRule(
      enabled: json?['enabled'] is bool ? json!['enabled'] as bool : true,
      hour: time.hour,
      minute: time.minute,
      weekdays: weekdays.isEmpty ? const [DateTime.friday] : weekdays,
    );
  }
}

class ReadingMonthlyRule {
  const ReadingMonthlyRule({
    required this.day,
    required this.hour,
    required this.minute,
    this.enabled = true,
  })  : assert(day >= 1 && day <= 28),
        assert(hour >= 0 && hour <= 23),
        assert(minute >= 0 && minute <= 59);

  final int day;
  final bool enabled;
  final int hour;
  final int minute;

  ReadingMonthlyRule copyWith({
    int? day,
    bool? enabled,
    int? hour,
    int? minute,
  }) =>
      ReadingMonthlyRule(
        day: day ?? this.day,
        enabled: enabled ?? this.enabled,
        hour: hour ?? this.hour,
        minute: minute ?? this.minute,
      );

  Map<String, Object?> toJson() => {
        'day': day,
        'enabled': enabled,
        'time': _formatTime(hour, minute),
      };

  factory ReadingMonthlyRule.fromJson(Map<String, dynamic>? json) {
    final time = _parseTime(json?['time'], fallbackHour: 9, fallbackMinute: 30);
    return ReadingMonthlyRule(
      day: _boundedInt(json?['day'], 1, 28, 1),
      enabled: json?['enabled'] is bool ? json!['enabled'] as bool : true,
      hour: time.hour,
      minute: time.minute,
    );
  }
}

class ReadingSchedule {
  const ReadingSchedule({
    required this.daily,
    required this.weekly,
    required this.monthly,
    this.timezone = 'Asia/Shanghai',
    this.enabled = true,
  });

  const ReadingSchedule.standard()
      : daily = const [
          ReadingDailySlot(id: 'morning', hour: 8, minute: 30),
          ReadingDailySlot(id: 'evening', hour: 18, minute: 0),
        ],
        weekly = const ReadingWeeklyRule(hour: 17, minute: 30),
        monthly = const ReadingMonthlyRule(day: 1, hour: 9, minute: 30),
        timezone = 'Asia/Shanghai',
        enabled = true;

  final List<ReadingDailySlot> daily;
  final bool enabled;
  final ReadingMonthlyRule monthly;
  final String timezone;
  final ReadingWeeklyRule weekly;

  List<String> toCronExpressions() {
    if (!enabled) return const [];
    final expressions = <String>[
      for (final slot in daily)
        if (slot.enabled) '${slot.minute} ${slot.hour} * * *',
    ];
    if (weekly.enabled) {
      final days = [...weekly.weekdays]
        ..sort();
      final cronDays = days
          .map((day) => day == DateTime.sunday ? 0 : day)
          .join(',');
      if (cronDays.isNotEmpty) {
        expressions.add('${weekly.minute} ${weekly.hour} * * $cronDays');
      }
    }
    if (monthly.enabled) {
      expressions.add(
        '${monthly.minute} ${monthly.hour} ${monthly.day} * *',
      );
    }
    return List.unmodifiable(expressions);
  }

  ReadingSchedule copyWith({
    List<ReadingDailySlot>? daily,
    bool? enabled,
    ReadingMonthlyRule? monthly,
    String? timezone,
    ReadingWeeklyRule? weekly,
  }) =>
      ReadingSchedule(
        daily: daily ?? this.daily,
        enabled: enabled ?? this.enabled,
        monthly: monthly ?? this.monthly,
        timezone: timezone ?? this.timezone,
        weekly: weekly ?? this.weekly,
      );

  Map<String, Object?> toJson() => {
        'daily': [for (final slot in daily) slot.toJson()],
        'enabled': enabled,
        'monthly': monthly.toJson(),
        'timezone': timezone,
        'weekly': weekly.toJson(),
      };

  factory ReadingSchedule.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const ReadingSchedule.standard();
    if (json['daily'] is! List) {
      return ReadingSchedule._fromLegacyJson(json);
    }
    final daily = (json['daily'] as List)
        .asMap()
        .entries
        .map((entry) => _asMap(entry.value))
        .whereType<Map<String, dynamic>>()
        .toList()
        .asMap()
        .entries
        .map((entry) => ReadingDailySlot.fromJson(entry.value, entry.key))
        .toList(growable: false);
    return ReadingSchedule(
      daily: daily,
      enabled: json['enabled'] is bool ? json['enabled'] as bool : true,
      monthly: ReadingMonthlyRule.fromJson(_asMap(json['monthly'])),
      timezone: _nonEmptyString(json['timezone']) ?? 'Asia/Shanghai',
      weekly: ReadingWeeklyRule.fromJson(_asMap(json['weekly'])),
    );
  }

  factory ReadingSchedule._fromLegacyJson(Map<String, dynamic> json) {
    final cadence = json['cadence']?.toString() ?? 'daily';
    final hour = _boundedInt(json['hour'], 0, 23, 8);
    final minute = _boundedInt(json['minute'], 0, 59, 30);
    final additional = json['additionalDailyTimes'] is List
        ? (json['additionalDailyTimes'] as List)
            .map(_asMap)
            .whereType<Map<String, dynamic>>()
            .toList(growable: false)
        : const <Map<String, dynamic>>[];
    return ReadingSchedule(
      daily: [
        ReadingDailySlot(
          id: 'morning',
          hour: hour,
          minute: minute,
          enabled: cadence == 'daily',
        ),
        for (var index = 0; index < additional.length; index += 1)
          ReadingDailySlot(
            id: 'daily-${index + 2}',
            hour: _boundedInt(additional[index]['hour'], 0, 23, 18),
            minute: _boundedInt(additional[index]['minute'], 0, 59, 0),
            enabled: cadence == 'daily',
          ),
      ],
      enabled: json['enabled'] is bool ? json['enabled'] as bool : true,
      monthly: ReadingMonthlyRule(
        day: _boundedInt(json['dayOfMonth'], 1, 28, 1),
        hour: hour,
        minute: minute,
        enabled: cadence == 'monthly',
      ),
      timezone: _nonEmptyString(json['timezone']) ?? 'Asia/Shanghai',
      weekly: ReadingWeeklyRule(
        hour: hour,
        minute: minute,
        enabled: cadence == 'weekly',
        weekdays: [
          _boundedInt(
            json['weekday'],
            DateTime.monday,
            DateTime.sunday,
            DateTime.friday,
          ),
        ],
      ),
    );
  }
}

({int hour, int minute}) _parseTime(
  dynamic value, {
  required int fallbackHour,
  required int fallbackMinute,
}) {
  final parts = value?.toString().split(':') ?? const [];
  if (parts.length != 2) {
    return (hour: fallbackHour, minute: fallbackMinute);
  }
  return (
    hour: _boundedInt(parts[0], 0, 23, fallbackHour),
    minute: _boundedInt(parts[1], 0, 59, fallbackMinute),
  );
}

String _formatTime(int hour, int minute) =>
    '${hour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')}';

String? _nonEmptyString(dynamic value) {
  final text = value?.toString().trim();
  return text == null || text.isEmpty ? null : text;
}

List<int> _intList(dynamic value) => value is List
    ? value
        .map((item) => int.tryParse(item.toString()))
        .whereType<int>()
        .toList(growable: false)
    : const [];

Map<String, dynamic>? _asMap(dynamic value) {
  if (value is Map<String, dynamic>) return value;
  if (value is Map) {
    return value.map((key, item) => MapEntry('$key', item));
  }
  return null;
}

int _boundedInt(dynamic value, int min, int max, int fallback) {
  final parsed = value is int ? value : int.tryParse(value?.toString() ?? '');
  if (parsed == null || parsed < min || parsed > max) return fallback;
  return parsed;
}
