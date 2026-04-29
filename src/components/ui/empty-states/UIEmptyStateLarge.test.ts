import { fireEvent, render, within } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import UIEmptyStateLarge from "@/components/ui/empty-states/UIEmptyStateLarge.vue";

describe("UIEmptyStateLarge", () => {
  it("renders content and emits action on button click", async () => {
    const { emitted } = render(UIEmptyStateLarge, {
      props: {
        title: "No data available",
        description: "Try another filter.",
        actionLabel: "Retry",
      },
    });

    expect(within(document.body).getByText("No data available")).toBeTruthy();
    await fireEvent.click(within(document.body).getByRole("button", { name: "Retry" }));
    expect(emitted().action).toHaveLength(1);
  });
});
