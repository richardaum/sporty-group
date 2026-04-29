import { render, within } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import UISelect from "@/components/ui/UISelect.vue";

const baseOptions = [
  { value: "all", label: "All sports" },
  { value: "soccer", label: "Soccer" },
];

describe("UISelect", () => {
  it("renders an explicit label when provided", () => {
    render(UISelect, {
      props: {
        id: "sport-select",
        modelValue: "soccer",
        label: "Sport filter",
        options: baseOptions,
      },
    });

    expect(within(document.body).getByText("Sport filter")).toBeTruthy();
    expect(within(document.body).getByRole("combobox", { name: "Select an option" })).toBeTruthy();
  });
});
