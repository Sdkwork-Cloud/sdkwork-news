import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  BellRing,
  BookOpenCheck,
  CalendarClock,
  Check,
  ChevronDown,
  CirclePause,
  Clock3,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  createDefaultNewsReadingSchedule,
  type NewsConversationMessage,
  type NewsReadingAgent,
} from "@sdkwork/news-agent-contracts";
import type { NewsAgentService } from "@sdkwork/news-agent-service";

import "./styles.css";

export interface NewsPcAssistantProps {
  service?: NewsAgentService;
}

const showcaseAgents: NewsReadingAgent[] = [
  createShowcaseAgent({
    accent: "#087a5b",
    conversationId: "im-market-radar",
    description: "跟踪宏观政策、资本市场与产业资金流向",
    id: "market-radar",
    lastDigestAt: "2026-07-31T08:31:00+08:00",
    lastDigestSummary: "央行公开市场操作出现边际变化，3 个行业受影响",
    name: "市场雷达",
    unreadCount: 3,
  }),
  createShowcaseAgent({
    accent: "#2467a5",
    conversationId: "im-ai-frontier",
    description: "筛选模型、Agent、开发工具与开源项目进展",
    id: "ai-frontier",
    lastDigestAt: "2026-07-31T07:46:00+08:00",
    lastDigestSummary: "两项模型能力更新值得进入本周技术评审",
    name: "AI 前沿",
    unreadCount: 1,
  }),
  createShowcaseAgent({
    accent: "#8b5a25",
    conversationId: "im-competitor-watch",
    description: "监测竞品发布、定价变化与关键客户动向",
    id: "competitor-watch",
    lastDigestAt: "2026-07-30T18:03:00+08:00",
    lastDigestSummary: "竞品 A 调整企业版定价，暂未改变核心功能边界",
    name: "竞品观察",
    unreadCount: 0,
  }),
  createShowcaseAgent({
    accent: "#8a3d50",
    conversationId: "im-policy-brief",
    description: "阅读监管文件并提取生效时间、义务与风险",
    id: "policy-brief",
    lastDigestAt: "2026-07-29T17:32:00+08:00",
    lastDigestSummary: "本周政策周报已完成，共识别 4 项行动要求",
    name: "政策简报",
    unreadCount: 0,
  }),
];

const showcaseMessages: NewsConversationMessage[] = [
  {
    id: "message-1",
    occurredAt: "2026-07-31T08:30:00+08:00",
    role: "user",
    status: "sent",
    text: "按早间策略执行，重点看政策变化和市场传导，不要重复昨天的信息。",
  },
  {
    id: "message-2",
    occurredAt: "2026-07-31T08:31:00+08:00",
    role: "agent",
    status: "sent",
    text: "已完成 126 个来源的增量阅读，去重后保留 9 条，下面 3 条需要你今天关注。",
  },
];

