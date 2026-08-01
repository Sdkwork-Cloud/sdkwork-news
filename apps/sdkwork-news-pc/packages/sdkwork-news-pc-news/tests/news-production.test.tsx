import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import type { NewsFeedService } from "@sdkwork/news-feed-service";
import { NewsPcNews } from "../src/index.js";

function createService(): NewsFeedService {
  return {
    getArticle: vi.fn(async (itemId) => ({
      body: "真实 SDK 正文第一段。\n\n真实 SDK 正文第二段。",
      categoryId: "technology",
      featured: true,
      id: itemId,
      slug: itemId,
      summary: "真实 SDK 摘要",
      tags: ["Agent"],
      title: "真实 SDK 新闻",
    })),
    listChannels: vi.fn(async () => [{ id: "technology", title: "科技" }]),
    listFeed: vi.fn(async () => ({
      hasMore: false,
      items: [{
        categoryId: "technology",
        featured: true,
        id: "item-1",
        summary: "真实 SDK 摘要",
        tags: ["Agent"],
        title: "真实 SDK 新闻",
      }],
    })),
    listRelated: vi.fn(async () => ({ hasMore: false, items: [] })),
    listTrending: vi.fn(async () => ({ hasMore: false, items: [] })),
    recordEvent: vi.fn(async () => undefined),
    setFavorite: vi.fn(async () => undefined),
    submitFeedback: vi.fn(async () => undefined),
  };
}

describe("NewsPcNews production state", () => {
  it("fails closed without an injected service", () => {
    render(<NewsPcNews demoMode={false} />);
    expect(screen.getByText("新闻服务未连接")).toBeInTheDocument();
    expect(screen.queryByText("从信息流到智能体：新闻阅读正在发生结构性变化")).not.toBeInTheDocument();
  });

  it("renders SDK data and delegates favorite commands", async () => {
    const service = createService();
    render(<NewsPcNews service={service} />);
    expect(await screen.findByText("真实 SDK 新闻")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "收藏 真实 SDK 新闻" }));
    await waitFor(() => expect(service.setFavorite).toHaveBeenCalledWith("item-1", true));
  });

  it("opens an injected story detail and returns to the feed", async () => {
    const service = createService();
    render(<NewsPcNews service={service} />);
    expect(await screen.findByText("真实 SDK 新闻")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "阅读 真实 SDK 新闻" }));

    expect(await screen.findByRole("heading", { level: 1, name: "真实 SDK 新闻" })).toBeInTheDocument();
    expect(screen.getByText("真实 SDK 摘要")).toBeInTheDocument();
    expect(screen.getByText("真实 SDK 正文第一段。")).toBeInTheDocument();
    expect(service.getArticle).toHaveBeenCalledWith("item-1");
    fireEvent.click(screen.getByRole("button", { name: "返回新闻列表" }));
    expect(screen.getByRole("heading", { level: 3, name: "真实 SDK 新闻" })).toBeInTheDocument();
  });

  it("keeps showcase content behind explicit demo mode", () => {
    render(<NewsPcNews demoMode />);
    expect(screen.getByText("从信息流到智能体：新闻阅读正在发生结构性变化")).toBeInTheDocument();
  });

  it("filters showcase content by category", () => {
    render(<NewsPcNews demoMode />);

    fireEvent.click(screen.getByRole("button", { name: "科技" }));

    expect(screen.getByText("科技频道")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "AI Agent 开始进入企业核心工作流，评估标准正在改变" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "资金面延续宽松，市场关注下一阶段政策信号" })).not.toBeInTheDocument();
    expect(screen.queryByText("从信息流到智能体：新闻阅读正在发生结构性变化")).not.toBeInTheDocument();
  });

  it("searches showcase content", () => {
    render(<NewsPcNews demoMode />);

    fireEvent.change(screen.getByRole("textbox", { name: "搜索新闻" }), {
      target: { value: "供应链" },
    });
    fireEvent.click(screen.getByRole("button", { name: "提交搜索" }));

    expect(screen.getByText("“供应链”的搜索结果")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "全球供应链继续区域化，制造企业重新校准库存策略" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "AI Agent 开始进入企业核心工作流，评估标准正在改变" })).not.toBeInTheDocument();
  });

  it("opens a showcase story detail and returns to the feed", () => {
    render(<NewsPcNews demoMode />);

    fireEvent.click(screen.getByRole("button", {
      name: "阅读 AI Agent 开始进入企业核心工作流，评估标准正在改变",
    }));

    expect(screen.getByRole("heading", {
      level: 1,
      name: "AI Agent 开始进入企业核心工作流，评估标准正在改变",
    })).toBeInTheDocument();
    expect(screen.getByText("智能摘要")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "返回新闻列表" }));

    expect(screen.getByRole("heading", {
      level: 3,
      name: "AI Agent 开始进入企业核心工作流，评估标准正在改变",
    })).toBeInTheDocument();
  });

  it("supports feedback, sharing, and related-story navigation in showcase detail", async () => {
    const shareArticle = vi.fn(async () => undefined);
    render(<NewsPcNews demoMode shareArticle={shareArticle} />);

    fireEvent.click(screen.getByRole("button", {
      name: "阅读 AI Agent 开始进入企业核心工作流，评估标准正在改变",
    }));

    fireEvent.click(screen.getByRole("button", { name: "减少此类" }));
    expect(await screen.findByText("已记录，将减少此类内容")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "分享新闻" }));
    await waitFor(() => expect(shareArticle).toHaveBeenCalledWith({
      text: "从单次回答走向长期执行后，可靠性、权限边界和可观察性成为采购决策的核心。",
      title: "AI Agent 开始进入企业核心工作流，评估标准正在改变",
    }));

    fireEvent.click(screen.getByRole("button", {
      name: /从信息流到智能体：新闻阅读正在发生结构性变化/u,
    }));
    expect(screen.getByRole("heading", {
      level: 1,
      name: "从信息流到智能体：新闻阅读正在发生结构性变化",
    })).toBeInTheDocument();
  });
});
