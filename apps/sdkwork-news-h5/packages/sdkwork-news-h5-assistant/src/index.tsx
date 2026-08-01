import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, BellRing, Bot, CalendarClock, ChevronRight, Clock3, FileText, Plus, RefreshCw, Search, Send, Settings2, ShieldCheck, Sparkles, X } from "lucide-react";
import { createDefaultNewsReadingSchedule, type CreateNewsReadingAgentInput, type NewsConversationMessage, type NewsReadingAgent } from "@sdkwork/news-agent-contracts";
import type { NewsAgentService } from "@sdkwork/news-agent-service";
import { NewsH5ScheduleSheet, type NewsH5AgentProfileInput } from "./schedule-editor";
import "./styles.css";
import "./interaction.css";

export interface NewsH5AssistantProps { demoMode: boolean; service?: NewsAgentService; onSecondaryPageChange?: (isSecondaryPage: boolean) => void; }

type AssistantLoadState = "demo" | "loading" | "live" | "offline";
type ConversationLoadState = "idle" | "loading" | "live" | "offline";

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

export function NewsH5Assistant({ demoMode, service, onSecondaryPageChange }: NewsH5AssistantProps) {
  const [agents, setAgents] = useState<NewsReadingAgent[]>(() => demoMode ? showcaseAgents : []);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<NewsConversationMessage[]>(() => demoMode ? showcaseMessages : []);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loadState, setLoadState] = useState<AssistantLoadState>(demoMode ? "demo" : "loading");
  const [conversationState, setConversationState] = useState<ConversationLoadState>("idle");
  const [reloadKey, setReloadKey] = useState(0);
  const [conversationReloadKey, setConversationReloadKey] = useState(0);
  const [sendError, setSendError] = useState("");
  const [digestExpanded, setDigestExpanded] = useState(false);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const activeAgent = agents.find((agent) => agent.id === activeAgentId) ?? null;
  const canMutate = demoMode || Boolean(service);
  const unreadCount = agents.reduce((total, agent) => total + agent.unreadCount, 0);
  const filteredAgents = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return normalized ? agents.filter((agent) => `${agent.name} ${agent.description}`.toLocaleLowerCase().includes(normalized)) : agents;
  }, [agents, query]);

  useEffect(() => {
    onSecondaryPageChange?.(activeAgentId !== null);
  }, [activeAgentId, onSecondaryPageChange]);

  const openConversation = (agentId: string) => {
    onSecondaryPageChange?.(true);
    setActiveAgentId(agentId);
  };

  const closeConversation = () => {
    onSecondaryPageChange?.(false);
    setActiveAgentId(null);
  };

  useEffect(() => {
    if (demoMode) {
      setAgents(showcaseAgents);
      setLoadState("demo");
      return;
    }
    setAgents([]);
    setActiveAgentId(null);
    setMessages([]);
    if (!service) {
      setLoadState("offline");
      return;
    }
    let disposed = false;
    setLoadState("loading");
    void service.list({ page: 1, pageSize: 20 }).then((page) => {
      if (!disposed) {
        setAgents(page.items);
        setActiveAgentId((current) => page.items.some((item) => item.id === current) ? current : null);
        setLoadState("live");
      }
    }).catch(() => {
      if (!disposed) {
        setAgents([]);
        setActiveAgentId(null);
        setMessages([]);
        setLoadState("offline");
      }
    });
    return () => { disposed = true; };
  }, [demoMode, reloadKey, service]);

  useEffect(() => {
    setSendError("");
    if (!activeAgentId) {
      setMessages([]);
      setConversationState("idle");
      return;
    }
    if (demoMode) {
      setMessages(showcaseMessages);
      setConversationState("live");
      return;
    }
    setMessages([]);
    if (!service) {
      setConversationState("offline");
      return;
    }
    let disposed = false;
    let close: (() => void) | undefined;
    setConversationState("loading");
    void (async () => {
      try {
        const page = await service.listMessages(activeAgentId, { pageSize: 50 });
        if (disposed) return;
        setMessages(page.items);
        const subscription = await service.subscribe(activeAgentId, (message) => {
          if (!disposed) setMessages((current) => mergeMessages(current, message));
        });
        close = () => subscription.close();
        if (disposed) {
          close();
          return;
        }
        setConversationState("live");
      } catch {
        if (!disposed) {
          setMessages([]);
          setConversationState("offline");
        }
      }
    })();
    return () => { disposed = true; close?.(); };
  }, [activeAgentId, conversationReloadKey, demoMode, service]);

  const send = async () => {
    const text = draft.trim();
    if (!activeAgent || !text || isSending || (!service && !demoMode)) return;
    const optimisticId = `local:${Date.now()}`;
    const optimistic: NewsConversationMessage = { id: optimisticId, occurredAt: new Date().toISOString(), role: "user", status: "sent", text };
    setMessages((current) => [...current, optimistic]);
    setDraft("");
    setIsSending(true);
    setSendError("");
    try {
      if (service) {
        await service.sendText(activeAgent.id, text);
      } else if (demoMode) {
        const id = `showcase:${Date.now()}`;
        setMessages((current) => mergeMessages(current, { id, occurredAt: new Date().toISOString(), role: "agent", status: "streaming", text: "正在核对来源与时间线..." }));
        window.setTimeout(() => setMessages((current) => mergeMessages(current, { id, occurredAt: new Date().toISOString(), role: "agent", status: "sent", text: "已核对来源与时间线，稍后给出可执行结论。" })), 500);
      }
    } catch {
      setMessages((current) => current.map((message) => message.id === optimisticId ? { ...message, status: "failed" } : message));
      setSendError("消息发送失败，请检查连接后重试");
    } finally { setIsSending(false); }
  };

  const createAgent = async (input: CreateNewsReadingAgentInput) => {
    if (!service && !demoMode) return;
    const created = service ? await service.create(input) : createShowcaseAgent(`local-${Date.now()}`, input.name, input.accent, input.description, "等待首次阅读任务", 0, input.schedule);
    setAgents((current) => [created, ...current.filter((item) => item.id !== created.id)]);
    setCreateOpen(false);
  };

  const saveAgentProfile = async (input: NewsH5AgentProfileInput) => {
    if (!activeAgent || (!service && !demoMode)) return;
    const updated = service ? await service.update(activeAgent.id, input) : { ...activeAgent, ...input, updatedAt: new Date().toISOString() };
    setAgents((current) => current.map((agent) => agent.id === updated.id ? updated : agent));
    setProfileOpen(false);
  };

  const preparePrompt = (value: string) => {
    setDraft(value);
    window.setTimeout(() => composerRef.current?.focus(), 0);
  };

  if (activeAgent) {
    return <div className="news-h5-chat">
      <header><button onClick={closeConversation} type="button" title="返回"><ArrowLeft size={21} /></button><span style={{ background: activeAgent.accent }}>{activeAgent.name.slice(0, 1)}</span><div><h1>{activeAgent.name}</h1><p><i />{activeAgent.status === "active" ? "工作中" : "已暂停"}</p></div><button onClick={() => setProfileOpen(true)} type="button" title="助手设置"><Settings2 size={20} /></button></header>
      <main>
        {messages.length > 0 && <div className="news-h5-chat__day">今天</div>}
        {messages.map((message) => <article className={`news-h5-chat__message news-h5-chat__message--${message.role}`} key={message.id}>{message.role === "agent" && <span style={{ background: activeAgent.accent }}>{activeAgent.name.slice(0, 1)}</span>}<p>{message.text}{message.status === "streaming" && <i className="news-h5-stream-caret" />}</p></article>)}
        {demoMode && <DigestCard
          expanded={digestExpanded}
          onAction={() => preparePrompt("请把收盘后需要复核的成交量和资金变化整理成检查清单。")}
          onFollowup={() => preparePrompt("请继续解释这次公开市场操作变化可能影响哪些行业，并列出证据。")}
          onToggleAnalysis={() => setDigestExpanded((current) => !current)}
        />}
        {conversationState === "loading" && <H5ConversationState message="正在同步消息" />}
        {conversationState === "offline" && <H5ConversationState message="消息暂不可用" onRetry={() => setConversationReloadKey((current) => current + 1)} tone="error" />}
        {conversationState === "live" && messages.length === 0 && !demoMode && <H5ConversationState message="暂无消息" />}
        {sendError && <p className="news-h5-chat__send-error" role="alert">{sendError}</p>}
      </main>
      <footer><label><textarea ref={composerRef} rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="问问助手" /></label><button disabled={!draft.trim() || isSending || conversationState === "offline"} onClick={() => void send()} type="button" title="发送"><Send size={18} /></button></footer>
      {profileOpen && <NewsH5ScheduleSheet agent={activeAgent} key={activeAgent.id} onClose={() => setProfileOpen(false)} onSave={saveAgentProfile} />}
    </div>;
  }

  return <div className="news-h5-assistant">
    <header><div><h1>阅读助手</h1><p>{formatAssistantSummary(loadState, unreadCount)}</p></div><button disabled={!canMutate} onClick={() => setCreateOpen(true)} type="button" title="创建智能体"><Plus size={20} /></button></header>
    <label className="news-h5-assistant__search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索助手" /></label>
    {demoMode && <section className="news-h5-summary"><div><span><Sparkles size={15} />今日代读</span><strong>246</strong><small>篇内容</small></div><div><span><Clock3 size={15} />节省时间</span><strong>1.7</strong><small>小时</small></div><button onClick={() => { const nextAgent = agents[0]; if (nextAgent) { openConversation(nextAgent.id); setProfileOpen(true); } }} type="button"><CalendarClock size={16} />下一轮 18:00<ChevronRight size={16} /></button></section>}
    <div className="news-h5-assistant__heading"><h2>会话</h2>{demoMode && <button onClick={() => setAgents((current) => current.map((agent) => ({ ...agent, unreadCount: 0 })))} type="button">全部已读</button>}</div>
    <main>
      {filteredAgents.map((agent) => <button className="news-h5-agent-row" onClick={() => openConversation(agent.id)} key={agent.id} type="button"><span style={{ background: agent.accent }}>{agent.name.slice(0, 1)}</span><div><div><strong>{agent.name}</strong><time>{formatClock(agent.lastDigestAt)}</time></div><p>{agent.lastDigestSummary}</p><small>{agent.description}</small></div>{agent.unreadCount > 0 && <b>{agent.unreadCount}</b>}</button>)}
      {filteredAgents.length === 0 && <H5AssistantListState loadState={loadState} queryActive={Boolean(query.trim())} onRetry={() => setReloadKey((current) => current + 1)} />}
    </main>
    <button className="news-h5-new-agent" disabled={!canMutate} onClick={() => setCreateOpen(true)} type="button"><Bot size={21} /><div><strong>创建阅读智能体</strong><p>配置一个独立的阅读主题</p></div><ChevronRight size={18} /></button>
    {createOpen && <CreateAgentSheet onClose={() => setCreateOpen(false)} onCreate={createAgent} />}
  </div>;
}

