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
  { id: "mcp", label: "MCP", icon: PlugZap },
];

export interface NewsH5AiStoreProps {
  demoMode?: boolean;
  service?: AiStoreService;
}

export function NewsH5AiStore({
  demoMode = false,
  service,
}: NewsH5AiStoreProps) {
  const controller = useAiStoreController(service);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  if (demoMode) {
    return <NewsH5AiStoreDemo />;
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controller.search(searchText);
    setSearchOpen(false);
  };

  return <div className="news-h5-store">
    <header>
      <div><h1>AI Store</h1><p>扩展助手的阅读与行动能力</p></div>
      <button aria-label={searchOpen ? "关闭搜索" : "搜索 AI Store"} onClick={() => setSearchOpen((current) => !current)} type="button">
        {searchOpen ? <X size={20} /> : <Search size={20} />}
      </button>
    </header>
    {searchOpen && <form onSubmit={submitSearch} role="search">
      <Search size={16} />
      <input aria-label="搜索 AI Store" autoFocus onChange={(event) => setSearchText(event.target.value)} placeholder="搜索产品、Skill 或 MCP" value={searchText} />
      <button type="submit">搜索</button>
    </form>}
    <nav aria-label="AI Store 分类">
      {STORE_TABS.map(({ id, label, icon: Icon }) => <button className={id === controller.selectedKind ? "is-active" : ""} onClick={() => controller.selectKind(id)} type="button" key={id}><Icon size={16} />{label}</button>)}
    </nav>
    <main>
      <div className="news-h5-store__heading"><h2>{STORE_TABS.find((item) => item.id === controller.selectedKind)?.label}</h2>{controller.entries.length > 0 && <span>{controller.entries.length} 项</span>}</div>
      <StoreState onRetry={controller.retry} status={controller.status} />
      {controller.status === "ready" && <section>{controller.entries.map((entry) => <StoreEntry
        entry={entry}
        key={entry.id}
        onInstallProduct={() => void controller.installProduct(entry)}
        onOpenSkill={() => void controller.openSkillInstaller(entry)}
        onUninstallProduct={() => void controller.uninstallProduct(entry)}
        pending={controller.pendingEntryIds.has(entry.id)}
      />)}</section>}
      {controller.mutationError && <p className="news-h5-store__error" role="alert">{controller.mutationError}</p>}
      {controller.status === "ready" && controller.canLoadMore && <button className="news-h5-store__load-more" disabled={controller.loadingMore} onClick={() => void controller.loadMore()} type="button">{controller.loadingMore && <LoaderCircle className="is-spinning" size={14} />}{controller.loadingMore ? "正在加载" : "加载更多"}</button>}
    </main>

    {controller.skillInstaller.status !== "closed" && <div className="news-h5-store__sheet-backdrop">
      <section aria-modal="true" className="news-h5-store__sheet" role="dialog">
        <header><div><h2>选择 Skill 版本</h2><p>{controller.skillInstaller.entry?.name}</p></div><button aria-label="关闭版本选择" onClick={controller.closeSkillInstaller} type="button"><X size={18} /></button></header>
        {controller.skillInstaller.status === "loading" && <div className="news-h5-store__sheet-state"><LoaderCircle className="is-spinning" size={20} />正在读取版本</div>}
        {controller.skillInstaller.status === "error" && <div className="news-h5-store__sheet-state">版本列表暂不可用</div>}
        {(controller.skillInstaller.status === "ready" || controller.skillInstaller.status === "installing") && <div className="news-h5-store__artifacts">{controller.skillInstaller.artifacts.map((artifact) => <button disabled={artifact.status !== "published" || controller.skillInstaller.status === "installing"} key={artifact.id} onClick={() => void controller.installSkill(artifact.id)} type="button"><span><strong>{artifact.version}</strong><small>{artifact.invocationKind}</small></span><b>{artifact.status === "published" ? "安装" : artifact.status}</b></button>)}{controller.skillInstaller.artifacts.length === 0 && <p>暂无可用版本</p>}</div>}
      </section>
    </div>}
  </div>;
}

