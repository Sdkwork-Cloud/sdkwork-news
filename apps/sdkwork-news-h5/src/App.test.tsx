import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("News H5 shell navigation", () => {
  it("hides the tab bar on assistant conversations and restores it on back", async () => {
    render(
      <App
        accountDemoMode
        aiStoreDemoMode
        assistantDemoMode
        newsDemoMode
      />,
    );

    expect(screen.getByRole("navigation")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /市场雷达/ }));

    await waitFor(() => {
      expect(screen.queryByRole("navigation")).toBeNull();
    });
    fireEvent.click(screen.getByTitle("返回"));

    await waitFor(() => {
      expect(screen.getByRole("navigation")).toBeTruthy();
    });
  });

  it("hides the tab bar on news details and restores it on back", async () => {
    render(
      <App
        accountDemoMode
        aiStoreDemoMode
        assistantDemoMode
        newsDemoMode
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "新闻" }));
    expect(screen.getByRole("navigation", { name: "新闻分类" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {
      name: "阅读 AI Agent 开始进入企业核心工作流，评估标准正在改变",
    }));

    await waitFor(() => {
      expect(screen.getByRole("heading", {
        level: 1,
        name: "AI Agent 开始进入企业核心工作流，评估标准正在改变",
      })).toBeTruthy();
      expect(screen.queryAllByRole("navigation")).toHaveLength(0);
    });

    fireEvent.click(screen.getByRole("button", { name: "返回新闻列表" }));

    await waitFor(() => {
      expect(screen.getAllByRole("navigation")).toHaveLength(2);
    });
  });

  it("hides the tab bar on account secondary pages and restores it on back", async () => {
    render(
      <App
        accountDemoMode
        aiStoreDemoMode
        assistantDemoMode
        newsDemoMode
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "我的" }));
    expect(screen.getByRole("navigation")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /通知与提醒/ }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "通知与提醒" })).toBeTruthy();
      expect(screen.queryByRole("navigation")).toBeNull();
    });

    fireEvent.click(screen.getByRole("button", { name: "返回我的" }));
    await waitFor(() => {
      expect(screen.getByRole("navigation")).toBeTruthy();
    });
  });
});
