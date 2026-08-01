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
  type LucideIcon,
} from "lucide-react";
import type {
  NewsAccountLocalState,
} from "@sdkwork/news-account-react";
import type { NewsAccountProfile } from "@sdkwork/news-account-service";
import type { NewsPcAccountPage } from "./account-detail.js";

export function NewsPcAccountOverview({
  demoMode,
  localState,
  logoutPending,
  onLogout,
  onOpen,
  profile,
}: {
  demoMode: boolean;
  localState: NewsAccountLocalState;
  logoutPending: boolean;
  onLogout(): void;
  onOpen(page: NewsPcAccountPage): void;
  profile: NewsAccountProfile;
}) {
  const displayName = demoMode ? localState.demoDisplayName : profile.displayName;
  return <>
    <button className="news-account-profile" onClick={() => onOpen("profile")} type="button">
      <span>{profile.avatarUrl ? <img alt="" src={profile.avatarUrl} /> : initials(displayName)}</span>
      <div><h2>{displayName}</h2><p>{profile.email ?? profile.username ?? "未提供联系信息"}</p><small>{demoMode ? "演示身份" : "身份由 SDKWork IAM 验证"}</small></div>
      <ChevronRight size={17} />
    </button>

    <div className="news-account-availability">
      <button onClick={() => onOpen("subscription")} type="button"><CreditCard size={18} /><span><strong>订阅</strong><small>{demoMode ? "专业版" : "账户中心"}</small></span><ChevronRight size={14} /></button>
      <button onClick={() => onOpen("usage")} type="button"><Clock3 size={18} /><span><strong>本月节省</strong><small>{demoMode ? "24.6 小时" : "查看用量"}</small></span><ChevronRight size={14} /></button>
      <button onClick={() => onOpen("devices")} type="button"><Monitor size={18} /><span><strong>登录设备</strong><small>{demoMode ? `${localState.devices.length} 台` : "当前会话"}</small></span><ChevronRight size={14} /></button>
    </div>

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
    <AccountGroup title="账号与支持">
      <AccountRow icon={Shield} label="隐私控制" onClick={() => onOpen("privacy")} value="标准保护" />
      <AccountRow icon={KeyRound} label="账号安全" onClick={() => onOpen("security")} value="修改密码" />
      <AccountRow icon={Monitor} label="登录设备" onClick={() => onOpen("devices")} value={demoMode ? `${localState.devices.length} 台` : "当前会话"} />
      <AccountRow icon={CircleHelp} label="帮助与支持" onClick={() => onOpen("help")} value="帮助中心" />
      <AccountRow icon={Info} label="关于" onClick={() => onOpen("about")} value="0.1.0" />
    </AccountGroup>
    <footer className="news-account-footer">
      <button disabled={logoutPending} onClick={onLogout} type="button">{logoutPending ? <LoaderCircle className="is-spinning" size={15} /> : <LogOut size={15} />}{logoutPending ? "正在退出" : demoMode ? "退出演示账户" : "退出登录"}</button>
      <span>SDKWork News 0.1.0{demoMode ? " · 演示环境" : ""}</span>
    </footer>
  </>;
}

function AccountGroup({ children, title }: { children: React.ReactNode; title: string }) {
  return <section className="news-account-group"><h3>{title}</h3>{children}</section>;
}

function AccountRow({
  icon: Icon,
  label,
  onClick,
  value,
}: {
  icon: LucideIcon;
  label: string;
  onClick(): void;
  value: string;
}) {
  return <button className="news-account-row" onClick={onClick} type="button"><span><Icon size={17} /></span><strong>{label}</strong><small>{value}</small><ChevronRight size={15} /></button>;
}

function appearanceLabel(value: NewsAccountLocalState["appearance"]): string {
  return value === "dark" ? "深色" : value === "light" ? "浅色" : "跟随系统";
}

function initials(displayName: string): string {
  return displayName.trim().slice(0, 2).toUpperCase() || "U";
}
