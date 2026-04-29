import { shallowRef } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import UIButton from "@/components/ui/UIButton.vue";
import UIDialog from "@/components/ui/UIDialog.vue";
import UIBadgeLookup from "@/components/ui/UIBadgeLookup.vue";

const meta = {
  title: "Design System/Dialog",
  component: UIDialog,
  tags: ["autodocs"],
  args: {
    ariaLabel: "Preview dialog",
    desktopWidth: "80%",
    mobileWidth: "100%",
  },
} satisfies Meta<typeof UIDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: false,
  },
  render: (args) => ({
    components: { UIButton, UIDialog, UIBadgeLookup },
    setup() {
      const isOpen = shallowRef(false);

      function openDialog() {
        isOpen.value = true;
      }

      function closeDialog() {
        isOpen.value = false;
      }

      return {
        args,
        isOpen,
        openDialog,
        closeDialog,
      };
    },
    template: `
      <div>
        <UIButton @click="openDialog">Open dialog</UIButton>
        <UIDialog
          :is-open="isOpen"
          :aria-label="args.ariaLabel"
          :desktop-width="args.desktopWidth"
          :mobile-width="args.mobileWidth"
          @close="closeDialog"
        >
          <UIBadgeLookup
            title="League badge lookup"
            :has-selection="true"
            selected-label="Premier League"
            :preview-asset="{
              imageSrc: 'https://www.thesportsdb.com/images/media/league/badge/xqwpvx1421854768.png',
              imageAlt: 'Season badge for Premier League',
              strSeason: '2024-2025',
              caption: 'Season: 2024-2025'
            }"
          />
        </UIDialog>
      </div>
    `,
  }),
};
