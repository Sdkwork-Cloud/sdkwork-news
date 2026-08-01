import { type FormEvent, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Clock3,
  Flame,
  LoaderCircle,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useNewsFeedController } from "@sdkwork/news-feed-react";
import type {
  NewsFeedItem,
  NewsFeedService,
} from "@sdkwork/news-feed-service";
import aiChipsImage from "../../../../sdkwork-news-common/assets/news/ai-chips.jpg";
import logisticsImage from "../../../../sdkwork-news-common/assets/news/logistics.jpg";
import marketsImage from "../../../../sdkwork-news-common/assets/news/markets.jpg";
import newsroomImage from "../../../../sdkwork-news-common/assets/news/newsroom.jpg";
import workspaceImage from "../../../../sdkwork-news-common/assets/news/workspace.jpg";
import "./styles.css";

export interface NewsH5NewsProps {
  demoMode?: boolean;
  onSecondaryPageChange?: (value: boolean) => void;
  service?: NewsFeedService;
}

export function NewsH5News({
  demoMode = false,
  onSecondaryPageChange,
  service,
}: NewsH5NewsProps) {
  const controller = useNewsFeedController(service);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState<NewsFeedItem | null>(null);

  if (demoMode) {
    return <NewsH5NewsDemo onSecondaryPageChange={onSecondaryPageChange} />;
  }

  if (selectedItem) {
    return <NewsH5Detail
      favorite={controller.favoriteItemIds.has(selectedItem.id)}
      item={toNewsDetailModel(selectedItem)}
      onBack={() => {
        setSelectedItem(null);
        onSecondaryPageChange?.(false);
      }}
      onToggleFavorite={() => void controller.toggleFavorite(selectedItem.id)}
    />;
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controller.search(searchText);
    setSearchOpen(false);
  };

  return <div className="news-h5-feed">
    <header>
      <h1>新闻</h1>
      <button
        aria-label={searchOpen ? "关闭搜索" : "搜索新闻"}
        onClick={() => setSearchOpen((current) => !current)}
        type="button"
      >{searchOpen ? <X size={20} /> : <Search size={20} />}</button>
    </header>
    {searchOpen && <form className="news-h5-search" onSubmit={submitSearch} role="search">
      <Search aria-hidden="true" size={17} />
      <input
        aria-label="搜索新闻"
        autoFocus
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="搜索新闻、主题或来源"
        value={searchText}
      />
      <button type="submit">搜索</button>
    </form>}
    <nav aria-label="新闻分类">
      <button
        className={!controller.activeChannelId && !controller.query ? "is-active" : ""}
        onClick={() => controller.selectChannel()}
        type="button"
      >推荐</button>
      {controller.channels.map((channel) => <button
        className={controller.activeChannelId === channel.id ? "is-active" : ""}
        key={channel.id}
        onClick={() => controller.selectChannel(channel.id)}
        type="button"
      >{channel.title}</button>)}
    </nav>
    <main>
      {controller.trendingItems[0] && <section className="news-h5-trending">
        <Flame size={14} />
        <strong>热榜</strong>
        <span>{controller.trendingItems[0].title}</span>
      </section>}
      <div className="news-h5-feed__label">
        <h2>{controller.query ? `“${controller.query}”的结果` : "最新动态"}</h2>
        {controller.items.length > 0 && <span>{controller.items.length} 条</span>}
      </div>

      <NewsH5FeedState onRetry={controller.retry} status={controller.status} />

      {controller.status === "ready" && <section className="news-h5-feed__items">
        {controller.items.map((item) => <NewsH5FeedArticle
          favorite={controller.favoriteItemIds.has(item.id)}
          favoritePending={controller.favoritePendingItemIds.has(item.id)}
           item={item}
           key={item.id}
           onOpen={() => {
             setSelectedItem(item);
             onSecondaryPageChange?.(true);
           }}
           onToggleFavorite={() => void controller.toggleFavorite(item.id)}
        />)}
      </section>}

      {(controller.channelsError || controller.mutationError) && <p
        className="news-h5-command-error"
        role="alert"
      >{controller.mutationError ?? controller.channelsError}</p>}
      {controller.status === "ready" && controller.canLoadMore && <button
        className="news-h5-load-more"
        disabled={controller.loadingMore}
        onClick={() => void controller.loadMore()}
        type="button"
      >
        {controller.loadingMore && <LoaderCircle className="is-spinning" size={14} />}
        {controller.loadingMore ? "正在加载" : "加载更多"}
      </button>}
    </main>
  </div>;
}

