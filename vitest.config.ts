import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@sdkwork/news-contracts": fileURLToPath(new URL("./apps/sdkwork-news-common/packages/sdkwork-news-contracts/src/index.ts", import.meta.url)),
      "@sdkwork/news-sdk-ports": fileURLToPath(new URL("./apps/sdkwork-news-common/packages/sdkwork-news-sdk-ports/src/index.ts", import.meta.url)),
      "@sdkwork/news-service": fileURLToPath(new URL("./apps/sdkwork-news-common/packages/sdkwork-news-service/src/index.ts", import.meta.url)),
      "@sdkwork/news-runtime": fileURLToPath(new URL("./apps/sdkwork-news-common/packages/sdkwork-news-runtime/src/index.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "packages/**/*.test.ts",
      "apps/**/*.test.ts",
      "apps/**/*.test.tsx"
    ]
  }
});
