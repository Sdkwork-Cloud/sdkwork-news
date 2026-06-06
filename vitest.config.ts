import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@sdkwork/news-contracts": fileURLToPath(new URL("./packages/common/news/sdkwork-news-contracts/src/index.ts", import.meta.url)),
      "@sdkwork/news-sdk-ports": fileURLToPath(new URL("./packages/common/news/sdkwork-news-sdk-ports/src/index.ts", import.meta.url)),
      "@sdkwork/news-service": fileURLToPath(new URL("./packages/common/news/sdkwork-news-service/src/index.ts", import.meta.url)),
      "@sdkwork/news-runtime": fileURLToPath(new URL("./packages/common/news/sdkwork-news-runtime/src/index.ts", import.meta.url)),
      "@sdkwork/news-pc-react": fileURLToPath(new URL("./apps/sdkwork-news-pc/packages/news/sdkwork-news-pc-react/src/index.ts", import.meta.url)),
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
