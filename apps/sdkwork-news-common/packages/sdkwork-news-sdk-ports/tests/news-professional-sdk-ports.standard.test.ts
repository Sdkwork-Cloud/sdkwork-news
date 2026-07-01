import { describe, expect, it } from "vitest";
import { NEWS_PROFESSIONAL_SDK_PORT_METHODS, createNewsSdkPortImplementationChecklist } from "../src/index.ts";

describe("sdkwork-news professional SDK port blueprint", () => {
  it("declares resource-style methods that generated SDK adapters must provide", () => {
    const methods = new Set(NEWS_PROFESSIONAL_SDK_PORT_METHODS.map((method) => method.methodKey));

    expect(NEWS_PROFESSIONAL_SDK_PORT_METHODS.length).toBeGreaterThanOrEqual(45);
    expect([...methods]).toEqual(
      expect.arrayContaining([
        "open.news.stories.list",
        "open.news.stories.retrieve",
        "open.news.items.schemaOrg.retrieve",
        "app.news.feed.following.list",
        "app.news.feed.latest.list",
        "app.news.items.shareEvents.create",
        "backend.news.stories.create",
        "backend.news.editorial.assignments.create",
        "backend.news.imports.ninjs.create",
        "backend.news.imports.newsmlG2.create",
        "backend.news.exports.schemaOrg.create",
        "backend.news.items.c2paProvenance.upsert",
      ]),
    );
  });

  it("keeps TODO handoff notes beside every planned SDK port method group", () => {
    const checklist = createNewsSdkPortImplementationChecklist();

    expect(checklist.length).toBeGreaterThanOrEqual(8);
    expect(checklist.every((item) => item.todo.startsWith("TODO"))).toBe(true);
  });
});