function H5AssistantListState({ loadState, onRetry, queryActive }: { loadState: AssistantLoadState; onRetry: () => void; queryActive: boolean }) {
  if (queryActive) return <p className="news-h5-assistant__state">未找到匹配的助手</p>;
  if (loadState === "loading") return <p className="news-h5-assistant__state" role="status">正在同步助手</p>;
  if (loadState === "offline") return <div className="news-h5-assistant__state" role="alert"><span>助手列表暂不可用</span><button onClick={onRetry} type="button"><RefreshCw size={14} />重试</button></div>;
  return <p className="news-h5-assistant__state">尚未创建阅读助手</p>;
}

function H5ConversationState({ message, onRetry, tone = "default" }: { message: string; onRetry?: () => void; tone?: "default" | "error" }) {
  return <div className={`news-h5-chat__state news-h5-chat__state--${tone}`} role={tone === "error" ? "alert" : "status"}><Sparkles size={20} /><p>{message}</p>{onRetry && <button onClick={onRetry} type="button"><RefreshCw size={14} />重试</button>}</div>;
}

function formatAssistantSummary(loadState: AssistantLoadState, unreadCount: number): string {
  if (loadState === "demo") return "今天有 4 条重要更新";
  if (loadState === "loading") return "正在同步会话";
  if (loadState === "offline") return "连接暂不可用";
  return unreadCount > 0 ? `${unreadCount} 条未读更新` : "会话已同步";
}

