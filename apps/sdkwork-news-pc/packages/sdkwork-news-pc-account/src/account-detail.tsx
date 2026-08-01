import { type FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Bookmark,
  Check,
  Clock3,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  History,
  KeyRound,
  Languages,
  LoaderCircle,
  MonitorSmartphone,
  Moon,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserRound,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type {
  NewsAccountContentItem,
  NewsAccountController,
  NewsAccountLocalStateController,
} from "@sdkwork/news-account-react";
import type {
  NewsAccountProfile,
  NewsAccountService,
  NewsAccountSession,
} from "@sdkwork/news-account-service";

export type NewsPcAccountPage =
  | "about"
  | "appearance"
  | "devices"
  | "help"
  | "history"
  | "language"
  | "notifications"
  | "offline"
  | "privacy"
  | "profile"
  | "saved"
  | "security"
  | "subscription"
  | "usage";

const PAGE_TITLES: Record<NewsPcAccountPage, string> = {
  about: "关于 SDKWork News",
  appearance: "显示与外观",
  devices: "登录设备",
  help: "帮助与支持",
  history: "阅读历史",
  language: "语言与地区",
  notifications: "通知与提醒",
  offline: "离线内容",
  privacy: "隐私控制",
  profile: "个人资料",
  saved: "我的收藏",
  security: "账号安全",
  subscription: "订阅与方案",
  usage: "智能体用量",
};

interface DetailProps {
  controller: NewsAccountController;
  demoMode: boolean;
  local: NewsAccountLocalStateController;
  onBack(): void;
  page: NewsPcAccountPage;
  profile: NewsAccountProfile;
  service?: NewsAccountService;
}

export function NewsPcAccountDetail(props: DetailProps) {
  const { controller, demoMode, local, onBack, page, profile, service } = props;
  return <div className={`news-pc-account-detail is-${local.state.appearance}`}>
    <header><button aria-label="返回我的" onClick={onBack} type="button"><ArrowLeft size={18} />返回</button><h1>{PAGE_TITLES[page]}</h1><span /></header>
    <main>
      {page === "profile" && <ProfileDetail controller={controller} demoMode={demoMode} local={local} profile={profile} />}
      {page === "subscription" && <SubscriptionDetail demoMode={demoMode} />}
      {page === "saved" && (demoMode ? <ContentList emptyText="还没有收藏内容" icon={Bookmark} items={local.state.savedItems} onRemove={local.removeSavedItem} removeLabel="取消收藏" /> : <DetailState icon={Bookmark} text="收藏同步服务尚未连接" />)}
      {page === "history" && (demoMode ? <HistoryDetail local={local} /> : <DetailState icon={History} text="阅读历史服务尚未连接" />)}
      {page === "offline" && <OfflineDetail local={local} />}
      {page === "usage" && <UsageDetail demoMode={demoMode} />}
      {page === "notifications" && <NotificationsDetail local={local} />}
      {page === "language" && <LanguageDetail local={local} />}
      {page === "appearance" && <AppearanceDetail local={local} />}
      {page === "privacy" && <PrivacyDetail local={local} />}
      {page === "security" && <SecurityDetail controller={controller} demoMode={demoMode} />}
      {page === "devices" && <DevicesDetail demoMode={demoMode} local={local} service={service} />}
      {page === "help" && <HelpDetail />}
      {page === "about" && <AboutDetail />}
    </main>
  </div>;
}

function ProfileDetail({ controller, demoMode, local, profile }: Pick<DetailProps, "controller" | "demoMode" | "local" | "profile">) {
  const [displayName, setDisplayName] = useState(demoMode ? local.state.demoDisplayName : profile.displayName);
  const [demoMessage, setDemoMessage] = useState<string>();
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = displayName.trim();
    if (!normalized) return;
    if (demoMode) {
      local.update((current) => ({ ...current, demoDisplayName: normalized }));
      setDemoMessage("资料已更新");
      return;
    }
    await controller.updateProfile(normalized);
  };
  return <section className="news-pc-account-panel">
    <div className="news-pc-account-detail__heading"><UserRound size={20} /><div><h2>身份资料</h2><p>用于跨端账号展示</p></div></div>
    <form className="news-pc-account-form" onSubmit={submit}>
      <label><span>显示名称</span><input aria-label="显示名称" maxLength={40} onChange={(event) => setDisplayName(event.target.value)} required value={displayName} /></label>
      <label><span>邮箱</span><input disabled value={profile.email ?? "未绑定"} /></label>
      <label><span>用户名</span><input disabled value={profile.username ?? "未设置"} /></label>
      <button disabled={controller.profilePending} type="submit">{controller.profilePending ? <LoaderCircle className="is-spinning" size={15} /> : <Check size={15} />}保存资料</button>
    </form>
    <MutationMessage error={controller.mutationError} message={demoMessage ?? controller.mutationMessage} />
  </section>;
}

