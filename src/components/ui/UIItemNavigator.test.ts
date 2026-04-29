import { fireEvent, render, screen } from "@testing-library/vue";
import { defineComponent } from "vue";
import { describe, expect, it } from "vitest";
import UIItemNavigator from "@/components/ui/UIItemNavigator.vue";

const TestHost = defineComponent({
  components: { UIItemNavigator },
  props: {
    items: {
      type: Array as () => string[],
      required: true,
    },
  },
  template: `
    <UIItemNavigator :items="items" previous-label="Previous badge" next-label="Next badge">
      <template #default="{ currentItem }">
        <p data-testid="current-item">{{ currentItem }}</p>
      </template>
    </UIItemNavigator>
  `,
});

describe("UIItemNavigator", () => {
  it("renders slot content for current item", () => {
    render(TestHost, {
      props: {
        items: ["2024-2025"],
      },
    });

    expect(screen.getByTestId("current-item").textContent).toBe("2024-2025");
    expect(screen.queryByRole("button", { name: "Previous badge" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Next badge" })).toBeNull();
  });

  it("moves forward and backward with navigator controls", async () => {
    render(TestHost, {
      props: {
        items: ["2024-2025", "2023-2024", "2022-2023"],
      },
    });

    const previousButton = screen.getByRole("button", { name: "Previous badge" });
    const nextButton = screen.getByRole("button", { name: "Next badge" });

    expect(previousButton.hasAttribute("disabled")).toBe(true);
    expect(nextButton.hasAttribute("disabled")).toBe(false);
    expect(screen.getByText("1 / 3")).toBeTruthy();

    await fireEvent.click(nextButton);
    expect(screen.getAllByTestId("current-item").at(-1)?.textContent).toBe("2023-2024");
    expect(screen.getByText("2 / 3")).toBeTruthy();

    await fireEvent.click(nextButton);
    expect(screen.getAllByTestId("current-item").at(-1)?.textContent).toBe("2022-2023");
    expect(previousButton.hasAttribute("disabled")).toBe(false);
    expect(nextButton.hasAttribute("disabled")).toBe(true);

    await fireEvent.click(previousButton);
    expect(screen.getAllByTestId("current-item").at(-1)?.textContent).toBe("2023-2024");
  });
});
