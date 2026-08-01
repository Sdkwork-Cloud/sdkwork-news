import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import type { NewsAccountService } from "@sdkwork/news-account-service";
import { NewsH5Account } from "../src/index.js";

describe("NewsH5Account production state", () => {
  it("fails closed without IAM service", () => {
    render(<NewsH5Account />);
    expect(screen.getByText("账号服务未连接")).toBeInTheDocument();
    expect(screen.queryByText("林然")).not.toBeInTheDocument();
  });

  it("renders verified profile with navigable account capabilities", async () => {
    const service: NewsAccountService = {
      getCurrentProfile: vi.fn(async () => ({ displayName: "Lin Ran", email: "lin@example.test" })),
      login: vi.fn(),
      logout: vi.fn(async () => undefined),
    };
    render(<NewsH5Account service={service} />);
    expect(await screen.findByText("Lin Ran")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /我的收藏/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /账号安全/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /登录设备/ })).toBeInTheDocument();
    expect(screen.queryByText("3,892")).not.toBeInTheDocument();
    expect(screen.queryByText("24.6 小时")).not.toBeInTheDocument();
  });

  it("never exposes demo content or usage data to production accounts", async () => {
    const service: NewsAccountService = {
      getCurrentProfile: vi.fn(async () => ({ displayName: "Lin Ran", email: "lin@example.test" })),
      login: vi.fn(),
      logout: vi.fn(async () => undefined),
    };
    render(<NewsH5Account service={service} />);
    expect(await screen.findByText("Lin Ran")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /订阅账户中心/ }));
    expect(screen.getByText("订阅服务尚未连接")).toBeInTheDocument();
    expect(screen.queryByText("专业版")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "返回我的" }));

    fireEvent.click(screen.getByRole("button", { name: /智能体用量/ }));
    expect(screen.getByText("智能体用量服务尚未连接")).toBeInTheDocument();
    expect(screen.queryByText("24.6")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "返回我的" }));

    fireEvent.click(screen.getByRole("button", { name: /我的收藏/ }));
    expect(screen.getByText("收藏同步服务尚未连接")).toBeInTheDocument();
    expect(screen.queryByText("AI Agent 开始进入企业核心工作流，评估标准正在改变")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "返回我的" }));

    fireEvent.click(screen.getByRole("button", { name: /离线内容/ }));
    expect(screen.getByText("暂无离线内容")).toBeInTheDocument();
    expect(screen.queryByText("企业软件定价从席位转向结果")).not.toBeInTheDocument();
  });

  it("opens every demo account capability as a secondary page", () => {
    const onSecondaryPageChange = vi.fn();
    render(<NewsH5Account demoMode onSecondaryPageChange={onSecondaryPageChange} />);
    const pages: ReadonlyArray<{ button: RegExp; heading: string }> = [
      { button: /林然/, heading: "个人资料" },
      { button: /订阅专业版/, heading: "订阅与方案" },
      { button: /我的收藏/, heading: "我的收藏" },
      { button: /阅读历史/, heading: "阅读历史" },
      { button: /离线内容/, heading: "离线内容" },
      { button: /智能体用量/, heading: "智能体用量" },
      { button: /通知与提醒/, heading: "通知与提醒" },
      { button: /语言与地区/, heading: "语言与地区" },
      { button: /显示与外观/, heading: "显示与外观" },
      { button: /隐私控制/, heading: "隐私控制" },
      { button: /账号安全/, heading: "账号安全" },
      { button: /登录设备/, heading: "登录设备" },
      { button: /帮助与支持/, heading: "帮助与支持" },
      { button: /关于0\.1\.0/, heading: "关于 SDKWork News" },
    ];

    for (const page of pages) {
      fireEvent.click(screen.getByRole("button", { name: page.button }));
      expect(screen.getByRole("heading", { name: page.heading })).toBeInTheDocument();
      expect(onSecondaryPageChange).toHaveBeenLastCalledWith(true);
      fireEvent.click(screen.getByRole("button", { name: "返回我的" }));
      expect(onSecondaryPageChange).toHaveBeenLastCalledWith(false);
    }
  });

  it("updates demo profile and validates password changes", () => {
    render(<NewsH5Account demoMode />);
    fireEvent.click(screen.getByRole("button", { name: /林然/ }));
    fireEvent.change(screen.getByLabelText("显示名称"), { target: { value: "林然 News" } });
    fireEvent.click(screen.getByRole("button", { name: "保存资料" }));
    expect(screen.getByText("资料已更新")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "返回我的" }));
    expect(screen.getByText("林然 News")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /账号安全/ }));
    fireEvent.change(screen.getByLabelText("当前密码"), { target: { value: "current-password" } });
    fireEvent.change(screen.getByLabelText("新密码"), { target: { value: "new-password" } });
    fireEvent.change(screen.getByLabelText("确认新密码"), { target: { value: "new-password" } });
    fireEvent.click(screen.getByRole("button", { name: "更新密码" }));
    expect(screen.getByText("演示环境已完成密码规则校验，不会保存密码")).toBeInTheDocument();
  });

  it("updates content and notification settings immediately", () => {
    render(<NewsH5Account demoMode />);
    fireEvent.click(screen.getByRole("button", { name: /我的收藏/ }));
    fireEvent.click(screen.getByRole("button", { name: "取消收藏 AI Agent 开始进入企业核心工作流，评估标准正在改变" }));
    expect(screen.queryByText("AI Agent 开始进入企业核心工作流，评估标准正在改变")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "返回我的" }));
    expect(screen.getByRole("button", { name: /我的收藏2/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /阅读历史/ }));
    fireEvent.click(screen.getByRole("button", { name: "清空阅读历史" }));
    expect(screen.getByText("暂无阅读历史")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "返回我的" }));
    expect(screen.getByRole("button", { name: /阅读历史0/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /离线内容/ }));
    fireEvent.click(screen.getByRole("switch", { name: "仅在 Wi-Fi 下下载" }));
    expect(screen.getByRole("switch", { name: "仅在 Wi-Fi 下下载" })).toHaveAttribute("aria-checked", "false");
    fireEvent.click(screen.getByRole("button", { name: "删除下载 企业软件定价从席位转向结果" }));
    fireEvent.click(screen.getByRole("button", { name: "返回我的" }));
    expect(screen.getByRole("button", { name: /离线内容1/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /通知与提醒/ }));
    fireEvent.click(screen.getByRole("switch", { name: "允许通知" }));
    expect(screen.getByRole("switch", { name: "允许通知" })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("switch", { name: "重要新闻" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "返回我的" }));
    expect(screen.getByRole("button", { name: /通知与提醒已关闭/ })).toBeInTheDocument();
  });

  it("supports leaving and re-entering the demo account", () => {
    render(<NewsH5Account demoMode />);
    fireEvent.click(screen.getByRole("button", { name: "退出演示账户" }));
    expect(screen.getByRole("heading", { name: "演示账户已退出" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "重新进入演示账户" }));
    expect(screen.getByText("林然")).toBeInTheDocument();
  });

  it("persists appearance choices through the injected storage port", () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => { values.delete(key); },
      setItem: (key: string, value: string) => { values.set(key, value); },
    };
    const first = render(<NewsH5Account demoMode storage={storage} />);
    fireEvent.click(screen.getByRole("button", { name: /显示与外观/ }));
    fireEvent.click(screen.getByRole("radio", { name: /深色/ }));
    fireEvent.click(screen.getByRole("button", { name: "返回我的" }));
    expect(screen.getByRole("button", { name: /显示与外观深色/ })).toBeInTheDocument();
    first.unmount();
    render(<NewsH5Account demoMode storage={storage} />);
    expect(screen.getByRole("button", { name: /显示与外观深色/ })).toBeInTheDocument();
  });
});