function SubscriptionDetail({ demoMode }: { demoMode: boolean }) {
  if (!demoMode) return <DetailState icon={CreditCard} text="订阅服务尚未连接" />;
  return <><section className="news-pc-plan-card"><span>PRO</span><h2>专业版</h2><p>智能体阅读、长期会话与跨端同步已启用</p><dl><div><dt>当前周期</dt><dd>2026.07.15 - 2026.08.14</dd></div><div><dt>续费方式</dt><dd>自动续费</dd></div></dl></section><section className="news-pc-account-panel"><h2>本期权益</h2><MetricRow label="智能体运行" value="42 / 200 次" /><MetricRow label="深度阅读" value="18.7 / 60 小时" /><MetricRow label="离线空间" value="486 MB / 5 GB" /></section></>;
}

function HistoryDetail({ local }: { local: NewsAccountLocalStateController }) {
  return <><ContentList emptyText="暂无阅读历史" icon={History} items={local.state.history} />{local.state.history.length > 0 && <button className="news-pc-account-danger" onClick={local.clearHistory} type="button"><Trash2 size={15} />清空阅读历史</button>}</>;
}

function OfflineDetail({ local }: { local: NewsAccountLocalStateController }) {
  return <><section className="news-pc-account-panel"><ToggleRow checked={local.state.offlineWifiOnly} icon={Wifi} label="仅在 Wi-Fi 下下载" onChange={(value) => local.update((current) => ({ ...current, offlineWifiOnly: value }))} /></section><ContentList emptyText="暂无离线内容" icon={Download} items={local.state.offlineItems} onRemove={local.removeOfflineItem} removeLabel="删除下载" /></>;
}

function UsageDetail({ demoMode }: { demoMode: boolean }) {
  if (!demoMode) return <DetailState icon={Clock3} text="智能体用量服务尚未连接" />;
  return <div className="news-pc-account-panels"><section className="news-pc-account-panel"><h2>本月效率</h2><div className="news-pc-usage-summary"><strong>24.6</strong><span>小时已节省</span></div><MetricRow label="市场雷达" value="18 次运行" /><MetricRow label="产品观察" value="14 次运行" /><MetricRow label="政策周报" value="10 次运行" /></section><section className="news-pc-account-panel"><h2>信息处理</h2><MetricRow label="阅读来源" value="1,286 条" /><MetricRow label="去重后发现" value="312 条" /><MetricRow label="有效摘要" value="86 条" /></section></div>;
}

function NotificationsDetail({ local }: { local: NewsAccountLocalStateController }) {
  const update = (key: keyof typeof local.state.notifications, value: boolean) => local.update((current) => ({ ...current, notifications: { ...current.notifications, [key]: value } }));
  return <section className="news-pc-account-panel"><ToggleRow checked={local.state.notifications.enabled} icon={Bell} label="允许通知" onChange={(value) => update("enabled", value)} /><ToggleRow checked={local.state.notifications.breakingNews} disabled={!local.state.notifications.enabled} icon={RefreshCw} label="重要新闻" onChange={(value) => update("breakingNews", value)} /><ToggleRow checked={local.state.notifications.agentDigests} disabled={!local.state.notifications.enabled} icon={Clock3} label="智能体摘要" onChange={(value) => update("agentDigests", value)} /><ToggleRow checked={local.state.notifications.quietHours} disabled={!local.state.notifications.enabled} icon={Moon} label="夜间免打扰 22:00-07:00" onChange={(value) => update("quietHours", value)} /></section>;
}

