import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Hero from "@/components/leagues/Hero.vue";
import leagueHeroImage from "@/assets/leagues/league-hero.jpg";

const meta = {
  title: "Features/Leagues/Hero",
  component: Hero,
  tags: ["autodocs"],
  args: {
    item: {
      idLeague: "4328",
      strLeague: "Premier League",
      strSport: "Soccer",
      strLeagueAlternate: "EPL",
    },
    imageSrc: leagueHeroImage,
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IceHockey: Story = {
  args: {
    item: {
      idLeague: "4366",
      strLeague: "National Hockey League",
      strSport: "Ice Hockey",
      strLeagueAlternate: "NHL",
    },
  },
};
