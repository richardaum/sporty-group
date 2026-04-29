import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import UISquareBadge from "@/components/ui/UISquareBadge.vue";

describe("UISquareBadge", () => {
  it("renders slot content", () => {
    render(UISquareBadge, {
      slots: {
        default: "Premier League",
      },
    });

    expect(screen.getByText("Premier League")).toBeTruthy();
  });
});
