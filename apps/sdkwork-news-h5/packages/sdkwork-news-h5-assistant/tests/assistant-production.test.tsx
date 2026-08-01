import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import type { NewsReadingAgent, UpdateNewsReadingAgentInput } from "@sdkwork/news-agent-contracts";
import type { NewsAgentService } from "@sdkwork/news-agent-service";
import { NewsH5Assistant } from "../src/index";

describe("NewsH5Assistant production state", () => {
  it("fails closed when the Agents SDK list request fails", async () => {
    const service = {
      list: vi.fn().mockRejectedValue(new Error("offline")),
    } as unknown as NewsAgentService;

    render(<NewsH5Assistant demoMode={false} service={service} />);

    expect(await screen.findByText("助手列表暂不可用")).toBeInTheDocument();
    expect(screen.queryByText("市场雷达")).not.toBeInTheDocument();
    expect(screen.queryByText("公开市场操作节奏出现边际变化")).not.toBeInTheDocument();
    expect(screen.queryByText("246")).not.toBeInTheDocument();
  });

  it("renders the SDK empty state without demo metrics", async () => {
    const service = {
      list: vi.fn().mockResolvedValue({
        items: [],
        pageInfo: { mode: "offset", page: 1, pageSize: 20, total: 0 },
      }),
    } as unknown as NewsAgentService;

    render(<NewsH5Assistant demoMode={false} service={service} />);

    expect(await screen.findByText("尚未创建阅读助手")).toBeInTheDocument();
    expect(screen.queryByText("今日代读")).not.toBeInTheDocument();
  });

  it("keeps showcase metrics behind explicit demo mode", () => {
    render(<NewsH5Assistant demoMode />);

    expect(screen.getByText("市场雷达")).toBeInTheDocument();
    expect(screen.getByText("今日代读")).toBeInTheDocument();
  });

  it("connects showcase schedule, analysis, follow-up, and suggested actions", async () => {
    render(<NewsH5Assistant demoMode />);

    fireEvent.click(screen.getByRole("button", { name: /下一轮 18:00/u }));
    expect(screen.getByText("助手设置")).toBeInTheDocument();
    fireEvent.click(screen.getByTitle("关闭"));

    fireEvent.click(screen.getByRole("button", { name: "完整分析" }));
    expect(screen.getByText(/过去三个交易日净投放逐日增加/u)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "继续追问" }));
    expect(screen.getByPlaceholderText("问问助手")).toHaveValue(
      "请继续解释这次公开市场操作变化可能影响哪些行业，并列出证据。",
    );

    fireEvent.click(screen.getByRole("button", { name: /建议动作/u }));
    expect(screen.getByPlaceholderText("问问助手")).toHaveValue(
      "请把收盘后需要复核的成交量和资金变化整理成检查清单。",
    );
    await waitFor(() => expect(screen.getByPlaceholderText("问问助手")).toHaveFocus());
  });

  it("updates the complete reading-agent profile through the service port", async () => {
    const update = vi.fn(async (_agentId: string, input: UpdateNewsReadingAgentInput): Promise<NewsReadingAgent> => ({
      ...input,
      accent: "#0b7d5e",
      createdAt: "2026-07-01T00:00:00+08:00",
      id: "market",
      status: "active",
      unreadCount: 0,
      updatedAt: "2026-08-01T00:00:00+08:00",
    } as NewsReadingAgent));
    const service = { update } as unknown as NewsAgentService;

    render(<NewsH5Assistant demoMode service={service} />);
    fireEvent.click(screen.getByText("市场雷达"));
    fireEvent.click(screen.getByTitle("助手设置"));
    fireEvent.change(screen.getByLabelText("助手名称"), { target: { value: "政策决策雷达" } });
    fireEvent.change(screen.getByLabelText("阅读职责"), { target: { value: "跟踪政策并输出决策摘要" } });
    fireEvent.change(screen.getByLabelText("主题分类"), { target: { value: "政策、金融" } });
    fireEvent.change(screen.getByLabelText("关键词"), { target: { value: "利率，流动性" } });
    fireEvent.change(screen.getByLabelText("可信来源"), { target: { value: "央行、国务院" } });
    fireEvent.change(screen.getByLabelText("输出风格"), { target: { value: "executive" } });
    fireEvent.click(screen.getByRole("button", { name: "保存设置" }));

    await waitFor(() => expect(update).toHaveBeenCalledWith(
      "market",
      expect.objectContaining({
        description: "跟踪政策并输出决策摘要",
        name: "政策决策雷达",
        readingScope: expect.objectContaining({
          categories: ["政策", "金融"],
          keywords: ["利率", "流动性"],
          trustedSources: ["央行", "国务院"],
        }),
        tone: "executive",
      }),
    ));
  });
});
