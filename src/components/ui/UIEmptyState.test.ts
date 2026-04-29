import { fireEvent, render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import UIEmptyState from "@/components/ui/UIEmptyState.vue";

describe("UIEmptyState", () => {
  it("renders large variant and emits action", async () => {
    const { emitted } = render(UIEmptyState, {
      props: {
        variant: "large",
        title: "No leagues match this sport filter",
        description: "Try another sport.",
        actionLabel: "Show all sports",
      },
    });

    const actionButton = screen.getByRole("button", { name: "Show all sports" });
    await fireEvent.click(actionButton);

    expect(screen.getByText("No leagues match this sport filter")).toBeTruthy();
    expect(emitted().action).toHaveLength(1);
  });

  it("renders small variant without action button", () => {
    render(UIEmptyState, {
      props: {
        variant: "small",
        title: "No leagues match your search",
        description: "Try another term.",
      },
    });

    expect(screen.getByText("No leagues match your search")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
