import { describe, expect, it, vi } from "vitest";
import {
  createAiStoreService,
  type AiStorePort,
} from "../src/index.js";

function createPort(): AiStorePort {
  return {
    installProduct: vi.fn(async () => ({ libraryItemId: "library-1" })),
    installSkill: vi.fn(async () => undefined),
    list: vi.fn(async () => ({ hasMore: false, items: [] })),
    listSkillArtifacts: vi.fn(async () => []),
    uninstallProduct: vi.fn(async () => undefined),
  };
}

describe("createAiStoreService", () => {
  it("normalizes bounded server page input", async () => {
    const port = createPort();
    const service = createAiStoreService(port);
    await service.list({ cursor: " next ", kind: "product", q: " agent " });
    expect(port.list).toHaveBeenCalledWith({
      cursor: "next",
      kind: "product",
      pageSize: 20,
      q: "agent",
    });
  });

  it("requires an explicit skill artifact before installation", () => {
    const service = createAiStoreService(createPort());
    expect(() => service.installSkill("package-1", " ")).toThrow("skill artifact");
  });
});
