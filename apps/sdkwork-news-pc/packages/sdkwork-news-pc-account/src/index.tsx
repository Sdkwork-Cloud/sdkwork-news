import { type FormEvent, useState } from "react";
import {
  Bell,
  Bookmark,
  CircleHelp,
  Clock3,
  CreditCard,
  Download,
  History,
  KeyRound,
  Languages,
  LoaderCircle,
  LogIn,
  LogOut,
  Monitor,
  Moon,
  RefreshCw,
  Shield,
  UserRound,
} from "lucide-react";
import { useNewsAccountController } from "@sdkwork/news-account-react";
import type { NewsAccountService } from "@sdkwork/news-account-service";
import "./styles.css";

export interface NewsPcAccountProps {
  demoMode?: boolean;
  service?: NewsAccountService;
}

export function NewsPcAccount({
  demoMode = false,
  service,
}: NewsPcAccountProps) {
  const controller = useNewsAccountController(service);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (demoMode) {
    return <NewsPcAccountDemo />;
  }

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void controller.login(password, username);
  };

  return <div className="news-pc-account">
    <header><h1>我的</h1><p>账号与个人数据</p></header>
    <main>
      {controller.status === "loading" && <AccountState icon={LoaderCircle} spinning title="正在读取账号" />}
      {controller.status === "unavailable" && <AccountState icon={UserRound} title="账号服务未连接" description="连接 IAM 服务后即可登录和查看账号。" />}
      {controller.status === "error" && <AccountState icon={Shield} title="账号信息暂不可用" action={<button onClick={controller.retry} type="button"><RefreshCw size={14} />重试</button>} />}
      {controller.status === "unauthenticated" && <section className="news-account-login">
        <header><span><LogIn size={19} /></span><div><h2>登录 SDKWork News</h2><p>使用 SDKWork IAM 账号继续</p></div></header>
        <form onSubmit={submitLogin}>
          <label><span>账号</span><input autoComplete="username" onChange={(event) => setUsername(event.target.value)} required value={username} /></label>
          <label><span>密码</span><input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
          {controller.loginError && <p role="alert">{controller.loginError}</p>}
          <button disabled={controller.loginPending} type="submit">{controller.loginPending && <LoaderCircle className="is-spinning" size={14} />}{controller.loginPending ? "正在登录" : "登录"}</button>
        </form>
      </section>}

      {controller.status === "authenticated" && controller.profile && <>
        <section className="news-account-profile">
          <span>{controller.profile.avatarUrl
            ? <img alt="" src={controller.profile.avatarUrl} />
            : initials(controller.profile.displayName)}</span>
          <div><h2>{controller.profile.displayName}</h2><p>{controller.profile.email ?? controller.profile.username ?? "未提供联系信息"}</p><small>身份由 SDKWork IAM 验证</small></div>
        </section>

        <div className="news-account-availability">
          <article><CreditCard size={18} /><div><strong>订阅</strong><span>暂不可用</span></div></article>
          <article><Clock3 size={18} /><div><strong>使用量</strong><span>暂不可用</span></div></article>
          <article><Monitor size={18} /><div><strong>登录设备</strong><span>暂不可用</span></div></article>
        </div>

        <section className="news-account-group">
          <h3>身份信息</h3>
          <AccountRow icon={UserRound} label="用户 ID" value={controller.profile.id ?? "暂不可用"} />
          <AccountRow icon={KeyRound} label="用户名" value={controller.profile.username ?? "暂不可用"} />
          <AccountRow icon={Shield} label="身份来源" value="SDKWork IAM" />
        </section>

        <section className="news-account-group">
          <h3>内容与数据</h3>
          <AccountRow icon={Bookmark} label="我的收藏" value="暂不可用" />
          <AccountRow icon={History} label="阅读历史" value="暂不可用" />
        </section>

        {controller.loginError && <p className="news-account-command-error" role="alert">{controller.loginError}</p>}
        <footer className="news-account-footer">
          <button disabled={controller.logoutPending} onClick={() => void controller.logout()} type="button">
            {controller.logoutPending ? <LoaderCircle className="is-spinning" size={15} /> : <LogOut size={15} />}
            {controller.logoutPending ? "正在退出" : "退出登录"}
          </button>
          <span>SDKWork News 0.1.0</span>
        </footer>
      </>}
    </main>
  </div>;
}

function AccountState({
  action,
  description,
  icon: Icon,
  spinning = false,
  title,
}: {
  action?: React.ReactNode;
  description?: string;
  icon: typeof UserRound;
  spinning?: boolean;
  title: string;
}) {
  return <section className="news-account-state" role="status">
    <Icon className={spinning ? "is-spinning" : ""} size={23} />
    <h2>{title}</h2>
    {description && <p>{description}</p>}
    {action}
  </section>;
}

function AccountRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return <div className="news-account-row"><span><Icon size={17} /></span><strong>{label}</strong><small>{value}</small></div>;
}

function NewsPcAccountDemo() {
  return <div className="news-pc-account is-demo">
    <header><h1>我的</h1><p>账号与个人数据</p></header>
    <main>
      <section className="news-account-profile">
        <span>林</span>
        <div><h2>林然</h2><p>linran@sdkwork.com</p><small>演示身份</small></div>
      </section>
      <div className="news-account-availability">
        <article><CreditCard size={18} /><div><strong>订阅</strong><span>专业版</span></div></article>
        <article><Clock3 size={18} /><div><strong>本月节省</strong><span>24.6 小时</span></div></article>
        <article><Monitor size={18} /><div><strong>阅读任务</strong><span>1,284 次</span></div></article>
      </div>
      <section className="news-account-group">
        <h3>内容与数据</h3>
        <AccountRow icon={Bookmark} label="我的收藏" value="128" />
        <AccountRow icon={History} label="阅读历史" value="46" />
        <AccountRow icon={Download} label="离线内容" value="12" />
      </section>
      <section className="news-account-group">
        <h3>偏好设置</h3>
        <AccountRow icon={Bell} label="通知与提醒" value="重要更新" />
        <AccountRow icon={Languages} label="语言与地区" value="简体中文" />
        <AccountRow icon={Moon} label="显示与外观" value="跟随系统" />
      </section>
      <section className="news-account-group">
        <h3>账号与安全</h3>
        <AccountRow icon={Shield} label="隐私控制" value="标准保护" />
        <AccountRow icon={Monitor} label="登录设备" value="2 台" />
        <AccountRow icon={CircleHelp} label="帮助与支持" value="帮助中心" />
      </section>
      <footer className="news-account-footer"><span>SDKWork News 0.1.0 · 演示环境</span></footer>
    </main>
  </div>;
}

function initials(displayName: string): string {
  return displayName.trim().slice(0, 2).toUpperCase() || "U";
}

export default NewsPcAccount;
