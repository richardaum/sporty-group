import type { Meta, StoryObj } from "@storybook/vue3-vite";
import UIItemNavigator from "@/components/ui/UIItemNavigator.vue";

interface DemoItem {
  imageSrc: string;
  imageAlt: string;
  label: string;
}

const demoItems: DemoItem[] = [
  {
    imageSrc: "https://www.thesportsdb.com/images/media/league/badge/xqwpvx1421854768.png",
    imageAlt: "Season badge for 2024-2025",
    label: "2024-2025",
  },
  {
    imageSrc: "https://www.thesportsdb.com/images/media/league/badge/4otg6r1579704786.png",
    imageAlt: "Season badge for 2023-2024",
    label: "2023-2024",
  },
  {
    imageSrc: "https://www.thesportsdb.com/images/media/league/badge/ljy0rk1519305110.png",
    imageAlt: "Season badge for 2022-2023",
    label: "2022-2023",
  },
];

const meta = {
  title: "Design System/Item Navigator",
  tags: ["autodocs"],
  args: {
    items: demoItems,
    previousLabel: "Show previous badge",
    nextLabel: "Show next badge",
  },
  render: (args) => ({
    components: { UIItemNavigator },
    setup() {
      return { args };
    },
    template: `
      <UIItemNavigator v-bind="args">
        <template #default="{ currentItem }">
          <figure style="display:grid;gap:0.5rem;justify-items:center;margin:0;">
            <img :src="currentItem.imageSrc" :alt="currentItem.imageAlt" style="width:min(14rem,100%);" />
            <figcaption style="color:var(--color-text-secondary);font-size:0.9rem;">
              Season {{ currentItem.label }}
            </figcaption>
          </figure>
        </template>
      </UIItemNavigator>
    `,
  }),
} satisfies Meta<{
  items: DemoItem[];
  previousLabel?: string;
  nextLabel?: string;
  showPosition?: boolean;
}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: demoItems,
  },
};

export const SingleItem: Story = {
  args: {
    items: [demoItems[0]],
  },
};

export const HiddenPosition: Story = {
  args: {
    items: demoItems,
    showPosition: false,
  },
};
