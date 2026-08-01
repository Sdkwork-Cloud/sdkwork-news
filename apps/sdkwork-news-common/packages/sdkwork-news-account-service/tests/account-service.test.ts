import { describe, expect, it, vi } from "vitest";
import {
  createNewsAccountService,
  type NewsAccountPort,
} from "../src/index.js";

describe("createNewsAccountService", () => {
  it("validates credentials before delegating login", async () => {
    const port: NewsAccountPort = {
      getCurrentProfile: vi.fn(),
      login: vi.fn(async () => ({ displayName: "User" })),
      logout: vi.fn(),
    };
    const service = createNewsAccountService(port);
    await service.login({ password: " secret ", username: " user " });
    expect(port.login).toHaveBeenCalledWith({ password: "secret", username: "user" });
    expect(() => service.login({ password: "", username: "user" })).toThrow("password");
  });
});
