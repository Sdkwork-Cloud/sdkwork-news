export type NewsWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface NewsDailyReadingSlot {
  enabled: boolean;
  id: string;
  time: string;
}

export interface NewsWeeklyReadingRule {
  enabled: boolean;
  time: string;
  weekdays: NewsWeekday[];
}

export interface NewsMonthlyReadingRule {
  day: number;
  enabled: boolean;
  time: string;
}

export interface NewsReadingSchedule {
  daily: NewsDailyReadingSlot[];
  enabled: boolean;
  monthly: NewsMonthlyReadingRule;
  timezone: string;
  weekly: NewsWeeklyReadingRule;
}

export type NewsReadingCronJobKind = "daily" | "weekly" | "monthly";

export interface NewsReadingCronJob {
  expression: string;
  id: string;
  kind: NewsReadingCronJobKind;
  timezone: string;
}

export interface NewsScheduleValidationIssue {
  code:
    | "daily-slot-duplicate"
    | "monthly-day-invalid"
    | "schedule-empty"
    | "time-invalid"
    | "timezone-invalid"
    | "weekly-days-empty";
  field: string;
}

const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/u;

export function createDefaultNewsReadingSchedule(
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
): NewsReadingSchedule {
  return {
    daily: [
      { enabled: true, id: "morning", time: "08:30" },
      { enabled: true, id: "evening", time: "18:00" },
    ],
    enabled: true,
    monthly: { day: 1, enabled: true, time: "09:30" },
    timezone,
    weekly: { enabled: true, time: "17:30", weekdays: [5] },
  };
}

export function validateNewsReadingSchedule(
  schedule: NewsReadingSchedule,
): NewsScheduleValidationIssue[] {
  const issues: NewsScheduleValidationIssue[] = [];
  const enabledDailySlots = schedule.daily.filter((slot) => slot.enabled);
  const dailyTimes = new Set<string>();

  if (!isIanaTimezone(schedule.timezone)) {
    issues.push({ code: "timezone-invalid", field: "timezone" });
  }

  schedule.daily.forEach((slot, index) => {
    if (!TIME_PATTERN.test(slot.time)) {
      issues.push({ code: "time-invalid", field: `daily.${index}.time` });
    }
    if (slot.enabled && dailyTimes.has(slot.time)) {
      issues.push({ code: "daily-slot-duplicate", field: `daily.${index}.time` });
    }
    if (slot.enabled) {
      dailyTimes.add(slot.time);
    }
  });

  if (schedule.weekly.enabled) {
    if (!TIME_PATTERN.test(schedule.weekly.time)) {
      issues.push({ code: "time-invalid", field: "weekly.time" });
    }
    if (schedule.weekly.weekdays.length === 0) {
      issues.push({ code: "weekly-days-empty", field: "weekly.weekdays" });
    }
  }

  if (schedule.monthly.enabled) {
    if (!TIME_PATTERN.test(schedule.monthly.time)) {
      issues.push({ code: "time-invalid", field: "monthly.time" });
    }
    if (!Number.isInteger(schedule.monthly.day) || schedule.monthly.day < 1 || schedule.monthly.day > 28) {
      issues.push({ code: "monthly-day-invalid", field: "monthly.day" });
    }
  }

  if (
    schedule.enabled &&
    enabledDailySlots.length === 0 &&
    !schedule.weekly.enabled &&
    !schedule.monthly.enabled
  ) {
    issues.push({ code: "schedule-empty", field: "enabled" });
  }

  return issues;
}

export function buildNewsReadingCronJobs(
  schedule: NewsReadingSchedule,
): NewsReadingCronJob[] {
  const issues = validateNewsReadingSchedule(schedule);
  if (issues.length > 0) {
    throw new Error(`Invalid news reading schedule: ${issues.map((issue) => issue.code).join(", ")}`);
  }
  if (!schedule.enabled) {
    return [];
  }

  const jobs: NewsReadingCronJob[] = schedule.daily
    .filter((slot) => slot.enabled)
    .map((slot) => ({
      expression: toCronExpression(slot.time, "*", "*"),
      id: `daily:${slot.id}`,
      kind: "daily" as const,
      timezone: schedule.timezone,
    }));

  if (schedule.weekly.enabled) {
    const weekdays = [...new Set(schedule.weekly.weekdays)]
      .sort((left, right) => left - right)
      .map((day) => (day === 7 ? 0 : day))
      .join(",");
    jobs.push({
      expression: toCronExpression(schedule.weekly.time, "*", weekdays),
      id: "weekly:summary",
      kind: "weekly",
      timezone: schedule.timezone,
    });
  }

  if (schedule.monthly.enabled) {
    jobs.push({
      expression: toCronExpression(schedule.monthly.time, String(schedule.monthly.day), "*"),
      id: "monthly:review",
      kind: "monthly",
      timezone: schedule.timezone,
    });
  }

  return jobs;
}

function toCronExpression(time: string, dayOfMonth: string, dayOfWeek: string): string {
  const [hour, minute] = time.split(":");
  return `${Number(minute)} ${Number(hour)} ${dayOfMonth} * ${dayOfWeek}`;
}

function isIanaTimezone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}
