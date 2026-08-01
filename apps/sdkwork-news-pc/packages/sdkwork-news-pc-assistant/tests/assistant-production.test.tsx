import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import type { NewsReadingAgent, UpdateNewsReadingAgentInput } from "@sdkwork/news-agent-contracts";
import type { NewsAgentService } from "@sdkwork/news-agent-service";
import { NewsPcAssistant } from "../src/index";

describe("NewsPcAssistant production state", () => {
  it("fails closed when the Agents SDK list request fails", async () => {
    const service = {
      list: vi.fn().mockRejectedValue(new Error("offline")),
    } as unknown as NewsAgentService;

    render(<NewsPcAssistant demoMode={false} service={service} />);

    expect(await screen.findAllByText("助手列表暂不可用")).not.toHaveLength(0);
    expect(screen.queryByText("市场雷达")).not.toBeInTheDocument();
    expect(screen.queryByText("公开市场操作节奏出现边际变化")).not.toBeInTheDocument();
  });

  it("renders an empty production workspace without dereferencing an agent", async () => {
    const service = {
      list: vi.fn().mockResolvedValue({
        items: [],
        pageInfo: { mode: "offset", page: 1, pageSize: 20, total: 0 },
      }),
    } as unknown as NewsAgentService;

    render(<NewsPcAssistant demoMode={false} service={service} />);

    expect(await screen.findAllByText("尚未创建阅读助手")).not.toHaveLength(0);
    expect(screen.queryByText("早间增量简报")).not.toBeInTheDocument();
  });

  it("keeps showcase content behind explicit demo mode", () => {
    render(<NewsPcAssistant demoMode />);

    expect(screen.getAllByText("市场雷达")).toHaveLength(2);
    expect(screen.getByText("早间增量简报")).toBeInTheDocument();
  });

  it("connects filters, sources, analysis, follow-up, and tracking actions", async () => {
    render(<NewsPcAssistant demoMode />);

    fireEvent.click(screen.getByRole("button", { name: "有更新" }));
    expect(screen.getAllByText("市场雷达")).toHaveLength(2);
    expect(screen.queryByText("竞品观察")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "全部" }));

    fireEvent.click(screen.getByRole("button", { name: /央行公开市场业务交易公告/u }));
    expect(screen.getByText(/官方发布/u)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "查看完整分析" }));
    expect(screen.getByText(/过去三个交易日净投放逐日增加/u)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "继续追问" }));
    expect(screen.getByRole("textbox", { name: "发送消息" })).toHaveValue(
      "请继续解释这次公开市场操作变化可能影响哪些行业，并列出证据。",
    );
    await waitFor(() => expect(screen.getByRole("textbox", { name: "发送消息" })).toHaveFocus());

    fireEvent.click(screen.getByRole("button", { name: "加入跟踪" }));
    expect(screen.getByRole("button", { name: "已加入跟踪" })).toBeDisabled();
  });

  it("updates the complete reading-agent profile through the service port", async () => {
    const update = vi.fn(async (_agentId: string, input: UpdateNewsReadingAgentInput): Promise<NewsReadingAgent> => ({
      ...input,
      accent: "#087a5b",
      createdAt: "2026-07-01T00:00:00+08:00",
      id: "market-radar",
      status: "active",
      unreadCount: 0,
      updatedAt: "2026-08-01T00:00:00+08:00",
    } as NewsReadingAgent));
    const service = { update } as unknown as NewsAgentService;

    render(<NewsPcAssistant demoMode service={service} />);
    fireEvent.click(screen.getByTitle("助手设置"));
    fireEvent.change(screen.getByLabelText("助手名称"), { target: { value: "政策决策雷达" } });
    fireEvent.change(screen.getByLabelText("阅读职责"), { target: { value: "跟踪政策并输出决策摘要" } });
    fireEvent.change(screen.getByLabelText("主题分类"), { target: { value: "政策、金融" } });
    fireEvent.change(screen.getByLabelText("关键词"), { target: { value: "利率，流动性" } });
    fireEvent.change(screen.getByLabelText("可信来源"), { target: { value: "央行、国务院" } });
    fireEvent.change(screen.getByLabelText("输出风格"), { target: { value: "executive" } });
    fireEvent.click(screen.getByRole("button", { name: "保存设置" }));

    await waitFor(() => expect(update).toHaveBeenCalledWith(
      "market-radar",
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
