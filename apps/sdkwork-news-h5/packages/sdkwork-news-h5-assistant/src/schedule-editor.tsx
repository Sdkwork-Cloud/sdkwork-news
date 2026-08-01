import { useMemo, useState } from "react";
import { CalendarClock, Clock3, FileText, Plus, Trash2, X } from "lucide-react";
import {
  buildNewsReadingCronJobs,
  validateNewsReadingSchedule,
  type NewsReadingAgent,
  type NewsReadingSchedule,
  type NewsScheduleValidationIssue,
  type NewsWeekday,
} from "@sdkwork/news-agent-contracts";

export interface NewsH5ScheduleSheetProps {
  agent: NewsReadingAgent;
  onClose: () => void;
  onSave: (input: NewsH5AgentProfileInput) => Promise<void>;
}

export interface NewsH5AgentProfileInput {
  description: string;
  name: string;
  readingScope: NewsReadingAgent["readingScope"];
  schedule: NewsReadingSchedule;
  tone: NewsReadingAgent["tone"];
}

const weekdays: ReadonlyArray<{ label: string; value: NewsWeekday }> = [
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

export function NewsH5ScheduleSheet({ agent, onClose, onSave }: NewsH5ScheduleSheetProps) {
  const [name, setName] = useState(agent.name);
  const [description, setDescription] = useState(agent.description);
  const [categories, setCategories] = useState(agent.readingScope.categories.join("、"));
  const [keywords, setKeywords] = useState(agent.readingScope.keywords.join("、"));
  const [trustedSources, setTrustedSources] = useState(agent.readingScope.trustedSources.join("、"));
  const [tone, setTone] = useState(agent.tone);
  const [schedule, setSchedule] = useState(agent.schedule);
  const [pending, setPending] = useState(false);
  const [saveError, setSaveError] = useState("");
  const issues = useMemo(() => validateNewsReadingSchedule(schedule), [schedule]);
  const jobs = useMemo(() => issues.length === 0 ? buildNewsReadingCronJobs(schedule) : [], [issues.length, schedule]);

  const toggleWeekday = (weekday: NewsWeekday) => {
    const selected = schedule.weekly.weekdays.includes(weekday);
    const next = selected
      ? schedule.weekly.weekdays.filter((item) => item !== weekday)
      : [...schedule.weekly.weekdays, weekday].sort((left, right) => left - right);
    setSchedule({ ...schedule, weekly: { ...schedule.weekly, weekdays: next } });
  };

  const save = async () => {
    if (issues.length > 0 || !name.trim() || !description.trim() || pending) return;
    setPending(true);
    setSaveError("");
    try {
      await onSave({
        description: description.trim(),
        name: name.trim(),
        readingScope: {
          ...agent.readingScope,
          categories: parseProfileList(categories),
          keywords: parseProfileList(keywords),
          trustedSources: parseProfileList(trustedSources),
        },
        schedule,
        tone,
      });
    } catch {
      setSaveError("保存失败，请检查连接后重试");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="news-h5-sheet-backdrop">
      <div className="news-h5-sheet news-h5-sheet--schedule">
        <header>
          <div><strong>助手设置</strong><p>{name.trim() || agent.name} · 资料与阅读调度</p></div>
          <button onClick={onClose} type="button" title="关闭"><X size={19} /></button>
        </header>

        <div className="news-h5-schedule-body">
          <div className="news-h5-profile-fields">
            <label><span>名称</span><input aria-label="助手名称" onChange={(event) => setName(event.target.value)} value={name} /></label>
            <label><span>阅读职责</span><textarea aria-label="阅读职责" onChange={(event) => setDescription(event.target.value)} rows={3} value={description} /></label>
            <label><span>主题分类</span><input aria-label="主题分类" onChange={(event) => setCategories(event.target.value)} placeholder="宏观政策、资本市场" value={categories} /></label>
            <label><span>关键词</span><input aria-label="关键词" onChange={(event) => setKeywords(event.target.value)} placeholder="用逗号分隔" value={keywords} /></label>
            <label><span>可信来源</span><input aria-label="可信来源" onChange={(event) => setTrustedSources(event.target.value)} placeholder="机构或媒体名称" value={trustedSources} /></label>
            <label><span>输出风格</span><select aria-label="输出风格" onChange={(event) => setTone(event.target.value as NewsReadingAgent["tone"])} value={tone}><option value="brief">精简</option><option value="analytical">分析</option><option value="executive">决策摘要</option></select></label>
          </div>
          <label className="news-h5-switch-row">
            <span><strong>自动阅读</strong><small>按策略生成简报与总结</small></span>
            <input
              aria-label="启用自动阅读"
              checked={schedule.enabled}
              className="news-h5-toggle"
              onChange={(event) => setSchedule({ ...schedule, enabled: event.target.checked })}
              type="checkbox"
            />
          </label>

          <label className="news-h5-timezone-row">
            <span>调度时区</span>
            <select
              aria-label="调度时区"
              onChange={(event) => setSchedule({ ...schedule, timezone: event.target.value })}
              value={schedule.timezone}
            >
              {!timezoneOptions.includes(schedule.timezone as (typeof timezoneOptions)[number]) && (
                <option value={schedule.timezone}>{schedule.timezone}</option>
              )}
              {timezoneOptions.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}
            </select>
          </label>

          <div className="news-h5-schedule-section">
            <div className="news-h5-schedule-section__heading">
              <span><Clock3 size={17} /><span><strong>每日简报</strong><small>{formatDailySummary(schedule)}</small></span></span>
            </div>
            <div className="news-h5-daily-slots">
              {schedule.daily.map((slot, index) => (
                <div className="news-h5-daily-slot" key={slot.id}>
                  <input
                    aria-label={`${slot.enabled ? "停用" : "启用"}每日时段 ${index + 1}`}
                    checked={slot.enabled}
                    className="news-h5-toggle news-h5-toggle--compact"
                    onChange={(event) => setSchedule({
                      ...schedule,
                      daily: schedule.daily.map((item) => item.id === slot.id ? { ...item, enabled: event.target.checked } : item),
                    })}
                    type="checkbox"
                  />
                  <input
                    aria-label={`每日时段 ${index + 1}`}
                    onChange={(event) => setSchedule({
                      ...schedule,
                      daily: schedule.daily.map((item) => item.id === slot.id ? { ...item, time: event.target.value } : item),
                    })}
                    type="time"
                    value={slot.time}
                  />
                  <button
                    aria-label={`删除每日时段 ${index + 1}`}
                    disabled={schedule.daily.length === 1}
                    onClick={() => setSchedule({ ...schedule, daily: schedule.daily.filter((item) => item.id !== slot.id) })}
                    title="删除时段"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              className="news-h5-schedule-add"
              disabled={schedule.daily.length >= 12}
              onClick={() => setSchedule({
                ...schedule,
                daily: [
                  ...schedule.daily,
                  { enabled: true, id: createDailySlotId(schedule), time: findNextDailyTime(schedule) },
                ],
              })}
              type="button"
            >
              <Plus size={15} />
              添加时段
            </button>
          </div>

          <div className="news-h5-schedule-section">
            <div className="news-h5-schedule-section__heading">
              <span><CalendarClock size={17} /><span><strong>每周总结</strong><small>{formatWeeklySummary(schedule)}</small></span></span>
              <input
                aria-label="启用每周总结"
                checked={schedule.weekly.enabled}
                className="news-h5-toggle"
                onChange={(event) => setSchedule({ ...schedule, weekly: { ...schedule.weekly, enabled: event.target.checked } })}
                type="checkbox"
              />
            </div>
            <div aria-label="每周执行日期" className="news-h5-weekdays" role="group">
              {weekdays.map((weekday) => {
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
            <label className="news-h5-schedule-field">
              <span>执行时间</span>
              <input
                aria-label="每周执行时间"
                onChange={(event) => setSchedule({ ...schedule, weekly: { ...schedule.weekly, time: event.target.value } })}
                type="time"
                value={schedule.weekly.time}
              />
            </label>
          </div>

          <div className="news-h5-schedule-section">
            <div className="news-h5-schedule-section__heading">
              <span><FileText size={17} /><span><strong>月度复盘</strong><small>{formatMonthlySummary(schedule)}</small></span></span>
              <input
                aria-label="启用月度复盘"
                checked={schedule.monthly.enabled}
                className="news-h5-toggle"
                onChange={(event) => setSchedule({ ...schedule, monthly: { ...schedule.monthly, enabled: event.target.checked } })}
                type="checkbox"
              />
            </div>
            <label className="news-h5-schedule-field">
              <span>每月日期</span>
              <span className="news-h5-monthly-day">
                <input
                  aria-label="每月日期"
                  max={28}
                  min={1}
                  onChange={(event) => setSchedule({ ...schedule, monthly: { ...schedule.monthly, day: Number(event.target.value) } })}
                  type="number"
                  value={schedule.monthly.day}
                />
                <span>日</span>
              </span>
            </label>
            <label className="news-h5-schedule-field">
              <span>执行时间</span>
              <input
                aria-label="月度执行时间"
                onChange={(event) => setSchedule({ ...schedule, monthly: { ...schedule.monthly, time: event.target.value } })}
                type="time"
                value={schedule.monthly.time}
              />
            </label>
          </div>

          <div className="news-h5-cron-preview">
            <strong>调度规则</strong>
            {issues.length > 0 ? (
              <p role="alert">{formatValidationIssue(issues[0]!)}</p>
            ) : jobs.length > 0 ? (
              jobs.map((job) => <code key={job.id}><span>{formatJobKind(job.kind)}</span>{job.expression}</code>)
            ) : (
              <p>自动阅读已暂停，不会创建调度任务</p>
            )}
          </div>
          {saveError && <p className="news-h5-save-error" role="alert">{saveError}</p>}
        </div>

        <footer>
          <button onClick={onClose} type="button">取消</button>
          <button disabled={pending || issues.length > 0 || !name.trim() || !description.trim()} onClick={() => void save()} type="button">{pending ? "保存中" : "保存设置"}</button>
        </footer>
      </div>
    </div>
  );
}

function formatDailySummary(schedule: NewsReadingSchedule): string {
  const times = schedule.daily.filter((slot) => slot.enabled).map((slot) => slot.time);
  return times.length > 0 ? times.join("、") : "未启用";
}

function formatWeeklySummary(schedule: NewsReadingSchedule): string {
  if (!schedule.weekly.enabled) return "未启用";
  const labels = schedule.weekly.weekdays.map((day) => `周${weekdays.find((item) => item.value === day)?.label ?? day}`);
  return `${labels.join("、") || "未选择日期"} ${schedule.weekly.time}`;
}

function formatMonthlySummary(schedule: NewsReadingSchedule): string {
  return schedule.monthly.enabled ? `每月 ${schedule.monthly.day} 日 ${schedule.monthly.time}` : "未启用";
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

function parseProfileList(value: string): string[] {
  return Array.from(new Set(value.split(/[,，、\n]/u).map((item) => item.trim()).filter(Boolean)));
}