function NewsH5FeedArticle({
  favorite,
  favoritePending,
  item,
  onOpen,
  onToggleFavorite,
}: {
  favorite: boolean;
  favoritePending: boolean;
  item: NewsFeedItem;
  onOpen(): void;
  onToggleFavorite(): void;
}) {
  return <article
    aria-label={"阅读 " + item.title}
    className="is-clickable"
    onClick={onOpen}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onOpen();
      }
    }}
    role="button"
    tabIndex={0}
  >
    <div className="news-h5-feed__article-meta">
      <span>{item.categoryId}</span>
      {item.featured && <b><Flame size={11} />精选</b>}
    </div>
    <h3>{item.title}</h3>
    <p>{item.summary}</p>
    {item.reason && <blockquote>{item.reason}</blockquote>}
    <footer>
      <div>
        {item.authorName && <span>{item.authorName}</span>}
        {item.publishedAt && <span>{formatPublishedAt(item.publishedAt)}</span>}
        {item.estimatedReadMinutes && <span><Clock3 size={11} />{item.estimatedReadMinutes} 分钟</span>}
      </div>
      <button
        aria-label={`${favorite ? "取消收藏" : "收藏"} ${item.title}`}
        aria-pressed={favorite}
        className={favorite ? "is-saved" : ""}
        disabled={favoritePending}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite();
        }}
        type="button"
      >
        {favoritePending
          ? <LoaderCircle className="is-spinning" size={16} />
          : <Bookmark fill={favorite ? "currentColor" : "none"} size={16} />}
      </button>
    </footer>
  </article>;
}

interface NewsDetailModel {
  author?: string;
  body?: readonly string[];
  category: string;
  estimatedReadMinutes?: number;
  image?: string;
  publishedLabel?: string;
  summary: string;
  tags: readonly string[];
  title: string;
  source: string;
}

function toNewsDetailModel(item: NewsFeedItem): NewsDetailModel {
  return {
    author: item.authorName,
    category: item.categoryId,
    estimatedReadMinutes: item.estimatedReadMinutes,
    publishedLabel: item.publishedAt ? formatPublishedAt(item.publishedAt) : undefined,
    source: item.authorName ?? "SDKWork News",
    summary: item.summary,
    tags: item.tags,
    title: item.title,
  };
}

