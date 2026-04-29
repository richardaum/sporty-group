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
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,vue}"],
      exclude: ["**/*.test.ts", "**/*.stories.ts"],
      thresholds: {
        autoUpdate: true,
        lines: 85.99,
        functions: 90.03,
        branches: 75.52,
        statements: 86.68,
      },
    },
  },
});
