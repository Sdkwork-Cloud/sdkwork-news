import { type FormEvent, useEffect, useState } from "react";
import {
  LoaderCircle,
  LogIn,
  RefreshCw,
  Shield,
  UserRound,
} from "lucide-react";
import { useNewsAccountController } from "@sdkwork/news-account-react";
import type {
  NewsAccountProfile,
  NewsAccountService,
} from "@sdkwork/news-account-service";
import {
  NewsH5AccountDetail,
  type NewsH5AccountPage,
} from "./account-detail.js";
import {
  type NewsH5AccountStorage,
  useNewsH5AccountLocalState,
} from "./account-local-state.js";
import { NewsH5AccountOverview } from "./account-overview.js";
import "./styles.css";

export interface NewsH5AccountProps {
  demoMode?: boolean;
  onSecondaryPageChange?(value: boolean): void;
  service?: NewsAccountService;
  storage?: NewsH5AccountStorage;
}

const DEMO_PROFILE: NewsAccountProfile = {
  displayName: "林然",
  email: "linran@sdkwork.com",
  id: "demo-user",
  username: "linran",
};

export function NewsH5Account({
  demoMode = false,
  onSecondaryPageChange,
  service,
  storage,
}: NewsH5AccountProps) {
  const controller = useNewsAccountController(service);
  const local = useNewsH5AccountLocalState(storage, demoMode);
  const [activePage, setActivePage] = useState<NewsH5AccountPage>();
  const [demoSignedOut, setDemoSignedOut] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => () => onSecondaryPageChange?.(false), [onSecondaryPageChange]);

  const openPage = (page: NewsH5AccountPage) => {
    setActivePage(page);
    onSecondaryPageChange?.(true);
  };
  const closePage = () => {
    setActivePage(undefined);
    onSecondaryPageChange?.(false);
  };

  if (activePage) {
    const profile = demoMode
      ? { ...DEMO_PROFILE, displayName: local.state.demoDisplayName }
      : controller.profile;
    if (profile) {
      return <NewsH5AccountDetail
        controller={controller}
        demoMode={demoMode}
        local={local}
        onBack={closePage}
        page={activePage}
        profile={profile}
        service={service}
      />;
    }
  }

  if (demoMode && !demoSignedOut) {
    return <NewsH5AccountOverview
      demoMode
      localState={local.state}
      logoutPending={false}
      onLogout={() => setDemoSignedOut(true)}
      onOpen={openPage}
      profile={DEMO_PROFILE}
    />;
  }

  if (!demoMode && controller.status === "authenticated" && controller.profile) {
    return <NewsH5AccountOverview
      demoMode={false}
      localState={local.state}
      logoutPending={controller.logoutPending}
      onLogout={() => void controller.logout()}
      onOpen={openPage}
      profile={controller.profile}
    />;
  }

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (demoMode) {
      setDemoSignedOut(false);
      return;
    }
    void controller.login(password, username);
  };

  return <div className={`news-h5-account is-${local.state.appearance}`}>
    <header><h1>我的</h1></header>
    <main>
      {!demoMode && controller.status === "loading" && <AccountState icon={LoaderCircle} spinning title="正在读取账号" />}
      {!demoMode && controller.status === "unavailable" && <AccountState icon={UserRound} title="账号服务未连接" />}
      {!demoMode && controller.status === "error" && <AccountState action={<button onClick={controller.retry} type="button"><RefreshCw size={13} />重试</button>} icon={Shield} title="账号信息暂不可用" />}
      {(demoMode || controller.status === "unauthenticated") && <section className="news-h5-login">
        <header><span><LogIn size={18} /></span><div><h2>{demoMode ? "演示账户已退出" : "登录 SDKWork News"}</h2><p>{demoMode ? "本机偏好与内容数据仍保留" : "使用 SDKWork IAM 账号继续"}</p></div></header>
        <form onSubmit={submitLogin}>
          {!demoMode && <>
            <label><span>账号</span><input autoComplete="username" onChange={(event) => setUsername(event.target.value)} required value={username} /></label>
            <label><span>密码</span><input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
          </>}
          {controller.loginError && <p role="alert">{controller.loginError}</p>}
          <button disabled={controller.loginPending} type="submit">{controller.loginPending && <LoaderCircle className="is-spinning" size={14} />}{controller.loginPending ? "正在登录" : demoMode ? "重新进入演示账户" : "登录"}</button>
        </form>
      </section>}
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

export type { NewsH5AccountPage, NewsH5AccountStorage };
export default NewsH5Account;