function DigestCard({
  expanded,
  onAction,
  onFollowup,
  onToggleAnalysis,
}: {
  expanded: boolean;
  onAction(): void;
  onFollowup(): void;
  onToggleAnalysis(): void;
}) {
  return <><section className="news-h5-digest"><header><span><Sparkles size={15} />早间增量简报</span><time>08:31</time></header><div><small>高影响</small><h2>公开市场操作节奏出现边际变化</h2><p>连续三日净投放规模上升，短端资金价格回落。变化尚未构成政策转向。</p>{expanded && <div className="news-h5-digest__analysis"><p>过去三个交易日净投放逐日增加，隔夜与七天资金价格同步回落，但中长期资金成本尚未形成一致趋势。</p><p>当前更适合视为流动性维护信号。银行、地产和高估值成长板块对后续量价变化更敏感，需要结合收盘成交量继续验证。</p></div>}<ul><li><FileText size={14} />7 个来源</li><li><ShieldCheck size={14} />可信度 91%</li><li><Clock3 size={14} />3 分钟</li></ul></div><footer><button aria-expanded={expanded} onClick={onToggleAnalysis} type="button">{expanded ? "收起分析" : "完整分析"}</button><button onClick={onFollowup} type="button">继续追问</button></footer></section><button className="news-h5-action" onClick={onAction} type="button"><BellRing size={16} /><span><strong>建议动作</strong><small>收盘后复核成交量与资金变化</small></span><ChevronRight size={17} /></button></>;
}

