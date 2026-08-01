import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import type { NewsFeedService } from "@sdkwork/news-feed-service";
import { NewsH5News } from "../src/index.js";

function createService(): NewsFeedService {
  return {
    listChannels: vi.fn(async () => [{ id: "technology", title: "科技" }]),
    listFeed: vi.fn(async () => ({
      hasMore: false,
      items: [{
        categoryId: "technology",
        featured: true,
        id: "item-1",
        summary: "真实 SDK 摘要",
        tags: [],
        title: "真实 SDK 新闻",
      }],
    })),
    listTrending: vi.fn(async () => ({ hasMore: false, items: [] })),
    setFavorite: vi.fn(async () => undefined),
  };
}

describe("NewsH5News production state", () => {
  it("fails closed without an injected service", () => {
    render(<NewsH5News demoMode={false} />);
    expect(screen.getByText("新闻服务未连接")).toBeInTheDocument();
    expect(screen.queryByText("从信息流到智能体：新闻阅读正在发生结构性变化")).not.toBeInTheDocument();
  });

  it("renders SDK data and delegates favorite commands", async () => {
    const service = createService();
    render(<NewsH5News service={service} />);
    expect(await screen.findByText("真实 SDK 新闻")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "收藏 真实 SDK 新闻" }));
    await waitFor(() => expect(service.setFavorite).toHaveBeenCalledWith("item-1", true));
  });

  it("keeps showcase content behind explicit demo mode", () => {
    render(<NewsH5News demoMode />);
    expect(screen.getByText("从信息流到智能体：新闻阅读正在发生结构性变化")).toBeInTheDocument();
  });

  it("filters showcase content by category", () => {
    render(<NewsH5News demoMode />);

    fireEvent.click(screen.getByRole("button", { name: "科技" }));

    expect(screen.getByText("科技频道")).toBeInTheDocument();
    expect(screen.getByText("AI Agent 开始进入企业核心工作流，评估标准正在改变")).toBeInTheDocument();
    expect(screen.queryByText("资金面延续宽松，市场关注下一阶段政策信号")).not.toBeInTheDocument();
    expect(screen.queryByText("从信息流到智能体：新闻阅读正在发生结构性变化")).not.toBeInTheDocument();
  });

  it("opens and submits showcase search", () => {
    render(<NewsH5News demoMode />);

    fireEvent.click(screen.getByRole("button", { name: "搜索新闻" }));
    fireEvent.change(screen.getByRole("textbox", { name: "搜索新闻" }), {
      target: { value: "供应链" },
    });
    fireEvent.click(screen.getByRole("button", { name: "搜索" }));

    expect(screen.getByText("“供应链”的结果")).toBeInTheDocument();
    expect(screen.getByText("全球供应链继续区域化，制造企业重新校准库存策略")).toBeInTheDocument();
    expect(screen.queryByText("AI Agent 开始进入企业核心工作流，评估标准正在改变")).not.toBeInTheDocument();
  });
});