function LanguageDetail({ local }: { local: NewsAccountLocalStateController }) {
  return <section className="news-pc-account-panel"><ChoiceRow checked={local.state.language === "zh-CN"} description="简体中文（中国）" label="简体中文" onClick={() => local.update((current) => ({ ...current, language: "zh-CN" }))} /><ChoiceRow checked={local.state.language === "en-US"} description="English (United States)" label="English" onClick={() => local.update((current) => ({ ...current, language: "en-US" }))} /><p className="news-pc-account-note"><Languages size={14} />新闻内容保留原文，智能体输出会优先使用所选语言。</p></section>;
}

function AppearanceDetail({ local }: { local: NewsAccountLocalStateController }) {
  return <section className="news-pc-account-panel"><ChoiceRow checked={local.state.appearance === "system"} description="根据设备外观自动切换" label="跟随系统" onClick={() => local.update((current) => ({ ...current, appearance: "system" }))} /><ChoiceRow checked={local.state.appearance === "light"} description="始终使用浅色界面" label="浅色" onClick={() => local.update((current) => ({ ...current, appearance: "light" }))} /><ChoiceRow checked={local.state.appearance === "dark"} description="降低暗光环境下的视觉亮度" label="深色" onClick={() => local.update((current) => ({ ...current, appearance: "dark" }))} /></section>;
}

function PrivacyDetail({ local }: { local: NewsAccountLocalStateController }) {
  const update = (key: keyof typeof local.state.privacy, value: boolean) => local.update((current) => ({ ...current, privacy: { ...current.privacy, [key]: value } }));
  return <section className="news-pc-account-panel"><ToggleRow checked={local.state.privacy.personalizedNews} icon={FileText} label="个性化新闻" onChange={(value) => update("personalizedNews", value)} /><ToggleRow checked={local.state.privacy.agentLearning} icon={ShieldCheck} label="允许智能体学习阅读偏好" onChange={(value) => update("agentLearning", value)} /><ToggleRow checked={local.state.privacy.analytics} icon={MonitorSmartphone} label="匿名体验分析" onChange={(value) => update("analytics", value)} /></section>;
}

function SecurityDetail({ controller, demoMode }: Pick<DetailProps, "controller" | "demoMode">) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(undefined); setMessage(undefined);
    if (newPassword.length < 8) { setError("新密码至少需要 8 个字符"); return; }
    if (newPassword !== confirmPassword) { setError("两次输入的新密码不一致"); return; }
    if (demoMode) { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setMessage("演示环境已完成密码规则校验，不会保存密码"); return; }
    if (await controller.changePassword({ confirmPassword, currentPassword, newPassword })) { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
  };
  return <section className="news-pc-account-panel"><div className="news-pc-account-detail__heading"><KeyRound size={19} /><div><h2>修改密码</h2><p>更新后当前设备保持登录</p></div></div><form className="news-pc-account-form" onSubmit={submit}><label><span>当前密码</span><input aria-label="当前密码" autoComplete="current-password" onChange={(event) => setCurrentPassword(event.target.value)} required type="password" value={currentPassword} /></label><label><span>新密码</span><input aria-label="新密码" autoComplete="new-password" minLength={8} onChange={(event) => setNewPassword(event.target.value)} required type="password" value={newPassword} /></label><label><span>确认新密码</span><input aria-label="确认新密码" autoComplete="new-password" minLength={8} onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} /></label><button disabled={controller.passwordPending} type="submit"><KeyRound size={15} />更新密码</button></form><MutationMessage error={error ?? controller.mutationError} message={message ?? controller.mutationMessage} /></section>;
}

