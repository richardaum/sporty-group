import type { Preview } from "@storybook/vue3-vite";
import "../src/style.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "canvas",
      values: [
        { name: "canvas", value: "var(--color-bg-canvas)" },
        { name: "surface", value: "var(--color-bg-surface)" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
  },
};

export default preview;
