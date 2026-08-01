import { type FormEvent, useState } from "react";
import {
  ArrowLeft,
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
  const [selectedEntryId, setSelectedEntryId] = useState<string>();

  if (demoMode) {
    return <NewsPcAiStoreDemo />;
  }

  const selectedEntry = controller.entries.find((entry) => entry.id === selectedEntryId);
  if (selectedEntry) {
    return <>
      <StoreDetail
        entry={selectedEntry}
        onBack={() => setSelectedEntryId(undefined)}
        onInstallProduct={() => void controller.installProduct(selectedEntry)}
        onOpenSkill={() => void controller.openSkillInstaller(selectedEntry)}
        onUninstallProduct={() => void controller.uninstallProduct(selectedEntry)}
        pending={controller.pendingEntryIds.has(selectedEntry.id)}
      />
      <SkillInstaller controller={controller} />
    </>;
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
          onOpen={() => setSelectedEntryId(entry.id)}
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

    <SkillInstaller controller={controller} />
  </div>;
}

function StoreEntryCard({
  entry,
  onInstallProduct,
  onOpen,
  onOpenSkill,
  onUninstallProduct,
  pending,
}: {
  entry: AiStoreEntry;
  onInstallProduct(): void;
  onOpen(): void;
  onOpenSkill(): void;
  onUninstallProduct(): void;
  pending: boolean;
}) {
  const Icon = entry.kind === "product" ? Boxes : entry.kind === "skill" ? Wrench : PlugZap;
  return <article>
    <button aria-label={`查看 ${entry.name}`} className="news-store-entry-open" onClick={onOpen} type="button">
      <header><span className={`is-${entry.kind}`}>{entry.iconUrl ? <img alt="" src={entry.iconUrl} /> : <Icon size={20} />}</span><small>{kindLabel(entry.kind)}</small></header>
      <h3>{entry.name}</h3><p>{entry.description || "暂无描述"}</p>
      <div className="news-store-entry-meta">{entry.rating && <span><Star fill="currentColor" size={12} />{entry.rating}</span>}{entry.installCount && <span><Download size={12} />{entry.installCount}</span>}{entry.pricing && <span>{entry.pricing}</span>}{entry.transport && <span>{entry.transport}</span>}{entry.healthStatus && <span>{entry.healthStatus}</span>}</div>
    </button>
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

function StoreDetail({ entry, onBack, onInstallProduct, onOpenSkill, onUninstallProduct, pending }: { entry: AiStoreEntry; onBack(): void; onInstallProduct(): void; onOpenSkill(): void; onUninstallProduct(): void; pending: boolean }) {
  const Icon = entry.kind === "product" ? Boxes : entry.kind === "skill" ? Wrench : PlugZap;
  return <div className="news-pc-store-detail">
    <header><button aria-label="返回 AI Store" onClick={onBack} type="button"><ArrowLeft size={18} />返回目录</button><strong>条目详情</strong><span /></header>
    <main>
      <section className="news-pc-store-detail__hero"><span className={`is-${entry.kind}`}>{entry.iconUrl ? <img alt="" src={entry.iconUrl} /> : <Icon size={28} />}</span><div><small>{kindLabel(entry.kind)}</small><h1>{entry.name}</h1><p>{entry.description || "暂无描述"}</p></div></section>
      <section className="news-pc-store-detail__content">
        <div><h2>目录信息</h2><dl>{entry.pricing && <div><dt>定价</dt><dd>{entry.pricing}</dd></div>}{entry.rating && <div><dt>评分</dt><dd>{entry.rating}</dd></div>}{entry.installCount && <div><dt>安装量</dt><dd>{entry.installCount}</dd></div>}{entry.transport && <div><dt>连接协议</dt><dd>{entry.transport}</dd></div>}{entry.healthStatus && <div><dt>健康状态</dt><dd>{entry.healthStatus}</dd></div>}</dl>{entry.tags.length > 0 && <div className="news-pc-store-detail__tags">{entry.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}</div>
        <aside><h2>当前状态</h2><StoreEntryAction action={entry.action} name={entry.name} onInstallProduct={onInstallProduct} onOpenSkill={onOpenSkill} onUninstallProduct={onUninstallProduct} pending={pending} /></aside>
      </section>
    </main>
  </div>;
}

function SkillInstaller({ controller }: { controller: ReturnType<typeof useAiStoreController> }) {
  if (controller.skillInstaller.status === "closed") return null;
  return <div className="news-store-dialog-backdrop"><section aria-modal="true" className="news-store-dialog" role="dialog"><header><div><h2>选择 Skill 版本</h2><p>{controller.skillInstaller.entry?.name}</p></div><button aria-label="关闭版本选择" onClick={controller.closeSkillInstaller} type="button"><X size={18} /></button></header>{controller.skillInstaller.status === "loading" && <div className="news-store-dialog__state"><LoaderCircle className="is-spinning" size={20} /><span>正在读取版本</span></div>}{controller.skillInstaller.status === "error" && <div className="news-store-dialog__state"><span>版本列表暂不可用</span></div>}{(controller.skillInstaller.status === "ready" || controller.skillInstaller.status === "installing") && <div className="news-store-artifacts">{controller.skillInstaller.artifacts.map((artifact) => <button disabled={artifact.status !== "published" || controller.skillInstaller.status === "installing"} key={artifact.id} onClick={() => void controller.installSkill(artifact.id)} type="button"><span><strong>{artifact.version}</strong><small>{artifact.invocationKind}</small></span><b>{artifact.status === "published" ? "安装" : artifact.status}</b></button>)}{controller.skillInstaller.artifacts.length === 0 && <p>暂无可用版本</p>}</div>}</section></div>;
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

type DemoStoreEntry = {
  readonly description: string;
  readonly healthStatus?: string;
  readonly id: string;
  readonly installCount?: string;
  readonly name: string;
  readonly pricing?: string;
  readonly rating?: string;
  readonly tags: readonly string[];
  readonly transport?: string;
  readonly type: AiStoreKind;
};

const DEMO_ENTRIES: readonly DemoStoreEntry[] = [
  { id: "deep-research", type: "product", name: "Deep Research", description: "跨来源深度研究、证据核验与结构化报告。", installCount: "12.4k", pricing: "免费试用", rating: "4.9", tags: ["深度研究", "证据链", "定时任务"] },
  { id: "financial-reader", type: "skill", name: "Financial Reader", description: "阅读财报、公告与电话会，提取指标变化和风险。", installCount: "8.6k", pricing: "免费", rating: "4.8", tags: ["财报", "公告", "指标提取"] },
  { id: "notion-mcp", type: "mcp", name: "Notion MCP", description: "连接团队知识库中的授权页面。", healthStatus: "运行正常", tags: ["知识库", "团队协作"], transport: "Streamable HTTP" },
];

const DEMO_SKILL_VERSIONS = [
  { id: "financial-reader-1.4.0", invocationKind: "API 调用", version: "1.4.0" },
  { id: "financial-reader-1.3.2", invocationKind: "API 调用", version: "1.3.2" },
] as const;

function NewsPcAiStoreDemo() {
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [tab, setTab] = useState<AiStoreKind>("product");
  const [installed, setInstalled] = useState<ReadonlySet<string>>(() => new Set());
  const [selectedId, setSelectedId] = useState<string>();
  const [skillInstallerId, setSkillInstallerId] = useState<string>();
  const selected = DEMO_ENTRIES.find((entry) => entry.id === selectedId);
  const normalizedQuery = query.toLocaleLowerCase("zh-CN");
  const visibleEntries = DEMO_ENTRIES.filter((entry) => entry.type === tab && (!normalizedQuery || [
    entry.description,
    entry.name,
    ...entry.tags,
  ].some((value) => value.toLocaleLowerCase("zh-CN").includes(normalizedQuery))));
  const toggle = (id: string) => setInstalled((current) => toggleDemoEntry(current, id));
  const installSkill = (id: string) => {
    setInstalled((current) => new Set(current).add(id));
    setSkillInstallerId(undefined);
  };
  if (selected) {
    const entry = toDemoStoreEntry(selected, installed.has(selected.id));
    return <>
      <StoreDetail entry={entry} onBack={() => setSelectedId(undefined)} onInstallProduct={() => toggle(selected.id)} onOpenSkill={() => setSkillInstallerId(selected.id)} onUninstallProduct={() => toggle(selected.id)} pending={false} />
      <DemoSkillInstaller onClose={() => setSkillInstallerId(undefined)} onInstall={() => installSkill(selected.id)} open={skillInstallerId === selected.id} />
    </>;
  }
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(searchText.trim());
  };
  return <div className="news-ai-store is-demo">
    <header><div><h1>AI Store</h1><p>产品、Skills 与 MCP 连接器</p></div><form onSubmit={submitSearch} role="search"><Search aria-hidden="true" size={17} /><input aria-label="搜索 AI Store" onChange={(event) => setSearchText(event.target.value)} placeholder="搜索产品、能力或连接器" value={searchText} /><button aria-label="提交搜索" type="submit"><Search size={15} /></button></form></header>
    <nav aria-label="AI Store 分类">{STORE_TABS.map(({ id, label, icon: Icon }) => <button className={id === tab ? "is-active" : ""} onClick={() => setTab(id)} key={id} type="button"><Icon size={16} />{label}</button>)}</nav>
    <main><div className="news-store-heading"><div><h2>{STORE_TABS.find((item) => item.id === tab)?.label}</h2><p>{query ? `“${query}”的搜索结果` : "演示目录"}</p></div>{visibleEntries.length > 0 && <span>{visibleEntries.length} 项</span>}</div>{visibleEntries.length > 0 ? <section className="news-store-grid">{visibleEntries.map((entry) => <StoreEntryCard entry={toDemoStoreEntry(entry, installed.has(entry.id))} key={entry.id} onInstallProduct={() => toggle(entry.id)} onOpen={() => setSelectedId(entry.id)} onOpenSkill={() => setSkillInstallerId(entry.id)} onUninstallProduct={() => toggle(entry.id)} pending={false} />)}</section> : <section className="news-store-state" role="status"><Search size={22} /><h2>暂无匹配条目</h2></section>}</main>
    <DemoSkillInstaller onClose={() => setSkillInstallerId(undefined)} onInstall={() => skillInstallerId && installSkill(skillInstallerId)} open={Boolean(skillInstallerId)} />
  </div>;
}

function DemoSkillInstaller({ onClose, onInstall, open }: { onClose(): void; onInstall(): void; open: boolean }) {
  if (!open) return null;
  return <div className="news-store-dialog-backdrop"><section aria-modal="true" className="news-store-dialog" role="dialog"><header><div><h2>选择 Skill 版本</h2><p>Financial Reader</p></div><button aria-label="关闭版本选择" onClick={onClose} type="button"><X size={18} /></button></header><div className="news-store-artifacts">{DEMO_SKILL_VERSIONS.map((artifact) => <button aria-label={`安装 ${artifact.version}`} key={artifact.id} onClick={onInstall} type="button"><span><strong>{artifact.version}</strong><small>{artifact.invocationKind}</small></span><b>安装</b></button>)}</div></section></div>;
}

function toDemoStoreEntry(
  entry: DemoStoreEntry,
  installed: boolean,
): AiStoreEntry {
  return {
    action: entry.type === "mcp" ? "view-only" : entry.type === "skill" ? installed ? "installed-skill" : "select-skill-artifact" : installed ? "uninstall-product" : "install-product",
    description: entry.description,
    healthStatus: entry.healthStatus,
    id: entry.id,
    installCount: entry.installCount,
    kind: entry.type,
    name: entry.name,
    pricing: entry.pricing,
    rating: entry.rating,
    tags: entry.tags,
    transport: entry.transport,
  };
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
