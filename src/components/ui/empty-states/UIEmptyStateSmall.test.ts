import { render, within } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import UIEmptyStateSmall from "@/components/ui/empty-states/UIEmptyStateSmall.vue";

describe("UIEmptyStateSmall", () => {
  it("renders title and description", () => {
    render(UIEmptyStateSmall, {
      props: {
        title: "No search results",
        description: "Try another query.",
      },
    });

    expect(within(document.body).getByText("No search results")).toBeTruthy();
    expect(within(document.body).getByText("Try another query.")).toBeTruthy();
  });
});
