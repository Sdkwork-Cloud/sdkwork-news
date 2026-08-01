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

  it("keeps showcase entries behind demo mode", () => {
    render(<NewsH5AiStore demoMode />);
    expect(screen.getByText("Deep Research")).toBeInTheDocument();
  });
});