function NewsH5Detail({
  favorite,
  item,
  onBack,
  onToggleFavorite,
}: {
  favorite: boolean;
  item: NewsDetailModel;
  onBack(): void;
  onToggleFavorite(): void;
}) {
  return <div className="news-h5-detail-page">
    <header className="news-h5-detail-page__header">
      <button aria-label="返回新闻列表" onClick={onBack} type="button"><ArrowLeft size={20} /></button>
      <strong>新闻详情</strong>
      <button
        aria-label={favorite ? "取消收藏" : "收藏新闻"}
        aria-pressed={favorite}
        className={favorite ? "is-saved" : ""}
        onClick={onToggleFavorite}
        type="button"
      ><Bookmark fill={favorite ? "currentColor" : "none"} size={18} /></button>
    </header>
    <main>
      {item.image && <img className="news-h5-detail-page__cover" src={item.image} alt="" />}
      <div className="news-h5-detail-page__meta">
        <span>{item.category}</span>
        <span>{item.source}</span>
        {item.author && item.author !== item.source && <span>{item.author}</span>}
        {item.publishedLabel && <span>{item.publishedLabel}</span>}
      </div>
      <h1>{item.title}</h1>
      <div className="news-h5-detail-page__reading">
        <span>智能摘要</span>
        {item.estimatedReadMinutes && <span><Clock3 size={12} />约 {item.estimatedReadMinutes} 分钟</span>}
      </div>
      <p className="news-h5-detail-page__summary">{item.summary}</p>
      {item.body && item.body.length > 0
        ? <div className="news-h5-detail-page__body">{item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        : <section className="news-h5-detail-page__unavailable">
          <h2>原文内容</h2>
          <p>当前来源只提供摘要，原文将在来源同步后继续呈现。</p>
        </section>}
      {item.tags.length > 0 && <div className="news-h5-detail-page__tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
    </main>
  </div>;
}

function NewsH5FeedState({
  onRetry,
  status,
}: {
  onRetry(): void;
  status: ReturnType<typeof useNewsFeedController>["status"];
}) {
  if (status === "ready") {
    return null;
  }
  if (status === "loading") {
    return <section aria-live="polite" className="news-h5-state">
      <LoaderCircle className="is-spinning" size={22} />
      <h2>正在加载新闻</h2>
    </section>;
  }
  if (status === "unavailable") {
    return <section className="news-h5-state" role="status">
      <Search size={22} />
      <h2>新闻服务未连接</h2>
      <p>完成登录并连接新闻服务后即可查看内容。</p>
    </section>;
  }
  if (status === "error") {
    return <section className="news-h5-state" role="alert">
      <h2>新闻流暂不可用</h2>
      <button onClick={onRetry} type="button"><RefreshCw size={14} />重试</button>
    </section>;
  }
  return <section className="news-h5-state" role="status">
    <Search size={22} />
    <h2>暂无匹配新闻</h2>
    <p>可以切换分类或调整搜索关键词。</p>
  </section>;
}

const DEMO_CATEGORIES = ["推荐", "要闻", "科技", "财经", "商业", "国际", "政策"];
type DemoNewsArticle = {
  readonly body: readonly string[];
  readonly id: string;
  readonly image: string;
  readonly source: string;
  readonly summary: string;
  readonly tag: string;
  readonly time: string;
  readonly title: string;
};

const DEMO_LEAD: DemoNewsArticle = {
  body: [
    "过去的新闻产品依赖推荐算法，把用户留在一条不断刷新的信息流里。AI 时代的阅读方式开始转向长期协作：用户定义目标，智能体持续追踪变化并解释它们为什么重要。",
    "这意味着新闻产品需要同时处理来源筛选、事实核验和上下文整理。高质量的阅读体验不再是更多内容，而是在合适的时间交付更少但更有用的判断依据。",
  ],
  id: "lead",
  image: newsroomImage,
  source: "SDKWork 研究院",
  summary: "用户不再需要消费所有内容，而是让不同角色的智能体持续阅读、验证并呈现真正影响决策的变化。",
  tag: "要闻",
  time: "12 分钟前",
  title: "从信息流到智能体：新闻阅读正在发生结构性变化",
};

const DEMO_ITEMS: readonly DemoNewsArticle[] = [
  { body: ["企业正在把智能体从单次问答工具放进销售、客服和研发流程。", "随着任务持续执行，可靠性、权限边界和可观察性成为采购决策的核心。"], id: "1", title: "AI Agent 开始进入企业核心工作流，评估标准正在改变", source: "MIT Technology Review", time: "42 分钟前", tag: "科技", image: aiChipsImage, summary: "从单次回答走向长期执行后，可靠性、权限边界和可观察性成为采购决策的核心。" },
  { body: ["公开市场操作规模连续上升，短端利率回落。", "机构仍在观察政策传导到实体经济的速度，趋势判断保持谨慎。"], id: "2", title: "资金面延续宽松，市场关注下一阶段政策信号", source: "第一财经", time: "1 小时前", tag: "财经", image: marketsImage, summary: "公开市场操作规模连续上升，短端利率回落，但机构对趋势判断仍保持谨慎。" },
  { body: ["越来越多 AI 产品尝试按任务、调用或业务结果计费。", "当价值从席位转向结果，传统 SaaS 的增长和留存指标也需要重新解释。"], id: "3", title: "企业软件定价从席位转向结果，新的商业模型浮出水面", source: "Bloomberg", time: "2 小时前", tag: "商业", image: workspaceImage, summary: "越来越多 AI 产品尝试按任务、调用或业务结果计费，传统 SaaS 指标面临重估。" },
  { body: ["效率与韧性的权衡正在改变，企业开始重新评估供应商集中度。", "关键零部件的多源策略增加，也让库存和物流协同成为新的管理重点。"], id: "4", title: "全球供应链继续区域化，制造企业重新校准库存策略", source: "Reuters", time: "3 小时前", tag: "国际", image: logisticsImage, summary: "效率与韧性的权衡正在改变，关键零部件的多源策略明显增加。" },
] as const;

function NewsH5NewsDemo({ onSecondaryPageChange }: Pick<NewsH5NewsProps, "onSecondaryPageChange">) {
  const [category, setCategory] = useState("推荐");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<ReadonlySet<string>>(() => new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState<DemoNewsArticle | null>(null);
  const normalizedQuery = query.toLocaleLowerCase("zh-CN");
  const visibleItems = DEMO_ITEMS.filter((item) =>
    (category === "推荐" || item.tag === category)
    && (!normalizedQuery || [item.source, item.tag, item.title]
      .some((value) => value.toLocaleLowerCase("zh-CN").includes(normalizedQuery))),
  );
  const showLead = !query && (category === "推荐" || category === "要闻");

  if (selectedItem) {
    return <NewsH5Detail
      favorite={saved.has(selectedItem.id)}
      item={{
        body: selectedItem.body,
        category: selectedItem.tag,
        image: selectedItem.image,
        publishedLabel: selectedItem.time,
        source: selectedItem.source,
        summary: selectedItem.summary,
        tags: [selectedItem.tag],
        title: selectedItem.title,
      }}
      onBack={() => {
        setSelectedItem(null);
        onSecondaryPageChange?.(false);
      }}
      onToggleFavorite={() => setSaved((current) => withDemoFavorite(current, selectedItem.id))}
    />;
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCategory("推荐");
    setQuery(searchText.trim());
    setSearchOpen(false);
  };

  const selectCategory = (value: string) => {
    setCategory(value);
    setQuery("");
  };

  return <div className="news-h5-feed is-demo">
    <header><h1>新闻</h1><button aria-label={searchOpen ? "关闭搜索" : "搜索新闻"} onClick={() => setSearchOpen((current) => !current)} type="button">{searchOpen ? <X size={20} /> : <Search size={20} />}</button></header>
    {searchOpen && <form className="news-h5-search" onSubmit={submitSearch} role="search"><Search aria-hidden="true" size={17} /><input aria-label="搜索新闻" autoFocus onChange={(event) => setSearchText(event.target.value)} placeholder="搜索新闻、主题或来源" value={searchText} /><button type="submit">搜索</button></form>}
    <nav aria-label="新闻分类">{DEMO_CATEGORIES.map((item) => <button className={!query && category === item ? "is-active" : ""} onClick={() => selectCategory(item)} type="button" key={item}>{item}</button>)}</nav>
    <main>
      {showLead && <section className="news-h5-lead"><img src={newsroomImage} alt="新闻编辑室" /><div><span>今日要闻</span><h2>从信息流到智能体：新闻阅读正在发生结构性变化</h2><p>SDKWork 研究院 · 12 分钟前</p></div></section>}
      <div className="news-h5-feed__label"><h2>{query ? `“${query}”的结果` : category === "推荐" ? "最新动态" : `${category}频道`}</h2><span>{visibleItems.length > 0 ? `${visibleItems.length} 条` : "演示内容"}</span></div>
      {visibleItems.length > 0
        ? <section className="news-h5-feed__items">{visibleItems.map((item) => <article className="has-image" key={item.id}><div><div className="news-h5-feed__article-meta"><span>{item.tag}</span></div><h3>{item.title}</h3><footer><div><span>{item.source}</span><span>{item.time}</span></div><button aria-label={`${saved.has(item.id) ? "取消收藏" : "收藏"} ${item.title}`} className={saved.has(item.id) ? "is-saved" : ""} onClick={() => setSaved((current) => withDemoFavorite(current, item.id))} type="button"><Bookmark fill={saved.has(item.id) ? "currentColor" : "none"} size={16} /></button></footer></div><img src={item.image} alt="" /></article>)}</section>
        : <section className="news-h5-state" role="status"><Search size={22} /><h2>暂无匹配新闻</h2><p>可以切换分类或调整搜索关键词。</p></section>}
    </main>
  </div>;
}

function withDemoFavorite(current: ReadonlySet<string>, itemId: string) {
  const next = new Set(current);
  if (next.has(itemId)) {
    next.delete(itemId);
  } else {
    next.add(itemId);
  }
  return next;
}

function formatPublishedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default NewsH5News;
