import { type FormEvent, useState } from "react";
import {
  Bookmark,
  Clock3,
  Flame,
  LoaderCircle,
  RefreshCw,
  Search,
  TrendingUp,
  WifiOff,
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

export interface NewsPcNewsProps {
  demoMode?: boolean;
  service?: NewsFeedService;
}

export function NewsPcNews({
  demoMode = false,
  service,
}: NewsPcNewsProps) {
  const controller = useNewsFeedController(service);
  const [searchText, setSearchText] = useState("");

  if (demoMode) {
    return <NewsPcNewsDemo />;
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controller.search(searchText);
  };

  return <div className="news-pc-feed-modern">
    <header className="news-pc-feed-modern__header">
      <div>
        <h1>新闻</h1>
        <p>{formatToday()}</p>
      </div>
      <form onSubmit={submitSearch} role="search">
        <Search aria-hidden="true" size={17} />
        <input
          aria-label="搜索新闻"
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="搜索新闻、主题或来源"
          value={searchText}
        />
        <button aria-label="提交搜索" type="submit">
          <Search size={15} />
        </button>
      </form>
    </header>

    <nav aria-label="新闻分类" className="news-pc-feed-modern__tabs">
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

    <div className="news-pc-feed-modern__body">
      <main>
        <div className="news-feed-section-title">
          <div>
            <h2>{controller.query ? `“${controller.query}”的搜索结果` : "最新动态"}</h2>
            <span>{controller.items.length > 0 ? `当前已加载 ${controller.items.length} 条` : ""}</span>
          </div>
          {controller.channelsError && <small role="status">{controller.channelsError}</small>}
        </div>

        <NewsPcFeedState
          onRetry={controller.retry}
          status={controller.status}
        />

        {controller.status === "ready" && <section className="news-feed-list">
          {controller.items.map((item) => <NewsPcFeedArticle
            favorite={controller.favoriteItemIds.has(item.id)}
            favoritePending={controller.favoritePendingItemIds.has(item.id)}
            item={item}
            key={item.id}
            onToggleFavorite={() => void controller.toggleFavorite(item.id)}
          />)}
        </section>}

        {controller.mutationError && <p className="news-feed-command-error" role="alert">
          {controller.mutationError}
        </p>}
        {controller.status === "ready" && controller.canLoadMore && <button
          className="news-feed-load-more"
          disabled={controller.loadingMore}
          onClick={() => void controller.loadMore()}
          type="button"
        >
          {controller.loadingMore && <LoaderCircle className="is-spinning" size={15} />}
          {controller.loadingMore ? "正在加载" : "加载更多"}
        </button>}
      </main>

      <aside>
        <section className="news-ranking">
          <header><TrendingUp size={17} /><h2>实时热榜</h2></header>
          {controller.trendingItems.map((item, index) => <div key={item.id}>
            <b>{index + 1}</b>
            <span>{item.title}<small>{item.authorName ?? item.categoryId}</small></span>
          </div>)}
          {controller.trendingItems.length === 0 && <p>
            {controller.trendingError ?? "暂无热榜数据"}
          </p>}
        </section>
        <section className="news-view-summary">
          <header><Clock3 size={17} /><h2>当前视图</h2></header>
          <dl>
            <div><dt>范围</dt><dd>{resolveViewLabel(controller.activeChannelId, controller.channels)}</dd></div>
            <div><dt>已加载</dt><dd>{controller.items.length}</dd></div>
          </dl>
        </section>
      </aside>
    </div>
  </div>;
}

function NewsPcFeedArticle({
  favorite,
  favoritePending,
  item,
  onToggleFavorite,
}: {
  favorite: boolean;
  favoritePending: boolean;
  item: NewsFeedItem;
  onToggleFavorite(): void;
}) {
  return <article>
    <div className="news-feed-list__content">
      <div className="news-feed-list__meta">
        <span>{item.categoryId}</span>
        {item.authorName && <span>{item.authorName}</span>}
        {item.publishedAt && <span>{formatPublishedAt(item.publishedAt)}</span>}
        {item.featured && <b><Flame size={13} /> 精选</b>}
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      {item.reason && <blockquote>{item.reason}</blockquote>}
      <footer>
        {item.estimatedReadMinutes && <span>
          <Clock3 size={14} />{item.estimatedReadMinutes} 分钟
        </span>}
        <div className="news-feed-list__tags">
          {item.tags.map((tag) => <small key={tag}>{tag}</small>)}
        </div>
        <button
          aria-label={`${favorite ? "取消收藏" : "收藏"} ${item.title}`}
          aria-pressed={favorite}
          className={favorite ? "is-saved" : ""}
          disabled={favoritePending}
          onClick={onToggleFavorite}
          title={favorite ? "取消收藏" : "收藏"}
          type="button"
        >
          {favoritePending
            ? <LoaderCircle className="is-spinning" size={15} />
            : <Bookmark fill={favorite ? "currentColor" : "none"} size={15} />}
        </button>
      </footer>
    </div>
  </article>;
}

function NewsPcFeedState({
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
    return <section aria-live="polite" className="news-feed-state">
      <LoaderCircle className="is-spinning" size={22} />
      <h2>正在加载新闻</h2>
    </section>;
  }
  if (status === "unavailable") {
    return <section className="news-feed-state" role="status">
      <WifiOff size={23} />
      <h2>新闻服务未连接</h2>
      <p>完成登录并连接新闻服务后即可查看个性化内容。</p>
    </section>;
  }
  if (status === "error") {
    return <section className="news-feed-state" role="alert">
      <WifiOff size={23} />
      <h2>新闻流暂不可用</h2>
      <button onClick={onRetry} type="button"><RefreshCw size={15} />重试</button>
    </section>;
  }
  return <section className="news-feed-state" role="status">
    <Search size={23} />
    <h2>暂无匹配新闻</h2>
    <p>可以切换分类或调整搜索关键词。</p>
  </section>;
}

const DEMO_CATEGORIES = ["推荐", "要闻", "科技", "财经", "商业", "国际", "政策"];
const DEMO_ARTICLES = [
  { id: "1", category: "科技", source: "MIT Technology Review", time: "42 分钟前", title: "AI Agent 开始进入企业核心工作流，评估标准正在改变", summary: "从单次回答走向长期执行后，可靠性、权限边界和可观察性成为采购决策的核心。", image: aiChipsImage },
  { id: "2", category: "财经", source: "第一财经", time: "1 小时前", title: "资金面延续宽松，市场关注下一阶段政策信号", summary: "公开市场操作规模连续上升，短端利率回落，但机构对趋势判断仍保持谨慎。", image: marketsImage },
  { id: "3", category: "商业", source: "Bloomberg", time: "2 小时前", title: "企业软件定价从席位转向结果，新的商业模型浮出水面", summary: "越来越多 AI 产品尝试按任务、调用或业务结果计费，传统 SaaS 指标面临重估。", image: workspaceImage },
  { id: "4", category: "国际", source: "Reuters", time: "3 小时前", title: "全球供应链继续区域化，制造企业重新校准库存策略", summary: "效率与韧性的权衡正在改变，关键零部件的多源策略明显增加。", image: logisticsImage },
] as const;

function NewsPcNewsDemo() {
  const [category, setCategory] = useState("推荐");
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [saved, setSaved] = useState<ReadonlySet<string>>(() => new Set());
  const normalizedQuery = query.toLocaleLowerCase("zh-CN");
  const visibleArticles = DEMO_ARTICLES.filter((article) =>
    (category === "推荐" || article.category === category)
    && (!normalizedQuery || [
      article.category,
      article.source,
      article.summary,
      article.title,
    ].some((value) => value.toLocaleLowerCase("zh-CN").includes(normalizedQuery))),
  );
  const showLead = !query && (category === "推荐" || category === "要闻");

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCategory("推荐");
    setQuery(searchText.trim());
  };

  const selectCategory = (value: string) => {
    setCategory(value);
    setQuery("");
  };

  return <div className="news-pc-feed-modern is-demo">
    <header className="news-pc-feed-modern__header"><div><h1>新闻</h1><p>{formatToday()}</p></div><form onSubmit={submitSearch} role="search"><Search aria-hidden="true" size={17} /><input aria-label="搜索新闻" onChange={(event) => setSearchText(event.target.value)} placeholder="搜索新闻、主题或来源" value={searchText} /><button aria-label="提交搜索" type="submit"><Search size={15} /></button></form></header>
    <nav aria-label="新闻分类" className="news-pc-feed-modern__tabs">{DEMO_CATEGORIES.map((item) => <button className={!query && item === category ? "is-active" : ""} onClick={() => selectCategory(item)} key={item} type="button">{item}</button>)}</nav>
    <div className="news-pc-feed-modern__body"><main>
      {showLead && <section className="news-feed-lead"><img src={newsroomImage} alt="城市新闻编辑室" /><div><span>今日要闻</span><h2>从信息流到智能体：新闻阅读正在发生结构性变化</h2><p>用户不再需要消费所有内容，而是让不同角色的智能体持续阅读、验证并呈现真正影响决策的变化。</p><footer><span>SDKWork 研究院 · 12 分钟前</span></footer></div></section>}
      <div className="news-feed-section-title"><div><h2>{query ? `“${query}”的搜索结果` : category === "推荐" ? "最新动态" : `${category}频道`}</h2><span>{visibleArticles.length > 0 ? `${visibleArticles.length} 条` : "演示内容"}</span></div></div>
      {visibleArticles.length > 0
        ? <section className="news-feed-list">{visibleArticles.map((article) => <article className="has-image" key={article.id}><div className="news-feed-list__content"><div className="news-feed-list__meta"><span>{article.category}</span><span>{article.source}</span><span>{article.time}</span></div><h3>{article.title}</h3><p>{article.summary}</p><footer><button aria-label={`${saved.has(article.id) ? "取消收藏" : "收藏"} ${article.title}`} className={saved.has(article.id) ? "is-saved" : ""} onClick={() => setSaved((current) => withDemoFavorite(current, article.id))} type="button"><Bookmark fill={saved.has(article.id) ? "currentColor" : "none"} size={15} /></button></footer></div><img src={article.image} alt="" /></article>)}</section>
        : <section className="news-feed-state" role="status"><Search size={23} /><h2>暂无匹配新闻</h2><p>可以切换分类或调整搜索关键词。</p></section>}
    </main><aside><section className="news-ranking"><header><TrendingUp size={17} /><h2>实时热榜</h2></header>{DEMO_ARTICLES.map((item, index) => <div key={item.id}><b>{index + 1}</b><span>{item.title}<small>{item.source}</small></span></div>)}</section></aside></div>
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

function formatToday(): string {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "full",
  }).format(new Date());
}

function formatPublishedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function resolveViewLabel(
  channelId: string | undefined,
  channels: readonly { id: string; title: string }[],
): string {
  return channels.find((channel) => channel.id === channelId)?.title ?? "推荐";
}

export default NewsPcNews;
