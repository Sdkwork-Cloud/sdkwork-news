import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import type { AiStoreService } from "@sdkwork/news-ai-store-service";
import { NewsH5AiStore } from "../src/index.js";

function createService(): AiStoreService {
  return {
    installProduct: vi.fn(async () => ({ libraryItemId: "library-1" })),
    installSkill: vi.fn(async () => undefined),
    list: vi.fn(async () => ({ hasMore: false, items: [{ action: "install-product" as const, description: "真实产品", id: "product-1", kind: "product" as const, name: "Deep Research", tags: [] }] })),
    listSkillArtifacts: vi.fn(async () => []),
    uninstallProduct: vi.fn(async () => undefined),
  };
}

describe("NewsH5AiStore production state", () => {
  it("fails closed without an injected service", () => {
    render(<NewsH5AiStore />);
    expect(screen.getByText("AI Store 服务未连接")).toBeInTheDocument();
    expect(screen.queryByText("Deep Research")).not.toBeInTheDocument();
  });

  it("delegates real product installation", async () => {
    const service = createService();
    render(<NewsH5AiStore service={service} />);
    await screen.findByText("Deep Research");
    fireEvent.click(screen.getByRole("button", { name: "安装 Deep Research" }));
    await waitFor(() => expect(service.installProduct).toHaveBeenCalledWith("product-1"));
  });

  it("opens a production entry detail and restores the tab bar state", async () => {
    const service = createService();
    const onSecondaryPageChange = vi.fn();
    render(<NewsH5AiStore
      onSecondaryPageChange={onSecondaryPageChange}
      service={service}
    />);
    await screen.findByText("Deep Research");

    fireEvent.click(screen.getByRole("button", { name: "查看 Deep Research" }));
    expect(screen.getByRole("heading", { level: 1, name: "Deep Research" })).toBeInTheDocument();
    expect(screen.getByText("真实产品")).toBeInTheDocument();
    expect(onSecondaryPageChange).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole("button", { name: "返回 AI Store" }));
    expect(screen.getByRole("button", { name: "查看 Deep Research" })).toBeInTheDocument();
    expect(onSecondaryPageChange).toHaveBeenLastCalledWith(false);
  });

  it("keeps showcase entries behind demo mode", () => {
    render(<NewsH5AiStore demoMode />);
    expect(screen.getByText("Deep Research")).toBeInTheDocument();
  });

  it("searches showcase entries and installs a selected Skill version", () => {
    render(<NewsH5AiStore demoMode />);

    fireEvent.click(screen.getByRole("button", { name: "Skills" }));
    fireEvent.click(screen.getByRole("button", { name: "搜索 AI Store" }));
    fireEvent.change(screen.getByRole("textbox", { name: "搜索 AI Store" }), {
      target: { value: "Financial" },
    });
    fireEvent.click(screen.getByRole("button", { name: "搜索" }));

    expect(screen.getByText("“Financial”的结果")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "选择 Financial Reader 版本" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "安装 1.4.0" }));
    expect(screen.getByRole("button", { name: "已安装" })).toBeDisabled();
  });

  it("renders complete showcase metadata in entry details", () => {
    render(<NewsH5AiStore demoMode />);
    fireEvent.click(screen.getByRole("button", { name: "查看 Deep Research" }));
    expect(screen.getByText("免费试用")).toBeInTheDocument();
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByText("12.4k")).toBeInTheDocument();
    expect(screen.getByText("证据链")).toBeInTheDocument();
  });
});
