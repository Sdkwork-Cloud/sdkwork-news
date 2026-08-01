import { type FormEvent, useState } from "react";
import {
  Boxes,
  CheckCircle2,
  Download,
  LoaderCircle,
  PackageCheck,
  PlugZap,
  RefreshCw,
  Search,
  Star,
  Wrench,
  X,
} from "lucide-react";
import { useAiStoreController } from "@sdkwork/news-ai-store-react";
import type {
  AiStoreEntry,
  AiStoreKind,
  AiStoreService,
} from "@sdkwork/news-ai-store-service";
import "./styles.css";

const STORE_TABS: readonly {
  icon: typeof Boxes;
  id: AiStoreKind;
  label: string;
}[] = [
  { id: "product", label: "AI 产品", icon: Boxes },
  { id: "skill", label: "Skills", icon: Wrench },
  { id: "mcp", label: "MCP 连接器", icon: PlugZap },
];

export interface NewsPcAiStoreProps {
  demoMode?: boolean;
  service?: AiStoreService;
}

export function NewsPcAiStore({
  demoMode = false,
  service,
}: NewsPcAiStoreProps) {
  const controller = useAiStoreController(service);
  const [searchText, setSearchText] = useState("");

  if (demoMode) {
    return <NewsPcAiStoreDemo />;
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controller.search(searchText);
  };

  return <div className="news-ai-store">
    <header>
      <div><h1>AI Store</h1><p>产品、Skills 与 MCP 连接器</p></div>
      <form onSubmit={submitSearch} role="search">
        <Search aria-hidden="true" size={17} />
        <input
          aria-label="搜索 AI Store"
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="搜索产品、能力或连接器"
          value={searchText}
        />
        <button aria-label="提交搜索" type="submit"><Search size={15} /></button>
      </form>
    </header>
    <nav aria-label="AI Store 分类">
      {STORE_TABS.map(({ id, label, icon: Icon }) => <button
        className={id === controller.selectedKind ? "is-active" : ""}
        key={id}
        onClick={() => controller.selectKind(id)}
        type="button"
      ><Icon size={16} />{label}</button>)}
    </nav>
    <main>
      <div className="news-store-heading">
        <div>
          <h2>{STORE_TABS.find((item) => item.id === controller.selectedKind)?.label}</h2>
          <p>{controller.query ? `“${controller.query}”的搜索结果` : "按服务端目录持续更新"}</p>
        </div>
        {controller.entries.length > 0 && <span>{controller.entries.length} 项</span>}
      </div>

      <StoreState onRetry={controller.retry} status={controller.status} />

      {controller.status === "ready" && <section className="news-store-grid">
        {controller.entries.map((entry) => <StoreEntryCard
          entry={entry}
          key={entry.id}
          onInstallProduct={() => void controller.installProduct(entry)}
          onOpenSkill={() => void controller.openSkillInstaller(entry)}
          onUninstallProduct={() => void controller.uninstallProduct(entry)}
          pending={controller.pendingEntryIds.has(entry.id)}
        />)}
      </section>}

      {controller.mutationError && <p className="news-store-command-error" role="alert">
        {controller.mutationError}
      </p>}
      {controller.status === "ready" && controller.canLoadMore && <button
        className="news-store-load-more"
        disabled={controller.loadingMore}
        onClick={() => void controller.loadMore()}
        type="button"
      >{controller.loadingMore && <LoaderCircle className="is-spinning" size={14} />}
        {controller.loadingMore ? "正在加载" : "加载更多"}
      </button>}
    </main>

    {controller.skillInstaller.status !== "closed" && <div className="news-store-dialog-backdrop">
      <section aria-modal="true" className="news-store-dialog" role="dialog">
        <header>
          <div><h2>选择 Skill 版本</h2><p>{controller.skillInstaller.entry?.name}</p></div>
          <button aria-label="关闭版本选择" onClick={controller.closeSkillInstaller} type="button">
            <X size={18} />
          </button>
        </header>
        {controller.skillInstaller.status === "loading" && <div className="news-store-dialog__state">
          <LoaderCircle className="is-spinning" size={20} /><span>正在读取版本</span>
        </div>}
        {controller.skillInstaller.status === "error" && <div className="news-store-dialog__state">
          <span>版本列表暂不可用</span>
        </div>}
        {(controller.skillInstaller.status === "ready" || controller.skillInstaller.status === "installing") && <div className="news-store-artifacts">
          {controller.skillInstaller.artifacts.map((artifact) => <button
            disabled={artifact.status !== "published" || controller.skillInstaller.status === "installing"}
            key={artifact.id}
            onClick={() => void controller.installSkill(artifact.id)}
            type="button"
          >
            <span><strong>{artifact.version}</strong><small>{artifact.invocationKind}</small></span>
            <b>{artifact.status === "published" ? "安装" : artifact.status}</b>
          </button>)}
          {controller.skillInstaller.artifacts.length === 0 && <p>暂无可用版本</p>}
        </div>}
      </section>
    </div>}
  </div>;
}