export function NewsPcAssistant({ service }: NewsPcAssistantProps) {
  const [agents, setAgents] = useState(showcaseAgents);
  const [activeAgentId, setActiveAgentId] = useState(showcaseAgents[0]!.id);
  const [messages, setMessages] = useState(showcaseMessages);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "live" | "offline">("idle");

  const activeAgent = agents.find((agent) => agent.id === activeAgentId) ?? agents[0]!;
  const filteredAgents = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return normalized
      ? agents.filter((agent) => `${agent.name} ${agent.description}`.toLocaleLowerCase().includes(normalized))
      : agents;
  }, [agents, query]);

  useEffect(() => {
    if (!service) {
      return;
    }
    let disposed = false;
    setLoadState("loading");
    void service.list({ page: 1, pageSize: 20 }).then((page) => {
      if (!disposed) {
        setAgents(page.items);
        setActiveAgentId((current) => page.items.some((item) => item.id === current) ? current : page.items[0]?.id ?? "");
        setLoadState("live");
      }
    }).catch(() => {
      if (!disposed) setLoadState("offline");
    });
    return () => { disposed = true; };
  }, [service]);

  useEffect(() => {
    if (!service || !activeAgentId) {
      return;
    }
    let disposed = false;
    let close: (() => void) | undefined;
    void service.listMessages(activeAgentId, { pageSize: 50 }).then((page) => {
      if (!disposed) setMessages(page.items);
    });
    void service.subscribe(activeAgentId, (message) => {
      if (!disposed) {
        setMessages((current) => mergeMessages(current, message));
      }
    }).then((subscription) => {
      close = () => subscription.close();
      if (disposed) close();
    });
    return () => { disposed = true; close?.(); };
  }, [activeAgentId, service]);

  const send = async () => {
    const text = draft.trim();
    if (!text || isSending) return;
    const optimistic: NewsConversationMessage = {
      id: `local:${Date.now()}`,
      occurredAt: new Date().toISOString(),
      role: "user",
      status: "sent",
      text,
    };
    setMessages((current) => [...current, optimistic]);
    setDraft("");
    setIsSending(true);
    try {
      if (service) {
        await service.sendText(activeAgent.id, text);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 450));
        setMessages((current) => [...current, {
          id: `showcase:${Date.now()}`,
          occurredAt: new Date().toISOString(),
          role: "agent",
          status: "streaming",
          text: "我会把这个问题加入本轮增量阅读，并按影响、证据和不确定性三个层次整理。",
        }]);
      }
    } finally {
      setIsSending(false);
    }
  };

  const createAgent = async (input: { name: string; description: string }) => {
    const schedule = createDefaultNewsReadingSchedule("Asia/Shanghai");
    const created = service
      ? await service.create({
          accent: "#087a5b",
          description: input.description,
          name: input.name,
          readingScope: {
            categories: [],
            keywords: [],
            languages: ["zh-CN"],
            regions: ["CN"],
            trustedSources: [],
          },
          schedule,
          tone: "analytical",
        })
      : createShowcaseAgent({
          accent: "#087a5b",
          conversationId: `im-local-${Date.now()}`,
          description: input.description,
          id: `local-${Date.now()}`,
          lastDigestAt: new Date().toISOString(),
          lastDigestSummary: "等待首次阅读任务",
          name: input.name,
          unreadCount: 0,
        });
    setAgents((current) => [created, ...current.filter((agent) => agent.id !== created.id)]);
    setActiveAgentId(created.id);
    setCreateOpen(false);
  };

  const saveAgentSchedule = async (schedule: NewsReadingAgent["schedule"]) => {
    const updated = service
      ? await service.update(activeAgent.id, { schedule })
      : { ...activeAgent, schedule, updatedAt: new Date().toISOString() };
    setAgents((current) => current.map((agent) => agent.id === updated.id ? updated : agent));
    setProfileOpen(false);
  };

  return (
    <div className="news-pc-assistant">
      <aside className="news-pc-assistant__list-panel">
        <header className="news-pc-assistant__list-header">
          <div>
            <p>阅读助手</p>
            <span>{agents.length} 个智能体</span>
          </div>
          <button className="news-icon-button news-icon-button--primary" onClick={() => setCreateOpen(true)} type="button" title="创建智能体">
            <Plus size={18} />
          </button>
        </header>
        <label className="news-pc-assistant__search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索助手" />
        </label>
        <div className="news-pc-assistant__filter-row">
          <button type="button" className="is-active">全部</button>
          <button type="button">有更新</button>
          <button type="button">已暂停</button>
        </div>
        <div className="news-pc-assistant__agents">
          {filteredAgents.map((agent) => (
            <button
              className={`news-agent-row${agent.id === activeAgent.id ? " is-active" : ""}`}
              key={agent.id}
              onClick={() => setActiveAgentId(agent.id)}
              type="button"
            >
              <span className="news-agent-row__avatar" style={{ background: agent.accent }}>{agent.name.slice(0, 1)}</span>
              <span className="news-agent-row__body">
                <span className="news-agent-row__line">
                  <strong>{agent.name}</strong>
                  <time>{formatClock(agent.lastDigestAt)}</time>
                </span>
                <span className="news-agent-row__line news-agent-row__line--summary">
                  <span>{agent.lastDigestSummary}</span>
                  {agent.unreadCount > 0 && <b>{agent.unreadCount}</b>}
                </span>
              </span>
            </button>
          ))}
        </div>
        <footer className="news-pc-assistant__run-status">
          <span className={`news-status-dot news-status-dot--${loadState}`} />
          <span>{loadState === "offline" ? "等待连接" : "下一轮阅读 18:00"}</span>
          <CalendarClock size={15} />
        </footer>
      </aside>

      <section className="news-pc-conversation">
        <header className="news-pc-conversation__header">
          <div className="news-pc-conversation__identity">
            <span className="news-agent-row__avatar" style={{ background: activeAgent.accent }}>{activeAgent.name.slice(0, 1)}</span>
            <div>
              <h1>{activeAgent.name}</h1>
              <p><span className="news-live-dot" /> 工作中 · {activeAgent.description}</p>
            </div>
          </div>
          <div className="news-pc-conversation__actions">
            <button className="news-icon-button" type="button" title="暂停阅读"><CirclePause size={18} /></button>
            <button className="news-icon-button" type="button" title="助手设置" onClick={() => setProfileOpen(true)}><Settings2 size={18} /></button>
            <button className="news-icon-button" type="button" title="更多"><MoreHorizontal size={18} /></button>
          </div>
        </header>

        <div className="news-pc-conversation__timeline">
          <div className="news-conversation-day">今天</div>
          {messages.map((message) => (
            <article className={`news-message news-message--${message.role}`} key={message.id}>
              {message.role === "agent" && (
                <span className="news-message__avatar" style={{ background: activeAgent.accent }}>{activeAgent.name.slice(0, 1)}</span>
              )}
              <div className="news-message__stack">
                <div className="news-message__bubble">
                  <p>{message.text}</p>
                  {message.status === "streaming" && <span className="news-stream-caret" />}
                </div>
                <time>{formatClock(message.occurredAt)}</time>
              </div>
            </article>
          ))}

          <article className="news-digest-card">
            <header>
              <span><Sparkles size={16} /> 早间增量简报</span>
              <time>08:31</time>
            </header>
            <div className="news-digest-card__headline">
              <span className="news-signal news-signal--high">高影响</span>
              <h2>公开市场操作节奏出现边际变化</h2>
            </div>
            <p>连续三日净投放规模上升，短端资金价格回落。变化尚未构成政策转向，但对高杠杆与利率敏感行业形成短期窗口。</p>
            <div className="news-digest-card__metrics">
              <span><BookOpenCheck size={15} /> 7 个来源</span>
              <span><ShieldCheck size={15} /> 可信度 91%</span>
              <span><Clock3 size={15} /> 3 分钟阅读</span>
            </div>
            <div className="news-digest-card__sources">
              <button type="button"><FileText size={15} /><span>央行公开市场业务交易公告</span><ExternalLink size={14} /></button>
              <button type="button"><FileText size={15} /><span>银行间市场资金面日报</span><ExternalLink size={14} /></button>
            </div>
            <footer>
              <button type="button">查看完整分析</button>
              <button type="button">继续追问</button>
            </footer>
          </article>

          <article className="news-followup-card">
            <span><BellRing size={16} /> 建议动作</span>
            <p>今天收盘后复核成交量与北向资金变化；若两项同时转强，再提高判断等级。</p>
            <button type="button"><Check size={15} /> 加入跟踪</button>
          </article>
        </div>

        <footer className="news-composer">
          <div className="news-composer__input">
            <textarea
              aria-label="发送消息"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send();
                }
              }}
              placeholder={`问问${activeAgent.name}，或安排新的阅读任务`}
              rows={2}
              value={draft}
            />
            <div>
              <button className="news-icon-button" type="button" title="添加附件"><Paperclip size={18} /></button>
              <span>Enter 发送</span>
              <button className="news-send-button" disabled={!draft.trim() || isSending} onClick={() => void send()} type="button" title="发送">
                <Send size={17} />
              </button>
            </div>
          </div>
        </footer>
      </section>

      {profileOpen && <NewsAgentProfilePanel agent={activeAgent} onClose={() => setProfileOpen(false)} onSave={saveAgentSchedule} />}
      {createOpen && <NewsAgentCreatePanel onClose={() => setCreateOpen(false)} onCreate={createAgent} />}
    </div>
  );
}

