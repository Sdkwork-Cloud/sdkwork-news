import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, BellRing, Bot, CalendarClock, ChevronRight, Clock3, FileText, Paperclip, Plus, Search, Send, Settings2, ShieldCheck, Sparkles, X } from "lucide-react";
import { createDefaultNewsReadingSchedule, type CreateNewsReadingAgentInput, type NewsConversationMessage, type NewsReadingAgent, type NewsReadingSchedule } from "@sdkwork/news-agent-contracts";
import type { NewsAgentService } from "@sdkwork/news-agent-service";
import "./styles.css";
import "./interaction.css";

export interface NewsH5AssistantProps { service?: NewsAgentService; }

const showcaseAgents: NewsReadingAgent[] = [
  createShowcaseAgent("market", "市场雷达", "#0b7d5e", "宏观政策 · 资本市场 · 产业资金", "央行公开市场操作出现边际变化，3 个行业受影响", 3),
  createShowcaseAgent("ai", "AI 前沿", "#2567a3", "模型 · Agent · 开发工具", "两项模型能力更新值得进入本周技术评审", 1),
  createShowcaseAgent("competitor", "竞品观察", "#8b5a25", "发布 · 定价 · 客户动向", "竞品 A 调整企业版定价，核心功能边界未变", 0),
  createShowcaseAgent("policy", "政策简报", "#8a3d50", "监管文件 · 生效时间 · 风险", "本周政策周报已完成，共识别 4 项行动要求", 0),
];

const showcaseMessages: NewsConversationMessage[] = [
  { id: "showcase-user", occurredAt: "2026-07-31T08:30:00+08:00", role: "user", status: "sent", text: "按早间策略执行，重点看政策变化和市场传导。" },
  { id: "showcase-agent", occurredAt: "2026-07-31T08:31:00+08:00", role: "agent", status: "sent", text: "已完成 126 个来源的增量阅读，去重后保留 9 条。下面 3 条需要你今天关注。" },
];

