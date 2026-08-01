import { type FormEvent, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Clock3,
  Flame,
  LoaderCircle,
  RefreshCw,
  Search,
  Share2,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  WifiOff,
} from "lucide-react";
import {
  useNewsArticleController,
  useNewsFeedController,
} from "@sdkwork/news-feed-react";
import type {
  NewsArticle,
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
  shareArticle?: (input: NewsPcShareInput) => Promise<void>;
  service?: NewsFeedService;
}

export interface NewsPcShareInput {
  text: string;
  title: string;
}

export function NewsPcNews({
  demoMode = false,
  shareArticle,
  service,
}: NewsPcNewsProps) {
  const controller = useNewsFeedController(service);
  const [searchText, setSearchText] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string>();
  const articleController = useNewsArticleController(service, selectedItemId);

  if (demoMode) {
    return <NewsPcNewsDemo shareArticle={shareArticle} />;
  }

  if (selectedItemId) {
    if (articleController.status !== "ready" || !articleController.article) {
      return <NewsPcDetailState
        onBack={() => setSelectedItemId(undefined)}
        onRetry={articleController.retry}
        status={articleController.status}
      />;
    }
    return <NewsPcDetail
      favorite={controller.favoriteItemIds.has(selectedItemId)}
      favoritePending={controller.favoritePendingItemIds.has(selectedItemId)}
      feedbackError={articleController.feedbackError}
      feedbackMessage={articleController.feedbackMessage}
      feedbackPending={articleController.feedbackPending}
      item={toNewsPcDetailModel(articleController.article)}
      onBack={() => setSelectedItemId(undefined)}
      onOpenRelated={(itemId) => setSelectedItemId(itemId)}
      onShare={shareArticle
        ? async () => {
            await shareArticle({
              text: articleController.article?.summary ?? "",
              title: articleController.article?.title ?? "",
            });
            await articleController.recordShare();
          }
        : undefined}
      onSubmitFeedback={articleController.submitFeedback}
      onToggleFavorite={() => void controller.toggleFavorite(selectedItemId)}
      relatedError={articleController.relatedError}
      relatedItems={articleController.relatedItems}
    />;
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
            onOpen={() => setSelectedItemId(item.id)}
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
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
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

interface NewsPcDetailModel {
  author?: string;
  body?: readonly string[];
  category: string;
  estimatedReadMinutes?: number;
  image?: string;
  publishedLabel?: string;
  source?: string;
  summary: string;
  tags: readonly string[];
  title: string;
}

function toNewsPcDetailModel(item: NewsArticle): NewsPcDetailModel {
  return {
    author: item.authorName,
    body: toBodyParagraphs(item.body),
    category: item.categoryId,
    estimatedReadMinutes: item.estimatedReadMinutes,
    publishedLabel: item.publishedAt ? formatPublishedAt(item.publishedAt) : undefined,
    summary: item.summary,
    tags: item.tags,
    title: item.title,
  };
}

function NewsPcDetail({
  favorite,
  favoritePending,
  feedbackError,
  feedbackMessage,
  feedbackPending,
  item,
  onBack,
  onOpenRelated,
  onShare,
  onSubmitFeedback,
  onToggleFavorite,
  relatedError,
  relatedItems,
}: {
  favorite: boolean;
  favoritePending?: boolean;
  feedbackError?: string;
  feedbackMessage?: string;
  feedbackPending?: boolean;
  item: NewsPcDetailModel;
  onBack(): void;
  onOpenRelated?(itemId: string): void;
  onShare?(): Promise<void>;
  onSubmitFeedback?(type: "less_like_this" | "more_like_this"): Promise<void>;
  onToggleFavorite(): void;
  relatedError?: string;
  relatedItems?: readonly NewsFeedItem[];
}) {
  const [sharePending, setSharePending] = useState(false);
  const [shareError, setShareError] = useState<string>();
  const submitShare = async () => {
    if (!onShare || sharePending) {
      return;
    }
    setSharePending(true);
    setShareError(undefined);
    try {
      await onShare();
    } catch {
      setShareError("分享失败，请重试");
    } finally {
      setSharePending(false);
    }
  };
  return <div className="news-pc-detail-page">
    <header className="news-pc-detail-page__header">
      <button aria-label="返回新闻列表" onClick={onBack} type="button"><ArrowLeft size={18} />返回新闻</button>
      <div>
        {onShare && <button aria-label="分享新闻" disabled={sharePending} onClick={() => void submitShare()} title="分享" type="button">
          {sharePending ? <LoaderCircle className="is-spinning" size={17} /> : <Share2 size={17} />}
        </button>}
        <button
          aria-label={favorite ? "取消收藏" : "收藏新闻"}
          aria-pressed={favorite}
          className={favorite ? "is-saved" : ""}
          disabled={favoritePending}
          onClick={onToggleFavorite}
          title={favorite ? "取消收藏" : "收藏"}
          type="button"
        >{favoritePending
          ? <LoaderCircle className="is-spinning" size={17} />
          : <Bookmark fill={favorite ? "currentColor" : "none"} size={17} />}</button>
      </div>
    </header>
    <main>
      {item.image && <img className="news-pc-detail-page__cover" src={item.image} alt="" />}
      <div className="news-pc-detail-page__meta">
        <span>{item.category}</span>
        {item.source && <span>{item.source}</span>}
        {item.author && <span>{item.author}</span>}
        {item.publishedLabel && <span>{item.publishedLabel}</span>}
      </div>
      <h1>{item.title}</h1>
      <div className="news-pc-detail-page__reading">
        <span>智能摘要</span>
        {item.estimatedReadMinutes && <span><Clock3 size={13} />约 {item.estimatedReadMinutes} 分钟</span>}
      </div>
      <p className="news-pc-detail-page__summary">{item.summary}</p>
      {item.body && item.body.length > 0
        ? <div className="news-pc-detail-page__body">{item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        : <section className="news-pc-detail-page__unavailable">
          <h2>原文内容</h2>
          <p>当前来源只提供摘要，原文将在来源同步后继续呈现。</p>
        </section>}
      {item.tags.length > 0 && <div className="news-pc-detail-page__tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
      {onSubmitFeedback && <section className="news-pc-detail-page__feedback">
        <h2>这篇内容对你有帮助吗？</h2>
        <div>
          <button disabled={feedbackPending} onClick={() => void onSubmitFeedback("more_like_this")} type="button"><ThumbsUp size={16} />更多此类</button>
          <button disabled={feedbackPending} onClick={() => void onSubmitFeedback("less_like_this")} type="button"><ThumbsDown size={16} />减少此类</button>
        </div>
        {(feedbackMessage || feedbackError || shareError) && <p role={feedbackError || shareError ? "alert" : "status"}>{feedbackError ?? shareError ?? feedbackMessage}</p>}
      </section>}
      {(relatedItems?.length ?? 0) > 0 && <section className="news-pc-detail-page__related">
        <h2>相关新闻</h2>
        <div>{relatedItems?.map((related) => <button key={related.id} onClick={() => onOpenRelated?.(related.id)} type="button">
          <span>{related.categoryId}</span><strong>{related.title}</strong><small>{related.summary}</small>
        </button>)}</div>
      </section>}
      {relatedError && <p className="news-pc-detail-page__command-error" role="status">{relatedError}</p>}
    </main>
  </div>;
}

function NewsPcDetailState({
  onBack,
  onRetry,
  status,
}: {
  onBack(): void;
  onRetry(): void;
  status: ReturnType<typeof useNewsArticleController>["status"];
}) {
  return <div className="news-pc-detail-page">
    <header className="news-pc-detail-page__header">
      <button aria-label="返回新闻列表" onClick={onBack} type="button"><ArrowLeft size={18} />返回新闻</button>
    </header>
    <main><section className="news-feed-state" role={status === "error" ? "alert" : "status"}>
      {status === "loading" && <LoaderCircle className="is-spinning" size={22} />}
      <h2>{status === "error" ? "新闻详情加载失败" : "正在加载新闻详情"}</h2>
      {status === "error" && <button onClick={onRetry} type="button"><RefreshCw size={15} />重试</button>}
    </section></main>
  </div>;
}

function toBodyParagraphs(body?: string): readonly string[] | undefined {
  const paragraphs = body
    ?.split(/\r?\n\s*\r?\n/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  return paragraphs && paragraphs.length > 0 ? paragraphs : undefined;
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
type DemoNewsArticle = {
  readonly body: readonly string[];
  readonly category: string;
  readonly id: string;
  readonly image: string;
  readonly source: string;
  readonly summary: string;
  readonly time: string;
  readonly title: string;
};

const DEMO_LEAD: DemoNewsArticle = {
  body: [
    "过去的新闻产品依赖推荐算法，把用户留在一条不断刷新的信息流里。AI 时代的阅读方式开始转向长期协作：用户定义目标，智能体持续追踪变化并解释它们为什么重要。",
    "高质量的阅读体验不再是更多内容，而是在合适的时间交付更少但更有用的判断依据。",
  ],
  category: "要闻",
  id: "lead",
  image: newsroomImage,
  source: "SDKWork 研究院",
  summary: "用户不再需要消费所有内容，而是让不同角色的智能体持续阅读、验证并呈现真正影响决策的变化。",
  time: "12 分钟前",
  title: "从信息流到智能体：新闻阅读正在发生结构性变化",
};

const DEMO_ARTICLES: readonly DemoNewsArticle[] = [
  { body: ["企业正在把智能体从单次问答工具放进销售、客服和研发流程。", "随着任务持续执行，可靠性、权限边界和可观察性成为采购决策的核心。"], id: "1", category: "科技", source: "MIT Technology Review", time: "42 分钟前", title: "AI Agent 开始进入企业核心工作流，评估标准正在改变", summary: "从单次回答走向长期执行后，可靠性、权限边界和可观察性成为采购决策的核心。", image: aiChipsImage },
  { body: ["公开市场操作规模连续上升，短端利率回落。", "机构仍在观察政策传导到实体经济的速度，趋势判断保持谨慎。"], id: "2", category: "财经", source: "第一财经", time: "1 小时前", title: "资金面延续宽松，市场关注下一阶段政策信号", summary: "公开市场操作规模连续上升，短端利率回落，但机构对趋势判断仍保持谨慎。", image: marketsImage },
  { body: ["越来越多 AI 产品尝试按任务、调用或业务结果计费。", "当价值从席位转向结果，传统 SaaS 的增长和留存指标也需要重新解释。"], id: "3", category: "商业", source: "Bloomberg", time: "2 小时前", title: "企业软件定价从席位转向结果，新的商业模型浮出水面", summary: "越来越多 AI 产品尝试按任务、调用或业务结果计费，传统 SaaS 指标面临重估。", image: workspaceImage },
  { body: ["效率与韧性的权衡正在改变，企业开始重新评估供应商集中度。", "关键零部件的多源策略增加，也让库存和物流协同成为新的管理重点。"], id: "4", category: "国际", source: "Reuters", time: "3 小时前", title: "全球供应链继续区域化，制造企业重新校准库存策略", summary: "效率与韧性的权衡正在改变，关键零部件的多源策略明显增加。", image: logisticsImage },
] as const;

function NewsPcNewsDemo({
  shareArticle,
}: Pick<NewsPcNewsProps, "shareArticle">) {
  const [category, setCategory] = useState("推荐");
  const [feedbackMessage, setFeedbackMessage] = useState<string>();
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [saved, setSaved] = useState<ReadonlySet<string>>(() => new Set());
  const [selectedItem, setSelectedItem] = useState<DemoNewsArticle | null>(null);
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

  if (selectedItem) {
    const relatedItems = [DEMO_LEAD, ...DEMO_ARTICLES]
      .filter((item) => item.id !== selectedItem.id)
      .slice(0, 3)
      .map(toDemoFeedItem);
    return <NewsPcDetail
      favorite={saved.has(selectedItem.id)}
      feedbackMessage={feedbackMessage}
      item={{
        body: selectedItem.body,
        category: selectedItem.category,
        image: selectedItem.image,
        publishedLabel: selectedItem.time,
        source: selectedItem.source,
        summary: selectedItem.summary,
        tags: [selectedItem.category],
        title: selectedItem.title,
      }}
      onBack={() => {
        setSelectedItem(null);
        setFeedbackMessage(undefined);
      }}
      onOpenRelated={(itemId) => {
        const item = [DEMO_LEAD, ...DEMO_ARTICLES].find((candidate) => candidate.id === itemId);
        if (item) {
          setSelectedItem(item);
          setFeedbackMessage(undefined);
        }
      }}
      onShare={shareArticle
        ? () => shareArticle({ text: selectedItem.summary, title: selectedItem.title })
        : undefined}
      onSubmitFeedback={async (type) => {
        setFeedbackMessage(type === "more_like_this" ? "已记录，将推荐更多此类内容" : "已记录，将减少此类内容");
      }}
      onToggleFavorite={() => setSaved((current) => withDemoFavorite(current, selectedItem.id))}
      relatedItems={relatedItems}
    />;
  }

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
      {showLead && <section
        aria-label={"阅读 " + DEMO_LEAD.title}
        className="news-feed-lead is-clickable"
        onClick={() => {
          setSelectedItem(DEMO_LEAD);
          setFeedbackMessage(undefined);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelectedItem(DEMO_LEAD);
            setFeedbackMessage(undefined);
          }
        }}
        role="button"
        tabIndex={0}
      ><img src={DEMO_LEAD.image} alt="城市新闻编辑室" /><div><span>今日要闻</span><h2>{DEMO_LEAD.title}</h2><p>{DEMO_LEAD.summary}</p><footer><span>{DEMO_LEAD.source} · {DEMO_LEAD.time}</span></footer></div></section>}
      <div className="news-feed-section-title"><div><h2>{query ? `“${query}”的搜索结果` : category === "推荐" ? "最新动态" : `${category}频道`}</h2><span>{visibleArticles.length > 0 ? `${visibleArticles.length} 条` : "演示内容"}</span></div></div>
      {visibleArticles.length > 0
        ? <section className="news-feed-list">{visibleArticles.map((article) => <article
          aria-label={"阅读 " + article.title}
          className="has-image is-clickable"
          key={article.id}
          onClick={() => {
            setSelectedItem(article);
            setFeedbackMessage(undefined);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setSelectedItem(article);
              setFeedbackMessage(undefined);
            }
          }}
          role="button"
          tabIndex={0}
        ><div className="news-feed-list__content"><div className="news-feed-list__meta"><span>{article.category}</span><span>{article.source}</span><span>{article.time}</span></div><h3>{article.title}</h3><p>{article.summary}</p><footer><button aria-label={`${saved.has(article.id) ? "取消收藏" : "收藏"} ${article.title}`} className={saved.has(article.id) ? "is-saved" : ""} onClick={(event) => { event.stopPropagation(); setSaved((current) => withDemoFavorite(current, article.id)); }} type="button"><Bookmark fill={saved.has(article.id) ? "currentColor" : "none"} size={15} /></button></footer></div><img src={article.image} alt="" /></article>)}</section>
        : <section className="news-feed-state" role="status"><Search size={23} /><h2>暂无匹配新闻</h2><p>可以切换分类或调整搜索关键词。</p></section>}
    </main><aside><section className="news-ranking"><header><TrendingUp size={17} /><h2>实时热榜</h2></header>{DEMO_ARTICLES.map((item, index) => <div key={item.id}><b>{index + 1}</b><span>{item.title}<small>{item.source}</small></span></div>)}</section></aside></div>
  </div>;
}

function toDemoFeedItem(item: DemoNewsArticle): NewsFeedItem {
  return {
    categoryId: item.category,
    featured: item.id === "lead",
    id: item.id,
    summary: item.summary,
    tags: [item.category],
    title: item.title,
  };
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
