import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Card from "./UICard.vue";
import Button from "./UIButton.vue";

const meta = {
  title: "Design System/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: { Card },
    template: `
      <Card>
        <template #header>
          <h3 class="title-sm">League insights</h3>
          <p class="subtitle">Compact card layout with explicit structure.</p>
        </template>
        <p class="subtitle">Surface card for grouped content.</p>
        <template #footer>
          <a href="#" class="card-link">Learn more</a>
        </template>
      </Card>
    `,
  }),
};

export const ControlsGroup: Story = {
  render: () => ({
    components: { Card, Button },
    template: `
      <Card interactive>
        <template #header>
          <p class="field-label">Actions</p>
        </template>
        <p class="subtitle">Use footer slot for primary actions.</p>
        <template #footer>
          <Button size="sm">Primary</Button>
          <Button variant="ghost" size="sm">Secondary</Button>
        </template>
      </Card>
    `,
  }),
};