function NewsAgentProfilePanel({ agent, onClose, onSave }: { agent: NewsReadingAgent; onClose: () => void; onSave: (schedule: NewsReadingAgent["schedule"]) => Promise<void> }) {
  const [scheduleEnabled, setScheduleEnabled] = useState(agent.schedule.enabled);
  const [isSaving, setIsSaving] = useState(false);
  return (
    <aside className="news-agent-profile">
      <header>
        <div><span>助手设置</span><p>阅读范围与调度</p></div>
        <button className="news-icon-button" onClick={onClose} type="button" title="关闭"><X size={19} /></button>
      </header>
      <div className="news-agent-profile__content">
        <section className="news-agent-profile__identity">
          <span style={{ background: agent.accent }}>{agent.name.slice(0, 1)}</span>
          <div><h2>{agent.name}</h2><p>{agent.description}</p></div>
        </section>
        <section>
          <label className="news-setting-label">阅读重点</label>
          <div className="news-tag-field"><span>宏观政策</span><span>资本市场</span><span>产业资金</span><button type="button"><Plus size={14} /></button></div>
        </section>
        <section>
          <label className="news-setting-label">可信来源</label>
          <button className="news-select-row" type="button"><span>权威媒体与官方源优先</span><ChevronDown size={16} /></button>
        </section>
        <section>
          <div className="news-setting-heading">
            <div><label className="news-setting-label">自动阅读</label><p>Asia/Shanghai</p></div>
            <button className={`news-switch${scheduleEnabled ? " is-on" : ""}`} onClick={() => setScheduleEnabled((value) => !value)} type="button"><span /></button>
          </div>
          <div className="news-schedule-list">
            <div><span className="news-schedule-icon"><Clock3 size={16} /></span><div><strong>每日简报</strong><p>08:30、18:00</p></div><button type="button">编辑</button></div>
            <div><span className="news-schedule-icon"><CalendarClock size={16} /></span><div><strong>每周总结</strong><p>周五 17:30</p></div><button type="button">编辑</button></div>
            <div><span className="news-schedule-icon"><FileText size={16} /></span><div><strong>月度复盘</strong><p>每月 1 日 09:30</p></div><button type="button">编辑</button></div>
          </div>
        </section>
        <section className="news-cron-preview">
          <label className="news-setting-label">调度规则</label>
          <code>30 8 * * *</code><code>0 18 * * *</code><code>30 17 * * 5</code>
        </section>
      </div>
      <footer><button onClick={onClose} type="button">取消</button><button disabled={isSaving} onClick={() => { setIsSaving(true); void onSave({ ...agent.schedule, enabled: scheduleEnabled }).finally(() => setIsSaving(false)); }} type="button">{isSaving ? "保存中" : "保存设置"}</button></footer>
    </aside>
  );
}

