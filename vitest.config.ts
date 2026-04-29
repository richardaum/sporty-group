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
        lines: 82.26,
        functions: 85.71,
        branches: 69.23,
        statements: 82.72,
      },
    },
  },
});
