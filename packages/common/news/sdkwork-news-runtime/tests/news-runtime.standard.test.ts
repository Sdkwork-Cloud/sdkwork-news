import { describe, expect, it } from "vitest";
import { createSdkworkNewsRuntime } from "../src/index.ts";

describe("sdkwork-news runtime", () => {
  it("binds service with sdkwork-news ownership metadata", () => {
    const runtime = createSdkworkNewsRuntime({ listPublished: async () => [], retrieveBySlug: async () => ({} as never) });
    expect(runtime.owner).toBe("sdkwork-news");
    expect(runtime.routeCount).toBe(84);
  });
});
