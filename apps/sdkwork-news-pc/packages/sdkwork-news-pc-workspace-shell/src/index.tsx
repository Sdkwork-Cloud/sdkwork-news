import type { ReactNode } from "react";
import {
  Bot,
  Maximize2,
  Minus,
  Newspaper,
  Settings,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import "./styles.css";

export type NewsPcWorkspaceTab = "account" | "assistant" | "news" | "store";

export interface NewsPcWindowControls {
  close(): void;
  maximize(): void;
  minimize(): void;
}

const tabs = [
  { id: "assistant" as const, label: "助手", icon: Bot },
  { id: "news" as const, label: "新闻", icon: Newspaper },
  { id: "store" as const, label: "AI Store", icon: ShoppingBag },
  { id: "account" as const, label: "我的", icon: UserRound },
];

export function NewsPcWorkspaceShell({
  activeTab,
  children,
  onTabChange,
  windowControls,
}: {
  activeTab: NewsPcWorkspaceTab;
  children: ReactNode;
  onTabChange(tab: NewsPcWorkspaceTab): void;
  windowControls?: NewsPcWindowControls;
}) {
  return <div className="news-pc-workspace">
    <header className="news-pc-titlebar">
      <div className="news-pc-titlebar__brand"><span>N</span><strong>SDKWork News</strong></div>
      <div className="news-pc-titlebar__status"><i />智能体阅读工作台</div>
      {windowControls && <div className="news-pc-titlebar__controls">
        <button onClick={windowControls.minimize} type="button" title="最小化"><Minus size={14} /></button>
        <button onClick={windowControls.maximize} type="button" title="最大化"><Maximize2 size={13} /></button>
        <button onClick={windowControls.close} type="button" title="关闭"><X size={15} /></button>
      </div>}
    </header>
    <div className="news-pc-workspace__body">
      <nav className="news-pc-global-nav">
        <button className="news-pc-global-nav__avatar" onClick={() => onTabChange("account")} title="我的" type="button">林<span /></button>
        {tabs.map(({ id, label, icon: Icon }) => <button className={activeTab === id ? "is-active" : ""} onClick={() => onTabChange(id)} key={id} type="button" title={label}><Icon size={21} /><span>{label}</span></button>)}
        <button className="news-pc-global-nav__settings" onClick={() => onTabChange("account")} type="button" title="设置"><Settings size={20} /><span>设置</span></button>
      </nav>
      <main className="news-pc-workspace__content">{children}</main>
    </div>
  </div>;
}

export default NewsPcWorkspaceShell;
