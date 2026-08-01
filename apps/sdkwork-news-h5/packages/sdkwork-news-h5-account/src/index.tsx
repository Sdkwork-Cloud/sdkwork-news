import { type FormEvent, useState } from "react";
import {
  Bell,
  Bookmark,
  ChevronRight,
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

export interface NewsH5AccountProps {
  demoMode?: boolean;
  service?: NewsAccountService;
}

export function NewsH5Account({
  demoMode = false,
  service,
}: NewsH5AccountProps) {
  const controller = useNewsAccountController(service);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (demoMode) {
    return <NewsH5AccountDemo />;
  }

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void controller.login(password, username);
  };

  return <div className="news-h5-account">
    <header><h1>我的</h1></header>
    <main>
      {controller.status === "loading" && <AccountState icon={LoaderCircle} spinning title="正在读取账号" />}
      {controller.status === "unavailable" && <AccountState icon={UserRound} title="账号服务未连接" />}
      {controller.status === "error" && <AccountState action={<button onClick={controller.retry} type="button"><RefreshCw size={13} />重试</button>} icon={Shield} title="账号信息暂不可用" />}
      {controller.status === "unauthenticated" && <section className="news-h5-login">
        <header><span><LogIn size={18} /></span><div><h2>登录 SDKWork News</h2><p>使用 SDKWork IAM 账号继续</p></div></header>
        <form onSubmit={submitLogin}>
          <label><span>账号</span><input autoComplete="username" onChange={(event) => setUsername(event.target.value)} required value={username} /></label>
          <label><span>密码</span><input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
          {controller.loginError && <p role="alert">{controller.loginError}</p>}
          <button disabled={controller.loginPending} type="submit">{controller.loginPending && <LoaderCircle className="is-spinning" size={14} />}{controller.loginPending ? "正在登录" : "登录"}</button>
        </form>
      </section>}

      {controller.status === "authenticated" && controller.profile && <>
        <section className="news-h5-profile">
          <span>{controller.profile.avatarUrl ? <img alt="" src={controller.profile.avatarUrl} /> : initials(controller.profile.displayName)}</span>
          <div><h2>{controller.profile.displayName}</h2><p>{controller.profile.email ?? controller.profile.username ?? "未提供联系信息"}</p><small>SDKWork IAM</small></div>
          <ChevronRight size={18} />
        </section>

        <section className="news-h5-availability">
          <div><CreditCard size={16} /><span><strong>订阅</strong><small>暂不可用</small></span></div>
          <div><Monitor size={16} /><span><strong>设备</strong><small>暂不可用</small></span></div>
        </section>

        <section className="news-h5-account-group">
          <h3>身份信息</h3>
          <AccountRow icon={UserRound} label="用户 ID" value={controller.profile.id ?? "暂不可用"} />
          <AccountRow icon={KeyRound} label="用户名" value={controller.profile.username ?? "暂不可用"} />
          <AccountRow icon={Shield} label="身份来源" value="SDKWork IAM" />
        </section>
        <section className="news-h5-account-group">
          <h3>内容与数据</h3>
          <AccountRow icon={Bookmark} label="我的收藏" value="暂不可用" />
          <AccountRow icon={History} label="阅读历史" value="暂不可用" />
        </section>
        {controller.loginError && <p className="news-h5-account__error" role="alert">{controller.loginError}</p>}
        <footer><button disabled={controller.logoutPending} onClick={() => void controller.logout()} type="button">{controller.logoutPending ? <LoaderCircle className="is-spinning" size={15} /> : <LogOut size={15} />}{controller.logoutPending ? "正在退出" : "退出登录"}</button><p>SDKWork News 0.1.0</p></footer>
      </>}
    </main>
  </div>;
}

function AccountState({
  action,
  icon: Icon,
  spinning = false,
  title,
}: {
  action?: React.ReactNode;
  icon: typeof UserRound;
  spinning?: boolean;
  title: string;
}) {
  return <section className="news-h5-account__state" role="status"><Icon className={spinning ? "is-spinning" : ""} size={22} /><h2>{title}</h2>{action}</section>;
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
  return <div className="news-h5-account-row"><span><Icon size={16} /></span><strong>{label}</strong><small>{value}</small></div>;
}

function NewsH5AccountDemo() {
  return <div className="news-h5-account is-demo">
    <header><h1>我的</h1></header>
    <main>
      <section className="news-h5-profile">
        <span>林</span>
        <div><h2>林然</h2><p>linran@sdkwork.com</p><small>演示身份</small></div>
      </section>
      <section className="news-h5-availability">
        <div><CreditCard size={16} /><span><strong>订阅</strong><small>专业版</small></span></div>
        <div><Clock3 size={16} /><span><strong>本月节省</strong><small>24.6 小时</small></span></div>
      </section>
      <section className="news-h5-account-group">
        <h3>内容与数据</h3>
        <AccountRow icon={Bookmark} label="我的收藏" value="128" />
        <AccountRow icon={History} label="阅读历史" value="46" />
        <AccountRow icon={Download} label="离线内容" value="12" />
      </section>
      <section className="news-h5-account-group">
        <h3>偏好设置</h3>
        <AccountRow icon={Bell} label="通知与提醒" value="重要更新" />
        <AccountRow icon={Languages} label="语言与地区" value="简体中文" />
        <AccountRow icon={Moon} label="显示与外观" value="跟随系统" />
      </section>
      <section className="news-h5-account-group">
        <h3>账号与安全</h3>
        <AccountRow icon={Shield} label="隐私控制" value="标准保护" />
        <AccountRow icon={Monitor} label="登录设备" value="2 台" />
        <AccountRow icon={CircleHelp} label="帮助与支持" value="帮助中心" />
      </section>
      <footer><p>SDKWork News 0.1.0 · 演示环境</p></footer>
    </main>
  </div>;
}

function initials(displayName: string): string {
  return displayName.trim().slice(0, 2).toUpperCase() || "U";
}

export default NewsH5Account;
