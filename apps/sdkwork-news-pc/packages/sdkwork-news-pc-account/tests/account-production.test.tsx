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
    expect(screen.getAllByText("暂不可用").length).toBeGreaterThan(2);
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
