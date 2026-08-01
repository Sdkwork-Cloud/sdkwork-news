import type { SdkworkAppClient } from "@sdkwork/iam-app-sdk";
import { describe, expect, it, vi } from "vitest";
import { createIamNewsAccountPort } from "../src/index.js";

describe("createIamNewsAccountPort", () => {
  it("maps only verifiable IAM identity fields", async () => {
    const retrieve = vi.fn(async () => ({
      displayName: "Lin Ran",
      email: "lin@example.test",
      id: "user-1",
    }));
    const client = {
      auth: { sessions: { create: vi.fn(), current: { delete: vi.fn() } } },
      iam: { users: { current: { retrieve } } },
    } as unknown as SdkworkAppClient;
    const port = createIamNewsAccountPort(client, {
      clearSession: vi.fn(),
      commitSession: vi.fn(),
    });
    await expect(port.getCurrentProfile()).resolves.toEqual({
      displayName: "Lin Ran",
      email: "lin@example.test",
      id: "user-1",
    });
  });
});