function StoreEntry({
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
    <span className={`is-${entry.kind}`}>{entry.iconUrl ? <img alt="" src={entry.iconUrl} /> : <Icon size={19} />}</span>
    <div><h2>{entry.name}</h2><small>{kindLabel(entry.kind)}</small><p>{entry.description || "暂无描述"}</p><footer>{entry.installCount && <span><Download size={11} />{entry.installCount}</span>}{entry.pricing && <span>{entry.pricing}</span>}{entry.transport && <span>{entry.transport}</span>}{entry.healthStatus && <span>{entry.healthStatus}</span>}</footer></div>
    <EntryAction entry={entry} onInstallProduct={onInstallProduct} onOpenSkill={onOpenSkill} onUninstallProduct={onUninstallProduct} pending={pending} />
  </article>;
}

function EntryAction({
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
  if (entry.action === "view-only") {
    return <span className="news-h5-store__readonly">目录</span>;
  }
  if (entry.action === "installed-skill") {
    return <button className="is-installed" disabled type="button"><CheckCircle2 size={13} />已安装</button>;
  }
  if (entry.action === "select-skill-artifact") {
    return <button aria-label={`选择 ${entry.name} 版本`} onClick={onOpenSkill} type="button"><PackageCheck size={13} />版本</button>;
  }
  const installed = entry.action === "uninstall-product";
  return <button aria-label={`${installed ? "卸载" : "安装"} ${entry.name}`} className={installed ? "is-installed" : ""} disabled={pending} onClick={installed ? onUninstallProduct : onInstallProduct} type="button">{pending ? <LoaderCircle className="is-spinning" size={13} /> : installed ? "卸载" : "安装"}</button>;
}

function StoreState({
  onRetry,
  status,
}: {
  onRetry(): void;
  status: ReturnType<typeof useAiStoreController>["status"];
}) {
  if (status === "ready") return null;
  if (status === "loading") return <section className="news-h5-store__state"><LoaderCircle className="is-spinning" size={21} /><h2>正在加载目录</h2></section>;
  if (status === "unavailable") return <section className="news-h5-store__state" role="status"><PlugZap size={21} /><h2>AI Store 服务未连接</h2></section>;
  if (status === "error") return <section className="news-h5-store__state" role="alert"><h2>AI Store 暂不可用</h2><button onClick={onRetry} type="button"><RefreshCw size={13} />重试</button></section>;
  return <section className="news-h5-store__state" role="status"><Search size={21} /><h2>暂无匹配条目</h2></section>;
}

const DEMO_ENTRIES = [
  { id: "deep-research", type: "product", name: "Deep Research", description: "跨来源深度研究与证据报告" },
  { id: "financial-reader", type: "skill", name: "Financial Reader", description: "阅读财报、公告与电话会" },
  { id: "notion-mcp", type: "mcp", name: "Notion MCP", description: "连接团队知识库中的授权页面" },
] as const;

function NewsH5AiStoreDemo() {
  const [tab, setTab] = useState<AiStoreKind>("product");
  const [installed, setInstalled] = useState<ReadonlySet<string>>(() => new Set());
  return <div className="news-h5-store is-demo"><header><div><h1>AI Store</h1><p>扩展助手的阅读与行动能力</p></div></header><nav>{STORE_TABS.map(({ id, label, icon: Icon }) => <button className={id === tab ? "is-active" : ""} onClick={() => setTab(id)} type="button" key={id}><Icon size={16} />{label}</button>)}</nav><main><div className="news-h5-store__heading"><h2>演示目录</h2></div><section>{DEMO_ENTRIES.filter((entry) => entry.type === tab).map((entry) => <article key={entry.id}><span className={`is-${entry.type}`}><Boxes size={19} /></span><div><h2>{entry.name}</h2><small>{kindLabel(entry.type)}</small><p>{entry.description}</p></div>{entry.type === "mcp" ? <span className="news-h5-store__readonly">目录</span> : <button aria-label={`${installed.has(entry.id) ? "卸载" : "安装"} ${entry.name}`} className={installed.has(entry.id) ? "is-installed" : ""} onClick={() => setInstalled((current) => toggleDemoEntry(current, entry.id))} type="button">{installed.has(entry.id) ? "卸载" : "安装"}</button>}</article>)}</section></main></div>;
}

function toggleDemoEntry(current: ReadonlySet<string>, id: string) {
  const next = new Set(current);
  if (next.has(id)) next.delete(id); else next.add(id);
  return next;
}

function kindLabel(kind: AiStoreKind) {
  return kind === "product" ? "AI 产品" : kind === "skill" ? "Skill" : "MCP";
}

export default NewsH5AiStore;
