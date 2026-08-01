import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import {
  createDefaultNewsReadingSchedule,
  type NewsReadingAgent,
} from "@sdkwork/news-agent-contracts";
import { NewsH5ScheduleSheet, type NewsH5AgentProfileInput } from "../src/schedule-editor";

const agent: NewsReadingAgent = {
  accent: "#0b7d5e",
  conversationId: "im-test",
  createdAt: "2026-07-31T00:00:00+08:00",
  description: "测试阅读目标",
  id: "test-agent",
  lastDigestSummary: "等待首次阅读任务",
  name: "测试助手",
  readingScope: { categories: [], keywords: [], languages: ["zh-CN"], regions: ["CN"], trustedSources: [] },
  schedule: createDefaultNewsReadingSchedule("Asia/Shanghai"),
  status: "active",
  tone: "analytical",
  unreadCount: 0,
  updatedAt: "2026-07-31T00:00:00+08:00",
};

describe("NewsH5ScheduleSheet", () => {
  it("adds multiple daily slots and previews the contract cron", () => {
    render(<NewsH5ScheduleSheet agent={agent} onClose={() => undefined} onSave={async () => undefined} />);

    fireEvent.click(screen.getByRole("button", { name: "添加时段" }));

    expect(screen.getAllByLabelText(/^每日时段 \d$/u)).toHaveLength(3);
    expect(screen.getByText("0 10 * * *")).toBeInTheDocument();
  });

  it("saves profile fields with weekly and monthly schedule edits", async () => {
    const saved: NewsH5AgentProfileInput[] = [];
    const onSave = vi.fn(async (input: NewsH5AgentProfileInput) => { saved.push(input); });
    render(<NewsH5ScheduleSheet agent={agent} onClose={() => undefined} onSave={onSave} />);

    fireEvent.change(screen.getByLabelText("助手名称"), { target: { value: "政策助手" } });
    fireEvent.change(screen.getByLabelText("主题分类"), { target: { value: "政策、金融" } });
    fireEvent.change(screen.getByLabelText("可信来源"), { target: { value: "央行、国务院" } });
    fireEvent.change(screen.getByLabelText("输出风格"), { target: { value: "executive" } });
    fireEvent.click(screen.getByRole("button", { name: "一" }));
    fireEvent.change(screen.getByRole("spinbutton", { name: "每月日期" }), { target: { value: "12" } });
    fireEvent.click(screen.getByRole("button", { name: "保存设置" }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(saved[0]?.name).toBe("政策助手");
    expect(saved[0]?.readingScope.categories).toEqual(["政策", "金融"]);
    expect(saved[0]?.readingScope.trustedSources).toEqual(["央行", "国务院"]);
    expect(saved[0]?.tone).toBe("executive");
    expect(saved[0]?.schedule.weekly.weekdays).toEqual([1, 5]);
    expect(saved[0]?.schedule.monthly.day).toBe(12);
  });

  it("blocks saving when the shared schedule contract reports an error", () => {
    render(<NewsH5ScheduleSheet agent={agent} onClose={() => undefined} onSave={async () => undefined} />);
    const dailyInputs = screen.getAllByLabelText(/^每日时段 \d$/u);

    fireEvent.change(dailyInputs[1]!, { target: { value: "08:30" } });

    expect(screen.getByRole("alert")).toHaveTextContent("每日简报不能设置重复时段");
    expect(screen.getByRole("button", { name: "保存设置" })).toBeDisabled();
  });
});
