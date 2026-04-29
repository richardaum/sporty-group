import { shallowRef } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Select from "@/components/ui/UISelect.vue";

const options = [
  { value: "all", label: "All sports" },
  { value: "soccer", label: "Soccer" },
  { value: "basketball", label: "Basketball" },
  { value: "motorsport", label: "Motorsport" },
];

const meta = {
  title: "Design System/Select",
  component: Select,
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    modelValue: undefined,
    options,
  },
  render: () => ({
    components: { Select },
    setup() {
      const model = shallowRef<string | undefined>(undefined);
      return { model, options };
    },
    template: `
      <Select
        id="sport-select"
        v-model="model"
        label="Sport"
        placeholder="Choose a sport"
        :options="options"
      />
    `,
  }),
};

export const Error: Story = {
  args: {
    modelValue: undefined,
    options,
  },
  render: () => ({
    components: { Select },
    setup() {
      const model = shallowRef<string | undefined>(undefined);
      return { model, options };
    },
    template: `
      <Select
        id="sport-select-error"
        v-model="model"
        label="Sport"
        placeholder="Choose a sport"
        :options="options"
        :has-error="true"
        error-text="Please select a sport before continuing."
      />
    `,
  }),
};

export const Disabled: Story = {
  args: {
    modelValue: "soccer",
    options,
  },
  render: () => ({
    components: { Select },
    setup() {
      const model = shallowRef("soccer");
      return { model, options };
    },
    template: `
      <Select
        id="sport-select-disabled"
        v-model="model"
        label="Sport"
        :options="options"
        :disabled="true"
      />
    `,
  }),
};
