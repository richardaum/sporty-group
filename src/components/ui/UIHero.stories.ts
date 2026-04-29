import type { Meta, StoryObj } from "@storybook/vue3-vite";
import UIHero from "@/components/ui/UIHero.vue";
import leagueHeroImage from "@/assets/leagues/league-hero.jpg";

const meta = {
  title: "Design System/Hero",
  component: UIHero,
  tags: ["autodocs"],
  args: {
    kicker: "Sporty Group",
    title: "Premier League",
    description: "Soccer league catalog from TheSportsDB. Alternate title: EPL.",
    imageSrc: leagueHeroImage,
  },
} satisfies Meta<typeof UIHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IceHockey: Story = {
  args: {
    title: "National Hockey League",
    description: "Ice Hockey league catalog from TheSportsDB. Alternate title: NHL.",
  },
};