function DevicesDetail({ demoMode, local, service }: Pick<DetailProps, "demoMode" | "local" | "service">) {
  const [session, setSession] = useState<NewsAccountSession>();
  const [status, setStatus] = useState<"error" | "loading" | "ready">(demoMode ? "ready" : "loading");
  useEffect(() => {
    let cancelled = false;
    if (demoMode) return () => { cancelled = true; };
    if (!service?.getCurrentSession) { setStatus("error"); return () => { cancelled = true; }; }
    void service.getCurrentSession().then((value) => { if (!cancelled) { setSession(value); setStatus("ready"); } }, () => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, [demoMode, service]);
  if (status === "loading") return <DetailState icon={LoaderCircle} spinning text="正在读取当前会话" />;
  if (status === "error") return <DetailState icon={Smartphone} text="当前会话信息暂不可用" />;
  const devices = demoMode ? local.state.devices : [{ current: true, id: session?.id ?? "current-session", lastActive: session?.lastActiveAt ?? "当前在线", location: session?.ipAddress ?? "位置未提供", name: session?.userAgent ?? "当前浏览器" }];
  return <section className="news-pc-account-panel">{devices.map((device) => <div className="news-pc-device" key={device.id}><span><Smartphone size={18} /></span><div><h2>{device.name}</h2><p>{device.location} · {device.lastActive}</p></div>{device.current ? <small>当前设备</small> : <button aria-label={`退出 ${device.name}`} onClick={() => local.removeDevice(device.id)} type="button"><Trash2 size={15} /></button>}</div>)}</section>;
}

function HelpDetail() {
  return <><section className="news-pc-account-panel news-pc-faq"><details><summary>智能体为什么没有按时运行？</summary><p>检查智能体是否暂停、时区是否正确，以及通知和网络状态。</p></details><details><summary>如何核验智能体引用的新闻？</summary><p>打开摘要中的引用卡片，可查看来源、发布时间和原文信息。</p></details><details><summary>收藏和阅读历史是否跨端同步？</summary><p>演示环境的数据仅保存在当前浏览器；生产环境在同步服务接通后提供跨端数据。</p></details></section><a className="news-pc-account-link" href="https://sdkwork.com/support/news" rel="noreferrer" target="_blank">访问帮助中心<ExternalLink size={15} /></a></>;
}

function AboutDetail() {
  return <section className="news-pc-account-panel news-pc-about"><div>N</div><h2>SDKWork News</h2><p>版本 0.1.0 · PC</p><dl><div><dt>隐私政策</dt><dd>2026.07</dd></div><div><dt>用户协议</dt><dd>2026.07</dd></div><div><dt>开源许可</dt><dd>查看清单</dd></div></dl></section>;
}

function ContentList({ emptyText, icon: Icon, items, onRemove, removeLabel }: { emptyText: string; icon: LucideIcon; items: readonly NewsAccountContentItem[]; onRemove?(id: string): void; removeLabel?: string }) {
  if (items.length === 0) return <DetailState icon={Icon} text={emptyText} />;
  return <section className="news-pc-account-content-list">{items.map((item) => <article key={item.id}><span><Icon size={17} /></span><div><h2>{item.title}</h2><p>{item.source} · {item.meta}</p></div>{onRemove && <button aria-label={`${removeLabel} ${item.title}`} onClick={() => onRemove(item.id)} type="button"><Trash2 size={15} /></button>}</article>)}</section>;
}

function ToggleRow({ checked, disabled = false, icon: Icon, label, onChange }: { checked: boolean; disabled?: boolean; icon: LucideIcon; label: string; onChange(value: boolean): void }) {
  return <div className="news-pc-account-toggle"><span><Icon size={17} /></span><strong>{label}</strong><button aria-checked={checked} aria-label={label} className={checked ? "is-checked" : ""} disabled={disabled} onClick={() => onChange(!checked)} role="switch" type="button"><i /></button></div>;
}

function ChoiceRow({ checked, description, label, onClick }: { checked: boolean; description: string; label: string; onClick(): void }) {
  return <button aria-checked={checked} className="news-pc-account-choice" onClick={onClick} role="radio" type="button"><span><strong>{label}</strong><small>{description}</small></span>{checked && <Check size={18} />}</button>;
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return <div className="news-pc-account-metric"><span>{label}</span><strong>{value}</strong></div>;
}

function MutationMessage({ error, message }: { error?: string; message?: string }) {
  if (!error && !message) return null;
  return <p className={error ? "news-pc-account-message is-error" : "news-pc-account-message"} role={error ? "alert" : "status"}>{error ?? message}</p>;
}

function DetailState({ icon: Icon, spinning = false, text }: { icon: LucideIcon; spinning?: boolean; text: string }) {
  return <section className="news-pc-account-detail__state"><Icon className={spinning ? "is-spinning" : ""} size={25} /><p>{text}</p></section>;
}