function CreateAgentSheet({ onClose, onCreate }: { onClose: () => void; onCreate: (input: CreateNewsReadingAgentInput) => Promise<void> }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);
  const [createError, setCreateError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !description.trim() || pending) return;
    setPending(true);
    setCreateError("");
    try {
      await onCreate({ accent: "#0b7d5e", description: description.trim(), name: name.trim(), readingScope: { categories: [], keywords: [], languages: ["zh-CN"], regions: ["CN"], trustedSources: [] }, schedule: createDefaultNewsReadingSchedule("Asia/Shanghai"), tone: "analytical" });
    } catch {
      setCreateError("智能体创建失败，请检查连接后重试");
    } finally { setPending(false); }
  };
  return <div className="news-h5-sheet-backdrop"><form className="news-h5-sheet" onSubmit={(event) => void submit(event)}><header><div><strong>创建阅读智能体</strong><p>一个智能体负责一种稳定的阅读能力</p></div><button onClick={onClose} type="button" title="关闭"><X size={19} /></button></header><label>名称<input value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：供应链观察" /></label><label>阅读目标<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="说明主题、来源与需要输出的结论" rows={3} /></label><section><Clock3 size={16} /><div><strong>默认调度</strong><p>每日 08:30 / 18:00，周五总结，每月复盘</p></div></section>{createError && <p className="news-h5-create-error" role="alert">{createError}</p>}<footer><button onClick={onClose} type="button">取消</button><button disabled={!name.trim() || !description.trim() || pending} type="submit">{pending ? "创建中" : "创建"}</button></footer></form></div>;
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
