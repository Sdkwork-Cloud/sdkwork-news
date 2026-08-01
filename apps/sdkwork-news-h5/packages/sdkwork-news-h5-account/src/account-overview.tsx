import {
  Bell,
  Bookmark,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Download,
  Gauge,
  History,
  Info,
  KeyRound,
  Languages,
  LoaderCircle,
  LogOut,
  Monitor,
  Moon,
  Shield,
  UserRound,
} from "lucide-react";
import type { NewsAccountProfile } from "@sdkwork/news-account-service";
import type { NewsH5AccountLocalState } from "./account-local-state.js";
import type { NewsH5AccountPage } from "./account-detail.js";

export interface NewsH5AccountOverviewProps {
  demoMode: boolean;
  localState: NewsH5AccountLocalState;
  logoutPending: boolean;
  onLogout(): void;
  onOpen(page: NewsH5AccountPage): void;
  profile: NewsAccountProfile;
}

export function NewsH5AccountOverview({
  demoMode,
  localState,
  logoutPending,
  onLogout,
  onOpen,
  profile,
}: NewsH5AccountOverviewProps) {
  const displayName = demoMode ? localState.demoDisplayName : profile.displayName;
  return <div className={`news-h5-account is-${localState.appearance}`}>
    <header><h1>我的</h1></header>
    <main>
      <button className="news-h5-profile" onClick={() => onOpen("profile")} type="button">
        <span>{profile.avatarUrl ? <img alt="" src={profile.avatarUrl} /> : initials(displayName)}</span>
        <div><h2>{displayName}</h2><p>{profile.email ?? profile.username ?? "未提供联系信息"}</p><small>{demoMode ? "演示身份" : "SDKWork IAM"}</small></div>
        <ChevronRight size={18} />
      </button>

      <section className="news-h5-availability">
        <button onClick={() => onOpen("subscription")} type="button"><CreditCard size={16} /><span><strong>订阅</strong><small>{demoMode ? "专业版" : "账户中心"}</small></span><ChevronRight size={14} /></button>
        <button onClick={() => onOpen("usage")} type="button"><Clock3 size={16} /><span><strong>本月节省</strong><small>{demoMode ? "24.6 小时" : "查看用量"}</small></span><ChevronRight size={14} /></button>
      </section>

      <AccountGroup title="内容与数据">
        <AccountRow icon={Bookmark} label="我的收藏" onClick={() => onOpen("saved")} value={demoMode ? String(localState.savedItems.length) : "查看"} />
        <AccountRow icon={History} label="阅读历史" onClick={() => onOpen("history")} value={demoMode ? String(localState.history.length) : "查看"} />
        <AccountRow icon={Download} label="离线内容" onClick={() => onOpen("offline")} value={String(localState.offlineItems.length)} />
        <AccountRow icon={Gauge} label="智能体用量" onClick={() => onOpen("usage")} value="本月" />
      </AccountGroup>

      <AccountGroup title="偏好设置">
        <AccountRow icon={Bell} label="通知与提醒" onClick={() => onOpen("notifications")} value={localState.notifications.enabled ? "重要更新" : "已关闭"} />
        <AccountRow icon={Languages} label="语言与地区" onClick={() => onOpen("language")} value={localState.language === "zh-CN" ? "简体中文" : "English"} />
        <AccountRow icon={Moon} label="显示与外观" onClick={() => onOpen("appearance")} value={appearanceLabel(localState.appearance)} />
      </AccountGroup>

      <AccountGroup title="账号与安全">
        <AccountRow icon={Shield} label="隐私控制" onClick={() => onOpen("privacy")} value="标准保护" />
        <AccountRow icon={KeyRound} label="账号安全" onClick={() => onOpen("security")} value="修改密码" />
        <AccountRow icon={Monitor} label="登录设备" onClick={() => onOpen("devices")} value={demoMode ? `${localState.devices.length} 台` : "当前会话"} />
        <AccountRow icon={CircleHelp} label="帮助与支持" onClick={() => onOpen("help")} value="帮助中心" />
        <AccountRow icon={Info} label="关于" onClick={() => onOpen("about")} value="0.1.0" />
      </AccountGroup>

      <footer>
        <button disabled={logoutPending} onClick={onLogout} type="button">{logoutPending ? <LoaderCircle className="is-spinning" size={15} /> : <LogOut size={15} />}{logoutPending ? "正在退出" : demoMode ? "退出演示账户" : "退出登录"}</button>
        <p>SDKWork News 0.1.0{demoMode ? " · 演示环境" : ""}</p>
      </footer>
    </main>
  </div>;
}

function AccountGroup({ children, title }: { children: React.ReactNode; title: string }) {
  return <section className="news-h5-account-group"><h3>{title}</h3>{children}</section>;
}

function AccountRow({
  icon: Icon,
  label,
  onClick,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  onClick(): void;
  value: string;
}) {
  return <button className="news-h5-account-row" onClick={onClick} type="button"><span><Icon size={16} /></span><strong>{label}</strong><small>{value}</small><ChevronRight size={15} /></button>;
}

function initials(displayName: string): string {
  const normalized = displayName.trim();
  if (!normalized) return "U";
  return /[^\u0000-\u007f]/u.test(normalized)
    ? Array.from(normalized)[0] ?? "U"
    : normalized.slice(0, 2).toUpperCase();
}

function appearanceLabel(value: NewsH5AccountLocalState["appearance"]): string {
  if (value === "dark") return "深色";
  if (value === "light") return "浅色";
  return "跟随系统";
}
