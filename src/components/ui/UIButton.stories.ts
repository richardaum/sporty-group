import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { PhArrowRight, PhPlus } from "@phosphor-icons/vue";
import Button from "./UIButton.vue";

const meta = {
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
  },
  render: (args) => ({
    components: { Button, PhArrowRight, PhPlus },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Action</Button>',
  }),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const Sizes: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="button-row">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    components: { Button, PhArrowRight, PhPlus },
    template: `
      <div class="button-row">
        <Button>
          <template #leading>
            <PhPlus :size="16" />
          </template>
          Create
        </Button>
        <Button variant="secondary">
          Continue
          <template #trailing>
            <PhArrowRight :size="16" />
          </template>
        </Button>
      </div>
    `,
  }),
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
