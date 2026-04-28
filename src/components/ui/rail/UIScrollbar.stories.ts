import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Scrollbar from "./UIScrollbar.vue";
import Card from "../UICard.vue";

const meta = {
  title: "Design System/Scrollbar",
  component: Scrollbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Vue 3 port of the React `mac-scrollbar` (`MacScrollbar`) component, adapted as a scoped-style SFC for this design system.",
      },
    },
  },
} satisfies Meta<typeof Scrollbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HorizontalRail: Story = {
  render: () => ({
    components: { Scrollbar, Card },
    template: `
      <Scrollbar skin="dark" style="max-width: 100%; overflow-x: auto; overflow-y: hidden; padding-bottom: 8px;">
        <ul style="display:flex; gap: 16px; list-style:none; padding:0; margin:0; min-width:max-content;">
          <li v-for="item in 10" :key="item" style="width: 280px;">
            <Card interactive>
              <h3 class="title-sm">League {{ item }}</h3>
              <p class="subtitle">Horizontal rail with custom macOS-like scrollbar.</p>
            </Card>
          </li>
        </ul>
      </Scrollbar>
    `,
  }),
};

export const VerticalPanel: Story = {
  render: () => ({
    components: { Scrollbar },
    template: `
      <Scrollbar
        skin="light"
        style="height: 280px; max-width: 460px; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 12px;"
      >
        <div style="display:grid; gap: 12px;">
          <article v-for="item in 18" :key="item" style="padding: 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md);">
            <strong>Update {{ item }}</strong>
            <p style="margin: 8px 0 0;">Live feed item with text that forces vertical scrolling.</p>
          </article>
        </div>
      </Scrollbar>
    `,
  }),
};
