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
  onSecondaryPageChange?: (value: boolean) => void;
  service?: AiStoreService;
}

export function NewsH5AiStore({
  demoMode = false,
  onSecondaryPageChange,
  service,
}: NewsH5AiStoreProps) {
  const controller = useAiStoreController(service);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState<string>();

  if (demoMode) {
    return <NewsH5AiStoreDemo onSecondaryPageChange={onSecondaryPageChange} />;
  }

  const selectedEntry = controller.entries.find((entry) => entry.id === selectedEntryId);
  if (selectedEntry) {
    return <>
      <StoreDetail
        entry={selectedEntry}
        onBack={() => {
          setSelectedEntryId(undefined);
          onSecondaryPageChange?.(false);
        }}
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
        onOpen={() => {
          setSelectedEntryId(entry.id);
          onSecondaryPageChange?.(true);
        }}
        onUninstallProduct={() => void controller.uninstallProduct(entry)}
        pending={controller.pendingEntryIds.has(entry.id)}
      />)}</section>}
      {controller.mutationError && <p className="news-h5-store__error" role="alert">{controller.mutationError}</p>}
      {controller.status === "ready" && controller.canLoadMore && <button className="news-h5-store__load-more" disabled={controller.loadingMore} onClick={() => void controller.loadMore()} type="button">{controller.loadingMore && <LoaderCircle className="is-spinning" size={14} />}{controller.loadingMore ? "正在加载" : "加载更多"}</button>}
    </main>

    <SkillInstaller controller={controller} />
  </div>;
}

