import { useState } from "react";
import { Bookmark, Clock3, Flame, MessageCircle, MoreHorizontal, Search, Share2, TrendingUp } from "lucide-react";
import aiChipsImage from "../../../../sdkwork-news-common/assets/news/ai-chips.jpg";
import logisticsImage from "../../../../sdkwork-news-common/assets/news/logistics.jpg";
import marketsImage from "../../../../sdkwork-news-common/assets/news/markets.jpg";
import newsroomImage from "../../../../sdkwork-news-common/assets/news/newsroom.jpg";
import workspaceImage from "../../../../sdkwork-news-common/assets/news/workspace.jpg";
import "./styles.css";

const categories = ["推荐", "要闻", "科技", "财经", "商业", "国际", "政策", "研究"];
const articles = [
  { id:"1", category:"科技", source:"MIT Technology Review", time:"42 分钟前", title:"AI Agent 开始进入企业核心工作流，评估标准正在改变", summary:"从单次回答走向长期执行后，可靠性、权限边界和可观察性成为采购决策的核心。", image:aiChipsImage, hot:true, comments:186 },
  { id:"2", category:"财经", source:"第一财经", time:"1 小时前", title:"资金面延续宽松，市场关注下一阶段政策信号", summary:"公开市场操作规模连续上升，短端利率回落，但机构对趋势判断仍保持谨慎。", image:marketsImage, comments:92 },
  { id:"3", category:"商业", source:"Bloomberg", time:"2 小时前", title:"企业软件定价从席位转向结果，新的商业模型浮出水面", summary:"越来越多 AI 产品尝试按任务、调用或业务结果计费，传统 SaaS 指标面临重估。", image:workspaceImage, comments:64 },
  { id:"4", category:"国际", source:"Reuters", time:"3 小时前", title:"全球供应链继续区域化，制造企业重新校准库存策略", summary:"效率与韧性的权衡正在改变，关键零部件的多源策略明显增加。", image:logisticsImage, comments:41 },
];

export function NewsPcNews(){
  const [category,setCategory]=useState("推荐");
  const [saved,setSaved]=useState<Set<string>>(new Set());
  return <div className="news-pc-feed-modern">
    <header className="news-pc-feed-modern__header"><div><h1>新闻</h1><p>2026 年 7 月 31 日 · 星期五</p></div><label><Search size={17}/><input placeholder="搜索新闻、主题或来源"/><kbd>⌘ K</kbd></label></header>
    <nav className="news-pc-feed-modern__tabs">{categories.map(item=><button className={item===category?"is-active":""} onClick={()=>setCategory(item)} key={item} type="button">{item}</button>)}</nav>
    <div className="news-pc-feed-modern__body"><main>
      <section className="news-feed-lead"><img src={newsroomImage} alt="城市新闻编辑室"/><div><span>今日要闻</span><h2>从信息流到智能体：新闻阅读正在发生结构性变化</h2><p>用户不再需要消费所有内容，而是让不同角色的智能体持续阅读、验证并呈现真正影响决策的变化。</p><footer><span>SDKWork 研究院 · 12 分钟前</span><button type="button">深入阅读</button></footer></div></section>
      <div className="news-feed-section-title"><h2>最新动态</h2><span>基于你的关注动态更新</span></div>
      <section className="news-feed-list">{articles.map(article=><article key={article.id}><div className="news-feed-list__content"><div className="news-feed-list__meta"><span>{article.category}</span><span>{article.source}</span><span>{article.time}</span>{article.hot&&<b><Flame size={13}/> 热点</b>}</div><h3>{article.title}</h3><p>{article.summary}</p><footer><span><MessageCircle size={14}/>{article.comments}</span><button onClick={()=>setSaved(current=>{const next=new Set(current);next.has(article.id)?next.delete(article.id):next.add(article.id);return next})} className={saved.has(article.id)?"is-saved":""} type="button" title="收藏"><Bookmark size={15}/></button><button type="button" title="分享"><Share2 size={15}/></button><button type="button" title="更多"><MoreHorizontal size={16}/></button></footer></div><img src={article.image} alt=""/></article>)}</section>
    </main><aside><section><header><TrendingUp size={17}/><h2>实时热榜</h2></header>{["新一代智能体协议进入标准讨论","多家企业上调 AI 基础设施预算","央行公开市场连续净投放","开源模型推理成本再下降","全球软件支出结构发生变化"].map((item,index)=><button key={item} type="button"><b>{index+1}</b><span>{item}<small>{(98-index*11)} 万热度</small></span></button>)}</section><section className="news-reading-brief"><header><Clock3 size={17}/><h2>阅读进度</h2></header><p>今天已节省</p><strong>1 小时 42 分</strong><div><span style={{width:"68%"}}/></div><small>智能体已代读 246 篇</small></section></aside></div>
  </div>;
}
export default NewsPcNews;
