import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,vue}"],
      exclude: ["**/*.test.ts", "**/*.stories.ts"],
      thresholds: {
        autoUpdate: true,
        lines: 80.49,
        functions: 80.89,
        branches: 66.41,
        statements: 80.71,
      },
    },
  },
});
