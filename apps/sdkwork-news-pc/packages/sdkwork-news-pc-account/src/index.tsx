import { type FormEvent, useState } from "react";
import {
  LoaderCircle,
  LogIn,
  RefreshCw,
  Shield,
  UserRound,
} from "lucide-react";
import {
  useNewsAccountController,
  useNewsAccountLocalState,
  type NewsAccountStorage,
} from "@sdkwork/news-account-react";
import type {
  NewsAccountProfile,
  NewsAccountService,
} from "@sdkwork/news-account-service";
import {
  NewsPcAccountDetail,
  type NewsPcAccountPage,
} from "./account-detail.js";
import { NewsPcAccountOverview } from "./account-overview.js";
import "./styles.css";

const DEMO_PROFILE: NewsAccountProfile = {
  displayName: "林然",
  email: "linran@sdkwork.com",
  id: "demo-user",
  username: "linran",
};

export interface NewsPcAccountProps {
  demoMode?: boolean;
  service?: NewsAccountService;
  storage?: NewsAccountStorage;
}

export function NewsPcAccount({
  demoMode = false,
  service,
  storage,
}: NewsPcAccountProps) {
  const controller = useNewsAccountController(service);
  const local = useNewsAccountLocalState(storage, demoMode);
  const [demoSignedOut, setDemoSignedOut] = useState(false);
  const [page, setPage] = useState<NewsPcAccountPage>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const profile = demoMode
    ? demoSignedOut ? undefined : DEMO_PROFILE
    : controller.profile;

  if (page && profile) {
    return <NewsPcAccountDetail
      controller={controller}
      demoMode={demoMode}
      local={local}
      onBack={() => setPage(undefined)}
      page={page}
      profile={profile}
      service={service}
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

  return <div className={`news-pc-account is-${local.state.appearance}`}>
    <header><h1>我的</h1><p>账号、内容与偏好设置</p></header>
    <main>
      {!demoMode && controller.status === "loading" && <AccountState icon={LoaderCircle} spinning title="正在读取账号" />}
      {!demoMode && controller.status === "unavailable" && <AccountState icon={UserRound} title="账号服务未连接" description="连接 IAM 服务后即可登录和查看账号。" />}
      {!demoMode && controller.status === "error" && <AccountState icon={Shield} title="账号信息暂不可用" action={<button onClick={controller.retry} type="button"><RefreshCw size={14} />重试</button>} />}
      {((demoMode && demoSignedOut) || (!demoMode && controller.status === "unauthenticated")) && <section className="news-account-login">
        <header><span><LogIn size={19} /></span><div><h2>{demoMode ? "演示账户已退出" : "登录 SDKWork News"}</h2><p>{demoMode ? "本机偏好与内容数据仍保留" : "使用 SDKWork IAM 账号继续"}</p></div></header>
        <form onSubmit={submitLogin}>
          {!demoMode && <>
            <label><span>账号</span><input aria-label="账号" autoComplete="username" onChange={(event) => setUsername(event.target.value)} required value={username} /></label>
            <label><span>密码</span><input aria-label="密码" autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
          </>}
          {controller.loginError && <p role="alert">{controller.loginError}</p>}
          <button disabled={controller.loginPending} type="submit">{controller.loginPending && <LoaderCircle className="is-spinning" size={14} />}{controller.loginPending ? "正在登录" : demoMode ? "重新进入演示账户" : "登录"}</button>
        </form>
      </section>}
      {profile && <NewsPcAccountOverview
        demoMode={demoMode}
        localState={local.state}
        logoutPending={controller.logoutPending}
        onLogout={() => demoMode ? setDemoSignedOut(true) : void controller.logout()}
        onOpen={setPage}
        profile={profile}
      />}
      {controller.loginError && profile && <p className="news-account-command-error" role="alert">{controller.loginError}</p>}
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
  return <section className="news-account-state" role="status"><Icon className={spinning ? "is-spinning" : ""} size={23} /><h2>{title}</h2>{description && <p>{description}</p>}{action}</section>;
}

export type { NewsAccountStorage as NewsPcAccountStorage } from "@sdkwork/news-account-react";
export default NewsPcAccount;