export function NewsH5Assistant({ service }: NewsH5AssistantProps) {
  const [agents, setAgents] = useState(showcaseAgents);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [messages, setMessages] = useState(showcaseMessages);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const activeAgent = agents.find((agent) => agent.id === activeAgentId) ?? null;
  const filteredAgents = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return normalized ? agents.filter((agent) => `${agent.name} ${agent.description}`.toLocaleLowerCase().includes(normalized)) : agents;
  }, [agents, query]);

  useEffect(() => {
    if (!service) return;
    let disposed = false;
    void service.list({ page: 1, pageSize: 20 }).then((page) => { if (!disposed) setAgents(page.items); }).catch(() => undefined);
    return () => { disposed = true; };
  }, [service]);

  useEffect(() => {
    if (!service || !activeAgentId) { setMessages(showcaseMessages); return; }
    let disposed = false;
    let close: (() => void) | undefined;
    setMessages([]);
    void service.listMessages(activeAgentId, { pageSize: 50 }).then((page) => { if (!disposed) setMessages(page.items); });
    void service.subscribe(activeAgentId, (message) => { if (!disposed) setMessages((current) => mergeMessages(current, message)); }).then((subscription) => {
      close = () => subscription.close();
      if (disposed) close();
    });
    return () => { disposed = true; close?.(); };
  }, [activeAgentId, service]);

  const send = async () => {
    const text = draft.trim();
    if (!activeAgent || !text || isSending) return;
    const optimistic: NewsConversationMessage = { id: `local:${Date.now()}`, occurredAt: new Date().toISOString(), role: "user", status: "sent", text };
    setMessages((current) => [...current, optimistic]);
    setDraft("");
    setIsSending(true);
    try {
      if (service) {
        await service.sendText(activeAgent.id, text);
      } else {
        const id = `showcase:${Date.now()}`;
        setMessages((current) => mergeMessages(current, { id, occurredAt: new Date().toISOString(), role: "agent", status: "streaming", text: "正在核对来源与时间线..." }));
        window.setTimeout(() => setMessages((current) => mergeMessages(current, { id, occurredAt: new Date().toISOString(), role: "agent", status: "sent", text: "已核对来源与时间线，稍后给出可执行结论。" })), 500);
      }
    } finally { setIsSending(false); }
  };

  const createAgent = async (input: CreateNewsReadingAgentInput) => {
    const created = service ? await service.create(input) : createShowcaseAgent(`local-${Date.now()}`, input.name, input.accent, input.description, "等待首次阅读任务", 0, input.schedule);
    setAgents((current) => [created, ...current.filter((item) => item.id !== created.id)]);
    setCreateOpen(false);
  };

  const saveSchedule = async (schedule: NewsReadingSchedule) => {
    if (!activeAgent) return;
    const updated = service ? await service.update(activeAgent.id, { schedule }) : { ...activeAgent, schedule, updatedAt: new Date().toISOString() };
    setAgents((current) => current.map((agent) => agent.id === updated.id ? updated : agent));
    setProfileOpen(false);
  };

  if (activeAgent) {
    return <div className="news-h5-chat">
      <header><button onClick={() => setActiveAgentId(null)} type="button" title="返回"><ArrowLeft size={21} /></button><span style={{ background: activeAgent.accent }}>{activeAgent.name.slice(0, 1)}</span><div><h1>{activeAgent.name}</h1><p><i />工作中</p></div><button onClick={() => setProfileOpen(true)} type="button" title="助手设置"><Settings2 size={20} /></button></header>
      <main><div className="news-h5-chat__day">今天</div>{messages.map((message) => <article className={`news-h5-chat__message news-h5-chat__message--${message.role}`} key={message.id}>{message.role === "agent" && <span style={{ background: activeAgent.accent }}>{activeAgent.name.slice(0, 1)}</span>}<p>{message.text}{message.status === "streaming" && <i className="news-h5-stream-caret" />}</p></article>)}<DigestCard /></main>
      <footer><button type="button" title="添加附件"><Paperclip size={20} /></button><label><textarea rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="问问助手" /></label><button disabled={!draft.trim() || isSending} onClick={() => void send()} type="button" title="发送"><Send size={18} /></button></footer>
      {profileOpen && <ScheduleSheet agent={activeAgent} onClose={() => setProfileOpen(false)} onSave={saveSchedule} />}
    </div>;
  }

  return <div className="news-h5-assistant">
    <header><div><h1>阅读助手</h1><p>今天有 4 条重要更新</p></div><button onClick={() => setCreateOpen(true)} type="button" title="创建智能体"><Plus size={20} /></button></header>
    <label className="news-h5-assistant__search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索助手" /></label>
    <section className="news-h5-summary"><div><span><Sparkles size={15} />今日代读</span><strong>246</strong><small>篇内容</small></div><div><span><Clock3 size={15} />节省时间</span><strong>1.7</strong><small>小时</small></div><button type="button"><CalendarClock size={16} />下一轮 18:00<ChevronRight size={16} /></button></section>
    <div className="news-h5-assistant__heading"><h2>会话</h2><button onClick={() => setAgents((current) => current.map((agent) => ({ ...agent, unreadCount: 0 })))} type="button">全部已读</button></div>
    <main>{filteredAgents.map((agent) => <button className="news-h5-agent-row" onClick={() => setActiveAgentId(agent.id)} key={agent.id} type="button"><span style={{ background: agent.accent }}>{agent.name.slice(0, 1)}</span><div><div><strong>{agent.name}</strong><time>{formatClock(agent.lastDigestAt)}</time></div><p>{agent.lastDigestSummary}</p><small>{agent.description}</small></div>{agent.unreadCount > 0 && <b>{agent.unreadCount}</b>}</button>)}</main>
    <button className="news-h5-new-agent" onClick={() => setCreateOpen(true)} type="button"><Bot size={21} /><div><strong>需要新的阅读能力？</strong><p>创建专属智能体负责一个主题</p></div><ChevronRight size={18} /></button>
    {createOpen && <CreateAgentSheet onClose={() => setCreateOpen(false)} onCreate={createAgent} />}
  </div>;
}

function DigestCard() {
  return <><section className="news-h5-digest"><header><span><Sparkles size={15} />早间增量简报</span><time>08:31</time></header><div><small>高影响</small><h2>公开市场操作节奏出现边际变化</h2><p>连续三日净投放规模上升，短端资金价格回落。变化尚未构成政策转向。</p><ul><li><FileText size={14} />7 个来源</li><li><ShieldCheck size={14} />可信度 91%</li><li><Clock3 size={14} />3 分钟</li></ul></div><footer><button type="button">完整分析</button><button type="button">继续追问</button></footer></section><section className="news-h5-action"><BellRing size={16} /><div><strong>建议动作</strong><p>收盘后复核成交量与资金变化</p></div><ChevronRight size={17} /></section></>;
}

