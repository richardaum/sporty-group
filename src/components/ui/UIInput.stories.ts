import { shallowRef } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { PhMagnifyingGlass, PhXCircle } from "@phosphor-icons/vue";
import Input from "./UIInput.vue";

const meta = {
  title: "Design System/Input",
  component: Input,
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    modelValue: "",
  },
  render: () => ({
    components: { Input },
    setup() {
      const model = shallowRef("");
      return { model };
    },
    template: `
      <Input
        id="league-search"
        v-model="model"
        label="Search leagues"
        helper-text="Type at least 3 characters to narrow results."
        placeholder="Type a league name"
      />
    `,
  }),
};

export const WithIcon: Story = {
  args: {
    modelValue: "",
  },
  render: () => ({
    components: { Input, PhMagnifyingGlass, PhXCircle },
    setup() {
      const model = shallowRef("");
      return { model };
    },
    template: `
      <Input
        id="search-with-icons"
        v-model="model"
        label="Search"
        helper-text="Leading and trailing icon slots are both supported."
        placeholder="Search league"
      >
        <template #leading>
          <PhMagnifyingGlass :size="18" />
        </template>
        <template #trailing>
          <PhXCircle :size="18" />
        </template>
      </Input>
    `,
  }),
};

export const Error: Story = {
  args: {
    modelValue: "Invalid league",
  },
  render: () => ({
    components: { Input },
    setup() {
      const model = shallowRef("Invalid league");
      return { model };
    },
    template: `
      <Input
        id="search-error"
        v-model="model"
        label="League"
        :has-error="true"
        error-text="Invalid league name. Please refine your query."
      />
    `,
  }),
};

export const Disabled: Story = {
  args: {
    modelValue: "Premier League",
  },
  render: () => ({
    components: { Input },
    setup() {
      const model = shallowRef("Premier League");
      return { model };
    },
    template: `
      <Input
        id="search-disabled"
        v-model="model"
        label="League"
        helper-text="Input is disabled while data is loading."
        :disabled="true"
      />
    `,
  }),
};
