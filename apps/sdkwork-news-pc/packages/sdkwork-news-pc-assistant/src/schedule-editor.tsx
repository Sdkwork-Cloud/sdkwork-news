import { useMemo, useState, type ReactNode } from "react";
import {
  CalendarClock,
  ChevronDown,
  Clock3,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import {
  buildNewsReadingCronJobs,
  validateNewsReadingSchedule,
  type NewsReadingSchedule,
  type NewsScheduleValidationIssue,
  type NewsWeekday,
} from "@sdkwork/news-agent-contracts";

type ScheduleSection = "daily" | "monthly" | "weekly";

export interface NewsScheduleEditorProps {
  onChange: (schedule: NewsReadingSchedule) => void;
  schedule: NewsReadingSchedule;
}

const weekdayOptions: ReadonlyArray<{ label: string; value: NewsWeekday }> = [
  { label: "一", value: 1 },
  { label: "二", value: 2 },
  { label: "三", value: 3 },
  { label: "四", value: 4 },
  { label: "五", value: 5 },
  { label: "六", value: 6 },
  { label: "日", value: 7 },
];

const timezoneOptions = [
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Asia/Tokyo",
  "Europe/London",
  "America/New_York",
  "UTC",
] as const;

export function NewsScheduleEditor({ onChange, schedule }: NewsScheduleEditorProps) {
  const [activeSection, setActiveSection] = useState<ScheduleSection | null>("daily");
  const issues = useMemo(() => validateNewsReadingSchedule(schedule), [schedule]);
  const jobs = useMemo(() => {
    if (issues.length > 0) return [];
    return buildNewsReadingCronJobs(schedule);
  }, [issues.length, schedule]);

  const updateDailySlot = (
    id: string,
    patch: Partial<NewsReadingSchedule["daily"][number]>,
  ) => {
    onChange({
      ...schedule,
      daily: schedule.daily.map((slot) => slot.id === id ? { ...slot, ...patch } : slot),
    });
  };

  const toggleWeekday = (weekday: NewsWeekday) => {
    const selected = schedule.weekly.weekdays.includes(weekday);
    const weekdays = selected
      ? schedule.weekly.weekdays.filter((item) => item !== weekday)
      : [...schedule.weekly.weekdays, weekday].sort((left, right) => left - right);
    onChange({ ...schedule, weekly: { ...schedule.weekly, weekdays } });
  };

  return (
    <>
      <label className="news-timezone-field">
        <span>时区</span>
        <span className="news-timezone-field__control">
          <select
            aria-label="调度时区"
            onChange={(event) => onChange({ ...schedule, timezone: event.target.value })}
            value={schedule.timezone}
          >
            {!timezoneOptions.includes(schedule.timezone as (typeof timezoneOptions)[number]) && (
              <option value={schedule.timezone}>{schedule.timezone}</option>
            )}
            {timezoneOptions.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}
          </select>
          <ChevronDown aria-hidden="true" size={14} />
        </span>
      </label>

      <div className="news-schedule-list">
        <ScheduleSummary
          active={activeSection === "daily"}
          icon={<Clock3 size={16} />}
          label="每日简报"
          onEdit={() => setActiveSection((current) => current === "daily" ? null : "daily")}
          summary={formatDailySummary(schedule)}
        />
        {activeSection === "daily" && (
          <div className="news-schedule-editor news-schedule-editor--daily">
            {schedule.daily.map((slot, index) => (
              <div className="news-schedule-time-row" key={slot.id}>
                <button
                  aria-label={`${slot.enabled ? "停用" : "启用"}时段 ${index + 1}`}
                  aria-pressed={slot.enabled}
                  className={`news-switch news-switch--compact${slot.enabled ? " is-on" : ""}`}
                  onClick={() => updateDailySlot(slot.id, { enabled: !slot.enabled })}
                  type="button"
                >
                  <span />
                </button>
                <input
                  aria-label={`每日时段 ${index + 1}`}
                  onChange={(event) => updateDailySlot(slot.id, { time: event.target.value })}
                  type="time"
                  value={slot.time}
                />
                <button
                  aria-label={`删除时段 ${index + 1}`}
                  className="news-schedule-icon-button"
                  disabled={schedule.daily.length === 1}
                  onClick={() => onChange({
                    ...schedule,
                    daily: schedule.daily.filter((item) => item.id !== slot.id),
                  })}
                  title="删除时段"
                  type="button"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              className="news-schedule-add"
              disabled={schedule.daily.length >= 12}
              onClick={() => onChange({
                ...schedule,
                daily: [
                  ...schedule.daily,
                  { enabled: true, id: createDailySlotId(schedule), time: findNextDailyTime(schedule) },
                ],
              })}
              type="button"
            >
              <Plus size={14} />
              添加时段
            </button>
          </div>
        )}

        <ScheduleSummary
          active={activeSection === "weekly"}
          icon={<CalendarClock size={16} />}
          label="每周总结"
          onEdit={() => setActiveSection((current) => current === "weekly" ? null : "weekly")}
          summary={formatWeeklySummary(schedule)}
        />
        {activeSection === "weekly" && (
          <div className="news-schedule-editor">
            <div className="news-schedule-rule-heading">
              <span>启用每周总结</span>
              <button
                aria-label="启用每周总结"
                aria-pressed={schedule.weekly.enabled}
                className={`news-switch news-switch--compact${schedule.weekly.enabled ? " is-on" : ""}`}
                onClick={() => onChange({
                  ...schedule,
                  weekly: { ...schedule.weekly, enabled: !schedule.weekly.enabled },
                })}
                type="button"
              >
                <span />
              </button>
            </div>
            <div aria-label="每周执行日期" className="news-weekday-control" role="group">
              {weekdayOptions.map((weekday) => {
                const selected = schedule.weekly.weekdays.includes(weekday.value);
                return (
                  <button
                    aria-pressed={selected}
                    className={selected ? "is-active" : ""}
                    key={weekday.value}
                    onClick={() => toggleWeekday(weekday.value)}
                    type="button"
                  >
                    {weekday.label}
                  </button>
                );
              })}
            </div>
            <label className="news-schedule-input-row">
              <span>执行时间</span>
              <input
                onChange={(event) => onChange({
                  ...schedule,
                  weekly: { ...schedule.weekly, time: event.target.value },
                })}
                type="time"
                value={schedule.weekly.time}
              />
            </label>
          </div>
        )}

        <ScheduleSummary
          active={activeSection === "monthly"}
          icon={<FileText size={16} />}
          label="月度复盘"
          onEdit={() => setActiveSection((current) => current === "monthly" ? null : "monthly")}
          summary={formatMonthlySummary(schedule)}
        />
        {activeSection === "monthly" && (
          <div className="news-schedule-editor">
            <div className="news-schedule-rule-heading">
              <span>启用月度复盘</span>
              <button
                aria-label="启用月度复盘"
                aria-pressed={schedule.monthly.enabled}
                className={`news-switch news-switch--compact${schedule.monthly.enabled ? " is-on" : ""}`}
                onClick={() => onChange({
                  ...schedule,
                  monthly: { ...schedule.monthly, enabled: !schedule.monthly.enabled },
                })}
                type="button"
              >
                <span />
              </button>
            </div>
            <label className="news-schedule-input-row">
              <span>每月日期</span>
              <span className="news-schedule-number-input">
                <input
                  max={28}
                  min={1}
                  onChange={(event) => onChange({
                    ...schedule,
                    monthly: { ...schedule.monthly, day: Number(event.target.value) },
                  })}
                  type="number"
                  value={schedule.monthly.day}
                />
                <span>日</span>
              </span>
            </label>
            <label className="news-schedule-input-row">
              <span>执行时间</span>
              <input
                onChange={(event) => onChange({
                  ...schedule,
                  monthly: { ...schedule.monthly, time: event.target.value },
                })}
                type="time"
                value={schedule.monthly.time}
              />
            </label>
          </div>
        )}
      </div>

      <div className="news-cron-preview">
        <label className="news-setting-label">调度规则</label>
        {issues.length > 0 ? (
          <p className="news-schedule-validation" role="alert">{formatValidationIssue(issues[0]!)}</p>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <div className="news-cron-preview__row" key={job.id}>
              <span>{formatJobKind(job.kind)}</span>
              <code>{job.expression}</code>
            </div>
          ))
        ) : (
          <p className="news-cron-preview__empty">自动阅读已暂停，不会创建调度任务</p>
        )}
      </div>
    </>
  );
}

function ScheduleSummary({
  active,
  icon,
  label,
  onEdit,
  summary,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onEdit: () => void;
  summary: string;
}) {
  return (
    <div className={`news-schedule-summary${active ? " is-active" : ""}`}>
      <span className="news-schedule-icon">{icon}</span>
      <div><strong>{label}</strong><p>{summary}</p></div>
      <button aria-expanded={active} aria-label={`${active ? "收起" : "编辑"}${label}`} onClick={onEdit} type="button">{active ? "收起" : "编辑"}</button>
    </div>
  );
}

function formatDailySummary(schedule: NewsReadingSchedule): string {
  const times = schedule.daily.filter((slot) => slot.enabled).map((slot) => slot.time);
  return times.length > 0 ? times.join("、") : "未启用";
}

function formatWeeklySummary(schedule: NewsReadingSchedule): string {
  if (!schedule.weekly.enabled) return "未启用";
  const labels = schedule.weekly.weekdays
    .map((weekday) => `周${weekdayOptions.find((item) => item.value === weekday)?.label ?? weekday}`)
    .join("、");
  return `${labels || "未选择日期"} ${schedule.weekly.time}`;
}

function formatMonthlySummary(schedule: NewsReadingSchedule): string {
  return schedule.monthly.enabled
    ? `每月 ${schedule.monthly.day} 日 ${schedule.monthly.time}`
    : "未启用";
}

function formatJobKind(kind: "daily" | "monthly" | "weekly"): string {
  if (kind === "daily") return "每日";
  if (kind === "weekly") return "每周";
  return "每月";
}

function formatValidationIssue(issue: NewsScheduleValidationIssue): string {
  const messages: Record<NewsScheduleValidationIssue["code"], string> = {
    "daily-slot-duplicate": "每日简报不能设置重复时段",
    "monthly-day-invalid": "月度日期需在 1 至 28 日之间",
    "schedule-empty": "请至少启用一个阅读任务",
    "time-invalid": "请输入有效的执行时间",
    "timezone-invalid": "请选择有效的时区",
    "weekly-days-empty": "请至少选择一个每周执行日期",
  };
  return messages[issue.code];
}

function createDailySlotId(schedule: NewsReadingSchedule): string {
  const usedIds = new Set(schedule.daily.map((slot) => slot.id));
  let sequence = schedule.daily.length + 1;
  while (usedIds.has(`slot-${sequence}`)) sequence += 1;
  return `slot-${sequence}`;
}

function findNextDailyTime(schedule: NewsReadingSchedule): string {
  const usedTimes = new Set(schedule.daily.map((slot) => slot.time));
  for (let offset = 0; offset < 24; offset += 1) {
    const hour = (10 + offset) % 24;
    for (const minute of [0, 30]) {
      const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      if (!usedTimes.has(time)) return time;
    }
  }
  return "00:00";
}
