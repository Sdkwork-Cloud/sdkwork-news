import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import type { NewsAccountService } from "@sdkwork/news-account-service";
import { NewsH5Account } from "../src/index.js";

describe("NewsH5Account production state", () => {
  it("fails closed without IAM service", () => {
    render(<NewsH5Account />);
    expect(screen.getByText("账号服务未连接")).toBeInTheDocument();
    expect(screen.queryByText("林然")).not.toBeInTheDocument();
  });

  it("renders only verified profile and unavailable authority gaps", async () => {
    const service: NewsAccountService = {
      getCurrentProfile: vi.fn(async () => ({ displayName: "Lin Ran", email: "lin@example.test" })),
      login: vi.fn(),
      logout: vi.fn(async () => undefined),
    };
    render(<NewsH5Account service={service} />);
    expect(await screen.findByText("Lin Ran")).toBeInTheDocument();
    expect(screen.getAllByText("暂不可用").length).toBeGreaterThan(2);
    expect(screen.queryByText("3,892")).not.toBeInTheDocument();
  });

  it("keeps showcase identity behind demo mode", () => {
    render(<NewsH5Account demoMode />);
    expect(screen.getByText("林然")).toBeInTheDocument();
    expect(screen.getByText("我的收藏")).toBeInTheDocument();
    expect(screen.getByText("语言与地区")).toBeInTheDocument();
    expect(screen.getByText("隐私控制")).toBeInTheDocument();
    expect(screen.getByText("帮助与支持")).toBeInTheDocument();
  });
});