function StoreEntry({
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
    <button aria-label={`查看 ${entry.name}`} className="news-h5-store__entry-main" onClick={onOpen} type="button">
      <span className={`is-${entry.kind}`}>{entry.iconUrl ? <img alt="" src={entry.iconUrl} /> : <Icon size={19} />}</span>
      <span><strong>{entry.name}</strong><small>{kindLabel(entry.kind)}</small><p>{entry.description || "暂无描述"}</p><footer>{entry.installCount && <span><Download size={11} />{entry.installCount}</span>}{entry.pricing && <span>{entry.pricing}</span>}{entry.transport && <span>{entry.transport}</span>}{entry.healthStatus && <span>{entry.healthStatus}</span>}</footer></span>
    </button>
    <EntryAction entry={entry} onInstallProduct={onInstallProduct} onOpenSkill={onOpenSkill} onUninstallProduct={onUninstallProduct} pending={pending} />
  </article>;
}

function StoreDetail({
  entry,
  onBack,
  onInstallProduct,
  onOpenSkill,
  onUninstallProduct,
  pending,
}: {
  entry: AiStoreEntry;
  onBack(): void;
  onInstallProduct(): void;
  onOpenSkill(): void;
  onUninstallProduct(): void;
  pending: boolean;
}) {
  const Icon = entry.kind === "product" ? Boxes : entry.kind === "skill" ? Wrench : PlugZap;
  return <div className="news-h5-store-detail">
    <header><button aria-label="返回 AI Store" onClick={onBack} type="button"><ArrowLeft size={20} /></button><strong>条目详情</strong><span /></header>
    <main>
      <section className="news-h5-store-detail__hero">
        <span className={`is-${entry.kind}`}>{entry.iconUrl ? <img alt="" src={entry.iconUrl} /> : <Icon size={25} />}</span>
        <div><small>{kindLabel(entry.kind)}</small><h1>{entry.name}</h1><p>{entry.description || "暂无描述"}</p></div>
      </section>
      <dl>
        {entry.pricing && <div><dt>定价</dt><dd>{entry.pricing}</dd></div>}
        {entry.rating && <div><dt>评分</dt><dd>{entry.rating}</dd></div>}
        {entry.installCount && <div><dt>安装量</dt><dd>{entry.installCount}</dd></div>}
        {entry.transport && <div><dt>连接协议</dt><dd>{entry.transport}</dd></div>}
        {entry.healthStatus && <div><dt>健康状态</dt><dd>{entry.healthStatus}</dd></div>}
      </dl>
      {entry.tags.length > 0 && <div className="news-h5-store-detail__tags">{entry.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
      <div className="news-h5-store-detail__action">
        <EntryAction entry={entry} onInstallProduct={onInstallProduct} onOpenSkill={onOpenSkill} onUninstallProduct={onUninstallProduct} pending={pending} />
      </div>
    </main>
  </div>;
}

function SkillInstaller({
  controller,
}: {
  controller: ReturnType<typeof useAiStoreController>;
}) {
  if (controller.skillInstaller.status === "closed") {
    return null;
  }
  return <div className="news-h5-store__sheet-backdrop">
    <section aria-modal="true" className="news-h5-store__sheet" role="dialog">
      <header><div><h2>选择 Skill 版本</h2><p>{controller.skillInstaller.entry?.name}</p></div><button aria-label="关闭版本选择" onClick={controller.closeSkillInstaller} type="button"><X size={18} /></button></header>
      {controller.skillInstaller.status === "loading" && <div className="news-h5-store__sheet-state"><LoaderCircle className="is-spinning" size={20} />正在读取版本</div>}
      {controller.skillInstaller.status === "error" && <div className="news-h5-store__sheet-state">版本列表暂不可用</div>}
      {(controller.skillInstaller.status === "ready" || controller.skillInstaller.status === "installing") && <div className="news-h5-store__artifacts">{controller.skillInstaller.artifacts.map((artifact) => <button disabled={artifact.status !== "published" || controller.skillInstaller.status === "installing"} key={artifact.id} onClick={() => void controller.installSkill(artifact.id)} type="button"><span><strong>{artifact.version}</strong><small>{artifact.invocationKind}</small></span><b>{artifact.status === "published" ? "安装" : artifact.status}</b></button>)}{controller.skillInstaller.artifacts.length === 0 && <p>暂无可用版本</p>}</div>}
    </section>
  </div>;
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
  { id: "deep-research", type: "product", name: "Deep Research", description: "跨来源深度研究与证据报告", installCount: "12.4k", pricing: "免费试用", rating: "4.9", tags: ["深度研究", "证据链", "定时任务"] },
  { id: "financial-reader", type: "skill", name: "Financial Reader", description: "阅读财报、公告与电话会", installCount: "8.6k", pricing: "免费", rating: "4.8", tags: ["财报", "公告", "指标提取"] },
  { id: "notion-mcp", type: "mcp", name: "Notion MCP", description: "连接团队知识库中的授权页面", healthStatus: "运行正常", tags: ["知识库", "团队协作"], transport: "Streamable HTTP" },
];

const DEMO_SKILL_VERSIONS = [
  { id: "financial-reader-1.4.0", invocationKind: "API 调用", version: "1.4.0" },
  { id: "financial-reader-1.3.2", invocationKind: "API 调用", version: "1.3.2" },
] as const;

function NewsH5AiStoreDemo({ onSecondaryPageChange }: Pick<NewsH5AiStoreProps, "onSecondaryPageChange">) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
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
  const openSkillInstaller = (id: string) => setSkillInstallerId(id);
  const installSkill = (id: string) => {
    setInstalled((current) => new Set(current).add(id));
    setSkillInstallerId(undefined);
  };
  if (selected) {
    const entry = toDemoStoreEntry(selected, installed.has(selected.id));
    return <>
      <StoreDetail entry={entry} onBack={() => { setSelectedId(undefined); onSecondaryPageChange?.(false); }} onInstallProduct={() => toggle(selected.id)} onOpenSkill={() => openSkillInstaller(selected.id)} onUninstallProduct={() => toggle(selected.id)} pending={false} />
      <DemoSkillInstaller onClose={() => setSkillInstallerId(undefined)} onInstall={() => installSkill(selected.id)} open={skillInstallerId === selected.id} />
    </>;
  }
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(searchText.trim());
    setSearchOpen(false);
  };
  return <>
    <div className="news-h5-store is-demo"><header><div><h1>AI Store</h1><p>扩展助手的阅读与行动能力</p></div><button aria-label={searchOpen ? "关闭搜索" : "搜索 AI Store"} onClick={() => setSearchOpen((current) => !current)} type="button">{searchOpen ? <X size={20} /> : <Search size={20} />}</button></header>{searchOpen && <form onSubmit={submitSearch} role="search"><Search size={16} /><input aria-label="搜索 AI Store" autoFocus onChange={(event) => setSearchText(event.target.value)} placeholder="搜索产品、Skill 或 MCP" value={searchText} /><button type="submit">搜索</button></form>}<nav aria-label="AI Store 分类">{STORE_TABS.map(({ id, label, icon: Icon }) => <button className={id === tab ? "is-active" : ""} onClick={() => setTab(id)} type="button" key={id}><Icon size={16} />{label}</button>)}</nav><main><div className="news-h5-store__heading"><h2>{query ? `“${query}”的结果` : "演示目录"}</h2>{visibleEntries.length > 0 && <span>{visibleEntries.length} 项</span>}</div>{visibleEntries.length > 0 ? <section>{visibleEntries.map((entry) => <StoreEntry entry={toDemoStoreEntry(entry, installed.has(entry.id))} key={entry.id} onInstallProduct={() => toggle(entry.id)} onOpen={() => { setSelectedId(entry.id); onSecondaryPageChange?.(true); }} onOpenSkill={() => openSkillInstaller(entry.id)} onUninstallProduct={() => toggle(entry.id)} pending={false} />)}</section> : <section className="news-h5-store__state" role="status"><Search size={21} /><h2>暂无匹配条目</h2></section>}</main></div>
    <DemoSkillInstaller onClose={() => setSkillInstallerId(undefined)} onInstall={() => skillInstallerId && installSkill(skillInstallerId)} open={Boolean(skillInstallerId)} />
  </>;
}

function DemoSkillInstaller({ onClose, onInstall, open }: { onClose(): void; onInstall(): void; open: boolean }) {
  if (!open) return null;
  return <div className="news-h5-store__sheet-backdrop"><section aria-modal="true" className="news-h5-store__sheet" role="dialog"><header><div><h2>选择 Skill 版本</h2><p>Financial Reader</p></div><button aria-label="关闭版本选择" onClick={onClose} type="button"><X size={18} /></button></header><div className="news-h5-store__artifacts">{DEMO_SKILL_VERSIONS.map((artifact) => <button aria-label={`安装 ${artifact.version}`} key={artifact.id} onClick={onInstall} type="button"><span><strong>{artifact.version}</strong><small>{artifact.invocationKind}</small></span><b>安装</b></button>)}</div></section></div>;
}

function toDemoStoreEntry(entry: DemoStoreEntry, installed: boolean): AiStoreEntry {
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
  if (next.has(id)) next.delete(id); else next.add(id);
  return next;
}

function kindLabel(kind: AiStoreKind) {
  return kind === "product" ? "AI 产品" : kind === "skill" ? "Skill" : "MCP";
}

export default NewsH5AiStore;
