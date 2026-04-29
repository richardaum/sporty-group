import type { Meta, StoryObj } from "@storybook/vue3-vite";
import UICard from "@/components/ui/UICard.vue";
import UITypography from "@/components/ui/UITypography.vue";
import UIRailTrack from "@/components/ui/rail/UIRailTrack.vue";

interface TrackStoryItem {
  id: string;
  headline: string;
  supportingText: string;
}

const sampleItems: TrackStoryItem[] = [
  { id: "item-01", headline: "Featured Content", supportingText: "Primary metadata" },
  { id: "item-02", headline: "Trending Update", supportingText: "Secondary metadata" },
  { id: "item-03", headline: "Latest Release", supportingText: "Supporting description" },
  { id: "item-04", headline: "Curated Pick", supportingText: "Contextual note" },
  { id: "item-05", headline: "Recommended Item", supportingText: "Additional details" },
];

function asStoryItem(item: unknown): TrackStoryItem {
  return item as TrackStoryItem;
}

function getStoryKey(item: unknown): string {
  return asStoryItem(item).id;
}

const meta = {
  title: "Design System/Rail Track",
  component: UIRailTrack,
  tags: ["autodocs"],
} satisfies Meta<typeof UIRailTrack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: sampleItems,
    showControls: true,
  },
  render: () => ({
    components: { UIRailTrack, UICard, UITypography },
    setup() {
      return { asStoryItem, getStoryKey, sampleItems };
    },
    template: `
      <UIRailTrack
        :items="sampleItems"
        aria-label="Sample leagues"
        :get-key="getStoryKey"
      >
        <template #default="{ item }">
          <UICard interactive>
            <UITypography as="h3" variant="titleSm">{{ asStoryItem(item).headline }}</UITypography>
            <UITypography as="p" variant="muted">{{ asStoryItem(item).supportingText }}</UITypography>
          </UICard>
        </template>
      </UIRailTrack>
    `,
  }),
};

export const StaticList: Story = {
  args: {
    items: sampleItems.slice(0, 3),
    scrollable: false,
  },
  render: () => ({
    components: { UIRailTrack, UICard, UITypography },
    setup() {
      return { asStoryItem, getStoryKey, sampleItems };
    },
    template: `
      <UIRailTrack
        :items="sampleItems.slice(0, 3)"
        aria-label="Static rail"
        :scrollable="false"
        :get-key="getStoryKey"
      >
        <template #default="{ item, index }">
          <UICard>
            <UITypography as="p" variant="kicker">Item {{ index + 1 }}</UITypography>
            <UITypography as="h3" variant="titleSm">{{ asStoryItem(item).headline }}</UITypography>
            <UITypography as="p" variant="muted">{{ asStoryItem(item).supportingText }}</UITypography>
          </UICard>
        </template>
      </UIRailTrack>
    `,
  }),
};

export const DarkScrollbar: Story = {
  args: {
    items: sampleItems,
    showControls: true,
    scrollbarSkin: "dark",
  },
  render: () => ({
    components: { UIRailTrack, UICard, UITypography },
    setup() {
      return { asStoryItem, getStoryKey, sampleItems };
    },
    template: `
      <UIRailTrack
        :items="sampleItems"
        aria-label="Dark rail"
        scrollbar-skin="dark"
        :get-key="getStoryKey"
      >
        <template #default="{ item }">
          <UICard interactive>
            <UITypography as="h3" variant="titleSm">{{ asStoryItem(item).headline }}</UITypography>
            <UITypography as="p" variant="muted">{{ asStoryItem(item).supportingText }}</UITypography>
          </UICard>
        </template>
      </UIRailTrack>
    `,
  }),
};
