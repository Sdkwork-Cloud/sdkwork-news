import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import type { AiStoreService } from "@sdkwork/news-ai-store-service";
import { useAiStoreController } from "../src/index.js";

function Harness({ service }: { service?: AiStoreService }) {
  const controller = useAiStoreController(service);
  const entry = controller.entries[0];
  return <div>
    <span>{controller.status}</span>
    {entry && <span>{entry.name}</span>}
    <button onClick={() => entry && void controller.installProduct(entry)} type="button">install</button>
    <button onClick={() => controller.selectKind("skill")} type="button">skills</button>
    <button onClick={() => entry && void controller.openSkillInstaller(entry)} type="button">prepare</button>
    <button onClick={() => void controller.installSkill("artifact-1")} type="button">install skill</button>
    <span>{controller.skillInstaller.status}</span>
  </div>;
}

function createService(): AiStoreService {
  return {
    installProduct: vi.fn(async () => ({ libraryItemId: "library-1" })),
    installSkill: vi.fn(async () => undefined),
    list: vi.fn(async ({ kind }) => ({
      hasMore: false,
      items: kind === "product" ? [{
        action: "install-product" as const,
        description: "Research",
        id: "product-1",
        kind: "product" as const,
        name: "Deep Research",
        tags: [],
      }] : [{
        action: "select-skill-artifact" as const,
        description: "Finance",
        id: "skill-1",
        kind: "skill" as const,
        name: "Financial Reader",
        packageId: "package-1",
        tags: [],
      }],
    })),
    listSkillArtifacts: vi.fn(async () => [{
      id: "artifact-1",
      invocationKind: "local-workflow",
      status: "published" as const,
      version: "1.0.0",
    }]),
    uninstallProduct: vi.fn(async () => undefined),
  };
}

describe("useAiStoreController", () => {
  it("fails closed without a service", () => {
    render(<Harness />);
    expect(screen.getByText("unavailable")).toBeInTheDocument();
  });

  it("delegates product installation and updates the entry", async () => {
    const service = createService();
    render(<Harness service={service} />);
    await screen.findByText("Deep Research");
    fireEvent.click(screen.getByRole("button", { name: "install" }));
    await waitFor(() => expect(service.installProduct).toHaveBeenCalledWith("product-1"));
  });

  it("requires the published artifact selected by the user", async () => {
    const service = createService();
    render(<Harness service={service} />);
    await screen.findByText("Deep Research");
    fireEvent.click(screen.getByRole("button", { name: "skills" }));
    await screen.findByText("Financial Reader");
    fireEvent.click(screen.getByRole("button", { name: "prepare" }));
    await screen.findByText("ready");
    fireEvent.click(screen.getByRole("button", { name: "install skill" }));
    await waitFor(() => expect(service.installSkill).toHaveBeenCalledWith(
      "package-1",
      "artifact-1",
    ));
  });
});