function StoreEntryCard({
  entry,
  onInstallProduct,
  onOpenSkill,
  onUninstallProduct,
  pending,
}: {
  entry: AiStoreEntry;
  onInstallProduct(): void;
  onOpenSkill(): void;
  onUninstallProduct(): void;
  pending: boolean;
}) {
  const Icon = entry.kind === "product" ? Boxes : entry.kind === "skill" ? Wrench : PlugZap;
  return <article>
    <header>
      <span className={`is-${entry.kind}`}>
        {entry.iconUrl ? <img alt="" src={entry.iconUrl} /> : <Icon size={20} />}
      </span>
      <small>{kindLabel(entry.kind)}</small>
    </header>
    <h3>{entry.name}</h3>
    <p>{entry.description || "暂无描述"}</p>
    <div className="news-store-entry-meta">
      {entry.rating && <span><Star fill="currentColor" size={12} />{entry.rating}</span>}
      {entry.installCount && <span><Download size={12} />{entry.installCount}</span>}
      {entry.pricing && <span>{entry.pricing}</span>}
      {entry.transport && <span>{entry.transport}</span>}
      {entry.healthStatus && <span>{entry.healthStatus}</span>}
    </div>
    <footer><StoreEntryAction
      action={entry.action}
      name={entry.name}
      onInstallProduct={onInstallProduct}
      onOpenSkill={onOpenSkill}
      onUninstallProduct={onUninstallProduct}
      pending={pending}
    /></footer>
  </article>;
}

function StoreEntryAction({
  action,
  name,
  onInstallProduct,
  onOpenSkill,
  onUninstallProduct,
  pending,
}: {
  action: AiStoreEntry["action"];
  name: string;
  onInstallProduct(): void;
  onOpenSkill(): void;
  onUninstallProduct(): void;
  pending: boolean;
}) {
  if (action === "view-only") {
    return <span className="news-store-read-only"><PlugZap size={13} />目录可用</span>;
  }
  if (action === "installed-skill") {
    return <button className="is-installed" disabled type="button">
      <CheckCircle2 size={14} />已安装
    </button>;
  }
  if (action === "select-skill-artifact") {
    return <button aria-label={`选择 ${name} 版本`} onClick={onOpenSkill} type="button">
      <PackageCheck size={14} />选择版本
    </button>;
  }
  const installed = action === "uninstall-product";
  return <button
    aria-label={`${installed ? "卸载" : "安装"} ${name}`}
    className={installed ? "is-installed" : ""}
    disabled={pending}
    onClick={installed ? onUninstallProduct : onInstallProduct}
    type="button"
  >{pending
    ? <LoaderCircle className="is-spinning" size={14} />
    : installed ? <><CheckCircle2 size={14} />卸载</> : "安装"}</button>;
}

function StoreState({
  onRetry,
  status,
}: {
  onRetry(): void;
  status: ReturnType<typeof useAiStoreController>["status"];
}) {
  if (status === "ready") {
    return null;
  }
  if (status === "loading") {
    return <section className="news-store-state"><LoaderCircle className="is-spinning" size={22} /><h2>正在加载目录</h2></section>;
  }
  if (status === "unavailable") {
    return <section className="news-store-state" role="status"><PlugZap size={22} /><h2>AI Store 服务未连接</h2><p>完成登录并连接服务后即可浏览目录。</p></section>;
  }
  if (status === "error") {
    return <section className="news-store-state" role="alert"><h2>AI Store 暂不可用</h2><button onClick={onRetry} type="button"><RefreshCw size={14} />重试</button></section>;
  }
  return <section className="news-store-state" role="status"><Search size={22} /><h2>暂无匹配条目</h2></section>;
}

const DEMO_ENTRIES = [
  { id: "deep-research", type: "product", name: "Deep Research", description: "跨来源深度研究、证据核验与结构化报告。" },
  { id: "financial-reader", type: "skill", name: "Financial Reader", description: "阅读财报、公告与电话会，提取指标变化和风险。" },
  { id: "notion-mcp", type: "mcp", name: "Notion MCP", description: "连接团队知识库中的授权页面。" },
] as const;

function NewsPcAiStoreDemo() {
  const [tab, setTab] = useState<AiStoreKind>("product");
  const [installed, setInstalled] = useState<ReadonlySet<string>>(() => new Set());
  return <div className="news-ai-store is-demo">
    <header><div><h1>AI Store</h1><p>产品、Skills 与 MCP 连接器</p></div></header>
    <nav>{STORE_TABS.map(({ id, label, icon: Icon }) => <button className={id === tab ? "is-active" : ""} onClick={() => setTab(id)} key={id} type="button"><Icon size={16} />{label}</button>)}</nav>
    <main><div className="news-store-heading"><div><h2>{STORE_TABS.find((item) => item.id === tab)?.label}</h2><p>演示目录</p></div></div><section className="news-store-grid">{DEMO_ENTRIES.filter((entry) => entry.type === tab).map((entry) => <article key={entry.id}><header><span className={`is-${entry.type}`}><Boxes size={20} /></span><small>{kindLabel(entry.type)}</small></header><h3>{entry.name}</h3><p>{entry.description}</p><footer>{entry.type === "mcp" ? <span className="news-store-read-only">目录可用</span> : <button aria-label={`${installed.has(entry.id) ? "卸载" : "安装"} ${entry.name}`} className={installed.has(entry.id) ? "is-installed" : ""} onClick={() => setInstalled((current) => toggleDemoEntry(current, entry.id))} type="button">{installed.has(entry.id) ? "卸载" : "安装"}</button>}</footer></article>)}</section></main>
  </div>;
}

function toggleDemoEntry(current: ReadonlySet<string>, id: string) {
  const next = new Set(current);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}

function kindLabel(kind: AiStoreKind) {
  return kind === "product" ? "AI 产品" : kind === "skill" ? "Skill" : "MCP";
}

export default NewsPcAiStore;
