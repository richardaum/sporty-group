import type { Meta, StoryObj } from "@storybook/vue3-vite";
import UIBadgeLookup from "@/components/ui/UIBadgeLookup.vue";

const meta = {
  title: "Design System/Badge Lookup",
  component: UIBadgeLookup,
  tags: ["autodocs"],
  args: {
    title: "Preview",
    hasSelection: true,
    selectedLabel: "Premier League",
    isLoading: false,
    isError: false,
    previewAsset: {
      imageSrc: "https://www.thesportsdb.com/images/media/league/badge/xqwpvx1421854768.png",
      imageAlt: "Season badge for Premier League",
      strSeason: "2024-2025",
      caption: "Season: 2024-2025",
    },
    idleMessage: "Select an item to load a preview.",
    loadingMessage: "Loading preview for {label}...",
    errorMessage: "Could not load preview right now. Try selecting the item again.",
    emptyResultMessage: "No preview is available for {label}.",
  },
} satisfies Meta<typeof UIBadgeLookup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPreview: Story = {};

export const MultipleSeasons: Story = {
  args: {
    previewAssets: [
      {
        imageSrc: "https://www.thesportsdb.com/images/media/league/badge/xqwpvx1421854768.png",
        imageAlt: "Season badge for Premier League 2024-2025",
        strSeason: "2024-2025",
      },
      {
        imageSrc: "https://www.thesportsdb.com/images/media/league/badge/4otg6r1579704786.png",
        imageAlt: "Season badge for Premier League 2023-2024",
        strSeason: "2023-2024",
      },
      {
        imageSrc: "https://www.thesportsdb.com/images/media/league/badge/ljy0rk1519305110.png",
        imageAlt: "Season badge for Premier League 2022-2023",
        strSeason: "2022-2023",
      },
    ],
  },
};

export const Idle: Story = {
  args: {
    hasSelection: false,
    selectedLabel: "",
    previewAsset: null,
  },
};

export const Loading: Story = {
  args: {
    hasSelection: true,
    isLoading: true,
    previewAsset: null,
  },
};

export const Error: Story = {
  args: {
    hasSelection: true,
    isError: true,
    previewAsset: null,
  },
};

export const NoResult: Story = {
  args: {
    hasSelection: true,
    isLoading: false,
    isError: false,
    previewAsset: null,
  },
};
