import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  BellRing,
  BookOpenCheck,
  CalendarClock,
  Check,
  CirclePause,
  CirclePlay,
  Clock3,
  ExternalLink,
  FileText,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  createDefaultNewsReadingSchedule,
  validateNewsReadingSchedule,
  type NewsConversationMessage,
  type NewsReadingAgent,
} from "@sdkwork/news-agent-contracts";
import type { NewsAgentService } from "@sdkwork/news-agent-service";

import { NewsScheduleEditor } from "./schedule-editor";
import "./styles.css";

export interface NewsPcAssistantProps {
  demoMode: boolean;
  service?: NewsAgentService;
}

interface NewsAgentProfileInput {
  description: string;
  name: string;
  readingScope: NewsReadingAgent["readingScope"];
  schedule: NewsReadingAgent["schedule"];
  tone: NewsReadingAgent["tone"];
}

type AssistantLoadState = "demo" | "loading" | "live" | "offline";
type ConversationLoadState = "idle" | "loading" | "live" | "offline";
type AgentFilter = "all" | "paused" | "updated";

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

export function NewsPcAssistant({ demoMode, service }: NewsPcAssistantProps) {
  const [agents, setAgents] = useState<NewsReadingAgent[]>(() => demoMode ? showcaseAgents : []);
  const [activeAgentId, setActiveAgentId] = useState(() => demoMode ? showcaseAgents[0]!.id : "");
  const [messages, setMessages] = useState<NewsConversationMessage[]>(() => demoMode ? showcaseMessages : []);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loadState, setLoadState] = useState<AssistantLoadState>(demoMode ? "demo" : "loading");
  const [conversationState, setConversationState] = useState<ConversationLoadState>("idle");
  const [reloadKey, setReloadKey] = useState(0);
  const [conversationReloadKey, setConversationReloadKey] = useState(0);
  const [sendError, setSendError] = useState("");
  const [mutationError, setMutationError] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [agentFilter, setAgentFilter] = useState<AgentFilter>("all");
  const [digestExpanded, setDigestExpanded] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>();
  const [trackingAdded, setTrackingAdded] = useState(false);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const activeAgent = agents.find((agent) => agent.id === activeAgentId) ?? agents[0];
  const filteredAgents = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return agents.filter((agent) => {
      const matchesQuery = !normalized || `${agent.name} ${agent.description}`.toLocaleLowerCase().includes(normalized);
      const matchesFilter = agentFilter === "all"
        || (agentFilter === "updated" && agent.unreadCount > 0)
        || (agentFilter === "paused" && agent.status === "paused");
      return matchesQuery && matchesFilter;
    });
  }, [agentFilter, agents, query]);

  useEffect(() => {
    if (demoMode) {
      setAgents(showcaseAgents);
      setActiveAgentId(showcaseAgents[0]!.id);
      setLoadState("demo");
      return;
    }

    setAgents([]);
    setActiveAgentId("");
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
        setActiveAgentId((current) => page.items.some((item) => item.id === current) ? current : page.items[0]?.id ?? "");
        setLoadState("live");
      }
    }).catch(() => {
      if (!disposed) {
        setAgents([]);
        setActiveAgentId("");
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
          if (!disposed) {
            setMessages((current) => mergeMessages(current, message));
          }
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
    const optimistic: NewsConversationMessage = {
      id: optimisticId,
      occurredAt: new Date().toISOString(),
      role: "user",
      status: "sent",
      text,
    };
    setMessages((current) => [...current, optimistic]);
    setDraft("");
    setIsSending(true);
    setSendError("");
    try {
      if (service) {
        await service.sendText(activeAgent.id, text);
      } else if (demoMode) {
        await new Promise((resolve) => setTimeout(resolve, 450));
        setMessages((current) => [...current, {
          id: `showcase:${Date.now()}`,
          occurredAt: new Date().toISOString(),
          role: "agent",
          status: "streaming",
          text: "我会把这个问题加入本轮增量阅读，并按影响、证据和不确定性三个层次整理。",
        }]);
      }
    } catch {
      setMessages((current) => current.map((message) => (
        message.id === optimisticId ? { ...message, status: "failed" } : message
      )));
      setSendError("消息发送失败，请检查连接后重试");
    } finally {
      setIsSending(false);
    }
  };

  const createAgent = async (input: { name: string; description: string }) => {
    if (!service && !demoMode) return;
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

  const saveAgentProfile = async (input: NewsAgentProfileInput) => {
    if (!activeAgent || (!service && !demoMode)) return;
    const updated = service
      ? await service.update(activeAgent.id, input)
      : { ...activeAgent, ...input, updatedAt: new Date().toISOString() };
    setAgents((current) => current.map((agent) => agent.id === updated.id ? updated : agent));
    setProfileOpen(false);
  };

  const toggleAgentStatus = async () => {
    if (!activeAgent || isUpdatingStatus || (!service && !demoMode)) return;
    const status: NewsReadingAgent["status"] = activeAgent.status === "paused" ? "active" : "paused";
    setIsUpdatingStatus(true);
    setMutationError("");
    try {
      const updated = service
        ? await service.update(activeAgent.id, { status })
        : { ...activeAgent, status, updatedAt: new Date().toISOString() };
      setAgents((current) => current.map((agent) => agent.id === updated.id ? updated : agent));
    } catch {
      setMutationError("助手状态更新失败，请检查连接后重试");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const preparePrompt = (value: string) => {
    setDraft(value);
    window.setTimeout(() => composerRef.current?.focus(), 0);
  };

  return (
    <div className="news-pc-assistant">
      <aside className="news-pc-assistant__list-panel">
        <header className="news-pc-assistant__list-header">
          <div>
            <p>阅读助手</p>
            <span>{agents.length} 个智能体</span>
          </div>
          <button className="news-icon-button news-icon-button--primary" disabled={!demoMode && !service} onClick={() => setCreateOpen(true)} type="button" title="创建智能体">
            <Plus size={18} />
          </button>
        </header>
        <label className="news-pc-assistant__search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索助手" />
        </label>
        <div className="news-pc-assistant__filter-row">
          <button className={agentFilter === "all" ? "is-active" : ""} onClick={() => setAgentFilter("all")} type="button">全部</button>
          <button className={agentFilter === "updated" ? "is-active" : ""} onClick={() => setAgentFilter("updated")} type="button">有更新</button>
          <button className={agentFilter === "paused" ? "is-active" : ""} onClick={() => setAgentFilter("paused")} type="button">已暂停</button>
        </div>
        <div className="news-pc-assistant__agents">
          {filteredAgents.map((agent) => (
            <button
              className={`news-agent-row${agent.id === activeAgent?.id ? " is-active" : ""}`}
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
          {filteredAgents.length === 0 && (
            <AssistantListState
              loadState={loadState}
              queryActive={Boolean(query.trim()) || agentFilter !== "all"}
              onRetry={() => setReloadKey((current) => current + 1)}
            />
          )}
        </div>
        <footer className="news-pc-assistant__run-status">
          <span className={`news-status-dot news-status-dot--${loadState}`} />
          <span>{formatAssistantStatus(loadState)}</span>
          <CalendarClock size={15} />
        </footer>
      </aside>

      {activeAgent ? <section className="news-pc-conversation">
        <header className="news-pc-conversation__header">
          <div className="news-pc-conversation__identity">
            <span className="news-agent-row__avatar" style={{ background: activeAgent.accent }}>{activeAgent.name.slice(0, 1)}</span>
            <div>
              <h1>{activeAgent.name}</h1>
              <p><span className={`news-live-dot${activeAgent.status === "paused" ? " is-paused" : ""}`} /> {activeAgent.status === "paused" ? "已暂停" : "工作中"} · {activeAgent.description}</p>
            </div>
          </div>
          <div className="news-pc-conversation__actions">
            <button className="news-icon-button" disabled={isUpdatingStatus} onClick={() => void toggleAgentStatus()} type="button" title={activeAgent.status === "paused" ? "恢复阅读" : "暂停阅读"}>{activeAgent.status === "paused" ? <CirclePlay size={18} /> : <CirclePause size={18} />}</button>
            <button className="news-icon-button" type="button" title="助手设置" onClick={() => setProfileOpen(true)}><Settings2 size={18} /></button>
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

          {demoMode && <><article className="news-digest-card">
            <header>
              <span><Sparkles size={16} /> 早间增量简报</span>
              <time>08:31</time>
            </header>
            <div className="news-digest-card__headline">
              <span className="news-signal news-signal--high">高影响</span>
              <h2>公开市场操作节奏出现边际变化</h2>
            </div>
            <p>连续三日净投放规模上升，短端资金价格回落。变化尚未构成政策转向，但对高杠杆与利率敏感行业形成短期窗口。</p>
            {digestExpanded && <div className="news-digest-card__analysis"><p>过去三个交易日净投放逐日增加，隔夜与七天资金价格同步回落，但中长期资金成本尚未形成一致趋势。</p><p>当前更适合视为流动性维护信号。银行、地产和高估值成长板块对后续量价变化更敏感，需要结合收盘成交量继续验证。</p></div>}
            <div className="news-digest-card__metrics">
              <span><BookOpenCheck size={15} /> 7 个来源</span>
              <span><ShieldCheck size={15} /> 可信度 91%</span>
              <span><Clock3 size={15} /> 3 分钟阅读</span>
            </div>
            <div className="news-digest-card__sources">
              <button onClick={() => setSelectedSource("央行公开市场业务交易公告 · 2026-07-31 09:20 · 官方发布")} type="button"><FileText size={15} /><span>央行公开市场业务交易公告</span><ExternalLink size={14} /></button>
              <button onClick={() => setSelectedSource("银行间市场资金面日报 · 2026-07-31 08:10 · 市场数据")} type="button"><FileText size={15} /><span>银行间市场资金面日报</span><ExternalLink size={14} /></button>
            </div>
            {selectedSource && <p className="news-digest-card__source-detail" role="status">{selectedSource}</p>}
            <footer>
              <button aria-expanded={digestExpanded} onClick={() => setDigestExpanded((current) => !current)} type="button">{digestExpanded ? "收起完整分析" : "查看完整分析"}</button>
              <button onClick={() => preparePrompt("请继续解释这次公开市场操作变化可能影响哪些行业，并列出证据。") } type="button">继续追问</button>
            </footer>
          </article>

          <article className="news-followup-card">
            <span><BellRing size={16} /> 建议动作</span>
            <p>今天收盘后复核成交量与北向资金变化；若两项同时转强，再提高判断等级。</p>
            <button aria-pressed={trackingAdded} disabled={trackingAdded} onClick={() => setTrackingAdded(true)} type="button"><Check size={15} /> {trackingAdded ? "已加入跟踪" : "加入跟踪"}</button>
          </article>
          </>}
          {conversationState === "loading" && <ConversationState message="正在同步消息" />}
          {conversationState === "offline" && (
            <ConversationState
              action="重试"
              message="消息暂不可用"
              onAction={() => setConversationReloadKey((current) => current + 1)}
              tone="error"
            />
          )}
          {conversationState === "live" && messages.length === 0 && !demoMode && (
            <ConversationState message="暂无消息" />
          )}
          {mutationError && <p className="news-conversation-notice" role="alert">{mutationError}</p>}
        </div>

        <footer className="news-composer">
          <div className="news-composer__input">
            <textarea
              aria-label="发送消息"
              ref={composerRef}
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
              <span>Enter 发送</span>
              <button className="news-send-button" disabled={!draft.trim() || isSending} onClick={() => void send()} type="button" title="发送">
                <Send size={17} />
              </button>
            </div>
            {sendError && <p className="news-composer__error" role="alert">{sendError}</p>}
          </div>
        </footer>
      </section> : (
        <section className="news-pc-conversation news-pc-conversation--empty">
          <ConversationState
            action={loadState === "offline" ? "重试" : undefined}
            message={loadState === "loading" ? "正在同步助手" : loadState === "offline" ? "助手列表暂不可用" : "尚未创建阅读助手"}
            onAction={loadState === "offline" ? () => setReloadKey((current) => current + 1) : undefined}
            tone={loadState === "offline" ? "error" : "default"}
          />
        </section>
      )}

      {profileOpen && activeAgent && <NewsAgentProfilePanel agent={activeAgent} key={activeAgent.id} onClose={() => setProfileOpen(false)} onSave={saveAgentProfile} />}
      {createOpen && <NewsAgentCreatePanel onClose={() => setCreateOpen(false)} onCreate={createAgent} />}
    </div>
  );
}

function AssistantListState({ loadState, onRetry, queryActive }: { loadState: AssistantLoadState; onRetry: () => void; queryActive: boolean }) {
  if (queryActive) return <p className="news-assistant-list-state">未找到匹配的助手</p>;
  if (loadState === "loading") return <p className="news-assistant-list-state" role="status">正在同步助手</p>;
  if (loadState === "offline") {
    return <div className="news-assistant-list-state" role="alert"><span>助手列表暂不可用</span><button onClick={onRetry} type="button"><RefreshCw size={14} />重试</button></div>;
  }
  return <p className="news-assistant-list-state">尚未创建阅读助手</p>;
}

function ConversationState({ action, message, onAction, tone = "default" }: { action?: string; message: string; onAction?: () => void; tone?: "default" | "error" }) {
  return <div className={`news-conversation-state news-conversation-state--${tone}`} role={tone === "error" ? "alert" : "status"}>
    <Sparkles size={20} />
    <p>{message}</p>
    {action && onAction && <button onClick={onAction} type="button"><RefreshCw size={14} />{action}</button>}
  </div>;
}

function formatAssistantStatus(loadState: AssistantLoadState): string {
  if (loadState === "demo") return "演示模式";
  if (loadState === "loading") return "正在同步";
  if (loadState === "offline") return "连接中断";
  return "SDKWork IM 已连接";
}

function NewsAgentProfilePanel({ agent, onClose, onSave }: { agent: NewsReadingAgent; onClose: () => void; onSave: (input: NewsAgentProfileInput) => Promise<void> }) {
  const [name, setName] = useState(agent.name);
  const [description, setDescription] = useState(agent.description);
  const [categories, setCategories] = useState(agent.readingScope.categories.join("、"));
  const [keywords, setKeywords] = useState(agent.readingScope.keywords.join("、"));
  const [trustedSources, setTrustedSources] = useState(agent.readingScope.trustedSources.join("、"));
  const [tone, setTone] = useState(agent.tone);
  const [schedule, setSchedule] = useState(agent.schedule);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const scheduleIsValid = useMemo(() => validateNewsReadingSchedule(schedule).length === 0, [schedule]);
  const profileIsValid = Boolean(name.trim() && description.trim());
  const save = async () => {
    if (!scheduleIsValid || !profileIsValid) return;
    setIsSaving(true);
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
      setSaveError("设置保存失败，请检查连接后重试");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <aside className="news-agent-profile">
      <header>
        <div><span>助手设置</span><p>阅读范围与调度</p></div>
        <button className="news-icon-button" onClick={onClose} type="button" title="关闭"><X size={19} /></button>
      </header>
      <div className="news-agent-profile__content">
        <section className="news-agent-profile__identity">
          <span style={{ background: agent.accent }}>{name.trim().slice(0, 1) || "AI"}</span>
          <div><h2>{name.trim() || "未命名助手"}</h2><p>{description.trim() || "补充稳定、可执行的阅读职责"}</p></div>
        </section>
        <section className="news-agent-profile__fields">
          <label><span>名称</span><input aria-label="助手名称" onChange={(event) => setName(event.target.value)} value={name} /></label>
          <label><span>阅读职责</span><textarea aria-label="阅读职责" onChange={(event) => setDescription(event.target.value)} rows={3} value={description} /></label>
          <label><span>主题分类</span><input aria-label="主题分类" onChange={(event) => setCategories(event.target.value)} placeholder="宏观政策、资本市场" value={categories} /></label>
          <label><span>关键词</span><input aria-label="关键词" onChange={(event) => setKeywords(event.target.value)} placeholder="用逗号分隔" value={keywords} /></label>
          <label><span>可信来源</span><input aria-label="可信来源" onChange={(event) => setTrustedSources(event.target.value)} placeholder="机构或媒体名称，用逗号分隔" value={trustedSources} /></label>
          <label><span>输出风格</span><select aria-label="输出风格" onChange={(event) => setTone(event.target.value as NewsReadingAgent["tone"])} value={tone}><option value="brief">精简</option><option value="analytical">分析</option><option value="executive">决策摘要</option></select></label>
        </section>
        <section>
          <div className="news-setting-heading">
            <div><label className="news-setting-label">自动阅读</label><p>{schedule.enabled ? "按计划持续执行" : "所有调度已暂停"}</p></div>
            <button aria-label="启用自动阅读" aria-pressed={schedule.enabled} className={`news-switch${schedule.enabled ? " is-on" : ""}`} onClick={() => setSchedule((current) => ({ ...current, enabled: !current.enabled }))} type="button"><span /></button>
          </div>
          <NewsScheduleEditor onChange={setSchedule} schedule={schedule} />
        </section>
        {saveError && <p className="news-profile-save-error" role="alert">{saveError}</p>}
      </div>
      <footer><button onClick={onClose} type="button">取消</button><button disabled={isSaving || !scheduleIsValid || !profileIsValid} onClick={() => void save()} type="button">{isSaving ? "保存中" : "保存设置"}</button></footer>
    </aside>
  );
}

function NewsAgentCreatePanel({ onClose, onCreate }: { onClose: () => void; onCreate: (input: { name: string; description: string }) => Promise<void> }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !description.trim() || isCreating) return;
    setIsCreating(true);
    setCreateError("");
    try {
      await onCreate({ name: name.trim(), description: description.trim() });
    } catch {
      setCreateError("智能体创建失败，请检查连接后重试");
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
          {createError && <p className="news-agent-create-panel__error" role="alert">{createError}</p>}
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

function parseProfileList(value: string): string[] {
  return Array.from(new Set(value.split(/[,，、\n]/u).map((item) => item.trim()).filter(Boolean)));
}

export default NewsPcAssistant;