function NewsAgentCreatePanel({ onClose, onCreate }: { onClose: () => void; onCreate: (input: { name: string; description: string }) => Promise<void> }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !description.trim() || isCreating) return;
    setIsCreating(true);
    try {
      await onCreate({ name: name.trim(), description: description.trim() });
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <aside className="news-agent-profile news-agent-create-panel">
      <form onSubmit={(event) => void submit(event)}>
        <header><div><span>创建阅读智能体</span><p>一个智能体负责一种稳定的阅读能力</p></div><button className="news-icon-button" onClick={onClose} type="button" title="关闭"><X size={19} /></button></header>
        <div className="news-agent-create-panel__content">
          <label><span>名称</span><input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：供应链观察" /></label>
          <label><span>阅读目标</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="说明主题、来源与需要输出的结论" rows={5} /></label>
          <section className="news-cron-preview"><label className="news-setting-label">默认调度</label><code>30 8 * * *</code><code>0 18 * * *</code><code>30 17 * * 5</code></section>
        </div>
        <footer><button onClick={onClose} type="button">取消</button><button disabled={!name.trim() || !description.trim() || isCreating} type="submit">{isCreating ? "创建中" : "创建"}</button></footer>
      </form>
    </aside>
  );
}

function createShowcaseAgent(
  input: Pick<NewsReadingAgent, "accent" | "conversationId" | "description" | "id" | "lastDigestAt" | "lastDigestSummary" | "name" | "unreadCount">,
): NewsReadingAgent {
  return {
    ...input,
    createdAt: "2026-07-01T00:00:00+08:00",
    readingScope: { categories: [], keywords: [], languages: ["zh-CN"], regions: ["CN"], trustedSources: [] },
    schedule: createDefaultNewsReadingSchedule("Asia/Shanghai"),
    status: "active",
    tone: "analytical",
    updatedAt: input.lastDigestAt ?? "2026-07-01T00:00:00+08:00",
  };
}

function formatClock(value: string | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));
}

function mergeMessages(current: NewsConversationMessage[], incoming: NewsConversationMessage): NewsConversationMessage[] {
  const index = current.findIndex((message) => message.id === incoming.id);
  if (index < 0) return [...current, incoming];
  return current.map((message, messageIndex) => messageIndex === index ? incoming : message);
}

export default NewsPcAssistant;