function CreateAgentSheet({ onClose, onCreate }: { onClose: () => void; onCreate: (input: CreateNewsReadingAgentInput) => Promise<void> }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !description.trim() || pending) return;
    setPending(true);
    try { await onCreate({ accent: "#0b7d5e", description: description.trim(), name: name.trim(), readingScope: { categories: [], keywords: [], languages: ["zh-CN"], regions: ["CN"], trustedSources: [] }, schedule: createDefaultNewsReadingSchedule("Asia/Shanghai"), tone: "analytical" }); } finally { setPending(false); }
  };
  return <div className="news-h5-sheet-backdrop"><form className="news-h5-sheet" onSubmit={(event) => void submit(event)}><header><div><strong>创建阅读智能体</strong><p>一个智能体负责一种稳定的阅读能力</p></div><button onClick={onClose} type="button" title="关闭"><X size={19} /></button></header><label>名称<input value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：供应链观察" /></label><label>阅读目标<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="说明主题、来源与需要输出的结论" rows={3} /></label><section><Clock3 size={16} /><div><strong>默认调度</strong><p>每日 08:30 / 18:00，周五总结，每月复盘</p></div></section><footer><button onClick={onClose} type="button">取消</button><button disabled={!name.trim() || !description.trim() || pending} type="submit">{pending ? "创建中" : "创建"}</button></footer></form></div>;
}

function ScheduleSheet({ agent, onClose, onSave }: { agent: NewsReadingAgent; onClose: () => void; onSave: (schedule: NewsReadingSchedule) => Promise<void> }) {
  const [schedule, setSchedule] = useState(agent.schedule);
  const [pending, setPending] = useState(false);
  const firstDaily = schedule.daily[0] ?? { enabled: true, id: "morning", time: "08:30" };
  const [hour, minute] = firstDaily.time.split(":");
  return <div className="news-h5-sheet-backdrop"><div className="news-h5-sheet news-h5-sheet--schedule"><header><div><strong>助手设置</strong><p>{agent.name} · {schedule.timezone}</p></div><button onClick={onClose} type="button" title="关闭"><X size={19} /></button></header><label className="news-h5-switch-row"><span><strong>自动阅读</strong><small>按策略生成简报与总结</small></span><input checked={schedule.enabled} onChange={(event) => setSchedule({ ...schedule, enabled: event.target.checked })} type="checkbox" /></label><label>每日首轮<input type="time" value={firstDaily.time} onChange={(event) => setSchedule({ ...schedule, daily: [{ ...firstDaily, time: event.target.value }, ...schedule.daily.slice(1)] })} /></label><label className="news-h5-switch-row"><span><strong>每周总结</strong><small>周五 {schedule.weekly.time}</small></span><input checked={schedule.weekly.enabled} onChange={(event) => setSchedule({ ...schedule, weekly: { ...schedule.weekly, enabled: event.target.checked } })} type="checkbox" /></label><label className="news-h5-switch-row"><span><strong>每月复盘</strong><small>每月 {schedule.monthly.day} 日 {schedule.monthly.time}</small></span><input checked={schedule.monthly.enabled} onChange={(event) => setSchedule({ ...schedule, monthly: { ...schedule.monthly, enabled: event.target.checked } })} type="checkbox" /></label><code>{Number(minute)} {Number(hour)} * * *</code><footer><button onClick={onClose} type="button">取消</button><button disabled={pending} onClick={() => { setPending(true); void onSave(schedule).finally(() => setPending(false)); }} type="button">{pending ? "保存中" : "保存设置"}</button></footer></div></div>;
}

function createShowcaseAgent(id: string, name: string, accent: string, description: string, summary: string, unreadCount: number, schedule = createDefaultNewsReadingSchedule("Asia/Shanghai")): NewsReadingAgent {
  return { accent, conversationId: `im-${id}`, createdAt: "2026-07-01T00:00:00+08:00", description, id, lastDigestAt: "2026-07-31T08:31:00+08:00", lastDigestSummary: summary, name, readingScope: { categories: [], keywords: [], languages: ["zh-CN"], regions: ["CN"], trustedSources: [] }, schedule, status: "active", tone: "analytical", unreadCount, updatedAt: "2026-07-31T08:31:00+08:00" };
}

function mergeMessages(current: NewsConversationMessage[], incoming: NewsConversationMessage): NewsConversationMessage[] {
  const index = current.findIndex((message) => message.id === incoming.id);
  return index < 0 ? [...current, incoming] : current.map((message, messageIndex) => messageIndex === index ? incoming : message);
}

function formatClock(value: string | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

export default NewsH5Assistant;
