import { fireEvent, render, within } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import UIInput from "@/components/ui/UIInput.vue";

describe("UIInput", () => {
  it("renders label, helper text and updates model value", async () => {
    render(UIInput, {
      props: {
        id: "league-search",
        modelValue: "",
        label: "League search",
        helperText: "Type to filter leagues",
        "onUpdate:modelValue": () => {},
      },
    });

    expect(within(document.body).getByText("League search")).toBeTruthy();
    expect(within(document.body).getByText("Type to filter leagues")).toBeTruthy();

    const input = within(document.body).getByRole("textbox") as HTMLInputElement;
    await fireEvent.update(input, "prem");
    expect(input.value).toBe("prem");
  });

  it("renders error message when hasError is true", () => {
    render(UIInput, {
      props: {
        id: "league-search-error",
        modelValue: "",
        hasError: true,
        errorText: "Search term is required",
        "onUpdate:modelValue": () => {},
      },
      slots: {
        leading: "<span>🔎</span>",
        trailing: "<span>⌘K</span>",
      },
    });

    expect(within(document.body).getByText("Search term is required")).toBeTruthy();
  });
});
