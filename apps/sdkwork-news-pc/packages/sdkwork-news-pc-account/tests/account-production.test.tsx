import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import {
  NewsAccountAuthenticationRequiredError,
  type NewsAccountProfile,
  type NewsAccountService,
} from "@sdkwork/news-account-service";
import { NewsPcAccount } from "../src/index.js";

describe("NewsPcAccount production state", () => {
  it("fails closed without IAM service", () => {
    render(<NewsPcAccount />);
    expect(screen.getByText("账号服务未连接")).toBeInTheDocument();
    expect(screen.queryByText("林然")).not.toBeInTheDocument();
  });

  it("renders the verified IAM profile without fake metrics", async () => {
    const service = createService({ displayName: "Lin Ran", email: "lin@example.test" });
    render(<NewsPcAccount service={service} />);
    expect(await screen.findByText("Lin Ran")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /订阅账户中心/u }));
    expect(screen.getByText("订阅服务尚未连接")).toBeInTheDocument();
    expect(screen.queryByText("1,284")).not.toBeInTheDocument();
  });

  it("logs in through the injected IAM service", async () => {
    const service = createService();
    service.getCurrentProfile = vi.fn(async () => { throw new NewsAccountAuthenticationRequiredError(); });
    render(<NewsPcAccount service={service} />);
    await screen.findByText("登录 SDKWork News");
    fireEvent.change(screen.getByLabelText("账号"), { target: { value: "user" } });
    fireEvent.change(screen.getByLabelText("密码"), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: "登录" }));
    await waitFor(() => expect(service.login).toHaveBeenCalledWith({ password: "secret", username: "user" }));
  });

  it("renders the complete showcase account hierarchy in demo mode", () => {
    render(<NewsPcAccount demoMode />);

    expect(screen.getByText("我的收藏")).toBeInTheDocument();
    expect(screen.getByText("语言与地区")).toBeInTheDocument();
    expect(screen.getByText("隐私控制")).toBeInTheDocument();
    expect(screen.getByText("帮助与支持")).toBeInTheDocument();
  });

  it("supports account detail navigation and local preference updates", () => {
    render(<NewsPcAccount demoMode />);

    fireEvent.click(screen.getByRole("button", { name: /语言与地区简体中文/u }));
    fireEvent.click(screen.getByRole("radio", { name: /English/u }));
    fireEvent.click(screen.getByRole("button", { name: "返回我的" }));
    expect(screen.getByRole("button", { name: /语言与地区English/u })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /我的收藏3/u }));
    expect(screen.getByText("AI Agent 开始进入企业核心工作流，评估标准正在改变")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /取消收藏 AI Agent/u }));
    expect(screen.queryByText("AI Agent 开始进入企业核心工作流，评估标准正在改变")).not.toBeInTheDocument();
  });

  it("supports leaving and re-entering the demo account", () => {
    render(<NewsPcAccount demoMode />);

    fireEvent.click(screen.getByRole("button", { name: "退出演示账户" }));
    expect(screen.getByRole("heading", { name: "演示账户已退出" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "重新进入演示账户" }));
    expect(screen.getByRole("heading", { level: 2, name: "林然" })).toBeInTheDocument();
  });

  it("never reveals an injected production profile after leaving demo mode", async () => {
    const service = createService({ displayName: "Production User" });
    render(<NewsPcAccount demoMode service={service} />);

    fireEvent.click(screen.getByRole("button", { name: "退出演示账户" }));
    expect(screen.queryByText("Production User")).not.toBeInTheDocument();
    await waitFor(() => expect(service.getCurrentProfile).toHaveBeenCalled());
    expect(screen.getByRole("heading", { name: "演示账户已退出" })).toBeInTheDocument();
  });
});

function createService(
  profile: NewsAccountProfile = { displayName: "Lin Ran" },
): NewsAccountService {
  return {
    getCurrentProfile: vi.fn(async () => profile),
    login: vi.fn(async () => profile),
    logout: vi.fn(async () => undefined),
  };
}
