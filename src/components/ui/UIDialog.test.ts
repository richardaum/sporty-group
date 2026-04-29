import { render, within } from "@testing-library/vue";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import UIDialog from "@/components/ui/UIDialog.vue";

describe("UIDialog", () => {
  it("renders dialog semantics and slot content when open", () => {
    render(UIDialog, {
      props: {
        isOpen: true,
        ariaLabel: "Badge result dialog",
      },
      slots: {
        default: "<p>Dialog content</p>",
      },
    });

    expect(within(document.body).getByRole("dialog", { name: "Badge result dialog" })).toBeTruthy();
    expect(within(document.body).getByText("Dialog content")).toBeTruthy();
  });

  it("does not render a dialog when closed", () => {
    render(UIDialog, {
      props: {
        isOpen: false,
        ariaLabel: "Closed dialog case",
      },
    });

    expect(within(document.body).queryByRole("dialog", { name: "Closed dialog case" })).toBeNull();
  });

  it("applies configurable width css variables", () => {
    const wrapper = mount(UIDialog, {
      props: {
        isOpen: true,
        ariaLabel: "Size dialog",
        desktopWidth: "72vw",
        mobileWidth: "100vw",
      },
      slots: {
        default: "<p>Dialog content</p>",
      },
      attachTo: document.body,
    });

    const dialog = wrapper.get('[role="dialog"]');
    const style = dialog.attributes("style");

    expect(style).toContain("--ui-dialog-width-desktop: 72vw;");
    expect(style).toContain("--ui-dialog-width-mobile: 100vw;");
  });
});
