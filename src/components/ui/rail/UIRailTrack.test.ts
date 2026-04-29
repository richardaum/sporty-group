/* eslint-disable testing-library/no-container, testing-library/no-node-access -- this suite validates rail geometry and scroll behavior (bleed/snap/wheel), which requires direct DOM measurement and node access in jsdom */
import { fireEvent, render, within } from "@testing-library/vue";
import { h, nextTick } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import UIRailTrack from "@/components/ui/rail/UIRailTrack.vue";

type ScrollToOptionsLike = {
  left?: number;
  behavior?: ScrollBehavior;
};

function makeItems(count: number) {
  return Array.from({ length: count }, (_, index) => ({ id: `id-${index}` }));
}

function setElementRect(
  element: Element,
  rect: {
    left: number;
    right: number;
    top?: number;
    bottom?: number;
    width?: number;
    height?: number;
  },
) {
  const width = rect.width ?? rect.right - rect.left;
  const height = rect.height ?? (rect.bottom ?? 0) - (rect.top ?? 0);
  const top = rect.top ?? 0;
  const bottom = rect.bottom ?? top + height;
  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () =>
      ({
        x: rect.left,
        y: top,
        left: rect.left,
        right: rect.right,
        top,
        bottom,
        width,
        height,
        toJSON: () => ({}),
      }) as DOMRect,
  });
}

describe("UIRailTrack functional behavior", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(
      (callback: FrameRequestCallback) => {
        callback(16);
        return 1;
      },
    );
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("applies bleed and navigation state from real geometry", async () => {
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1200,
    });

    const view = render(UIRailTrack, {
      props: {
        items: makeItems(4),
        ariaLabel: "Rail test",
        getKey: (item: unknown) => (item as { id: string }).id,
      },
      slots: {
        default: ({ item }: { item: unknown }) => h("article", (item as { id: string }).id),
      },
    });
    await nextTick();

    const railRoot = view.container.querySelector(".ui-rail-track") as HTMLElement;
    setElementRect(railRoot, { left: 100, right: 900, top: 0, bottom: 100 });

    const scrollEl = view.container.querySelector(".ui-scrollbar-scroller") as HTMLElement;
    Object.defineProperty(scrollEl, "clientWidth", { configurable: true, value: 320 });
    Object.defineProperty(scrollEl, "scrollWidth", { configurable: true, value: 800 });
    Object.defineProperty(scrollEl, "scrollLeft", { configurable: true, value: 0, writable: true });

    const cards = Array.from(view.container.querySelectorAll(".ui-rail-track-card"));
    setElementRect(cards[0]!, { left: 120, right: 180 });
    setElementRect(cards[1]!, { left: 220, right: 280 });
    setElementRect(cards[2]!, { left: 950, right: 1010 });
    setElementRect(cards[3]!, { left: 1060, right: 1120 });

    window.dispatchEvent(new Event("resize"));
    await nextTick();
    expect(railRoot.style.getPropertyValue("--rail-viewport-width")).toBe("320px");
    expect(railRoot.getAttribute("style")).toContain("--rail-inline-bleed-left: 100px");
    expect(railRoot.getAttribute("style")).toContain("--rail-inline-bleed-right: 300px");

    await fireEvent.scroll(scrollEl);
    await nextTick();
    const classes = cards.map((card) => card.className);
    expect(classes[2]).toContain("ui-rail-track-card-bleed");
    expect(classes[3]).toContain("ui-rail-track-card-bleed");

    const buttons = within(railRoot).getAllByRole("button", { hidden: true });
    expect(buttons).toHaveLength(2);
    expect((buttons[0] as HTMLButtonElement).disabled).toBe(true);
    expect((buttons[1] as HTMLButtonElement).disabled).toBe(false);

    scrollEl.scrollLeft = 180;
    await fireEvent.scroll(scrollEl);
    await nextTick();
    expect((buttons[0] as HTMLButtonElement).disabled).toBe(false);

    await view.rerender({ items: makeItems(5), cardWidth: "narrow", ariaLabel: "Rail test" });
    await nextTick();
    expect(view.container.querySelectorAll(".ui-rail-track-card")).toHaveLength(5);
    expect(view.container.querySelector(".ui-rail-track-card")?.className).toContain(
      "ui-rail-track-card-narrow",
    );

    view.unmount();
  });

  it("moves with wheel momentum and updates scrollLeft", async () => {
    const view = render(UIRailTrack, {
      props: { items: makeItems(3) },
      slots: {
        default: ({ index }: { index: number }) => h("div", `item-${index}`),
      },
    });
    await nextTick();

    const scrollEl = view.container.querySelector(".ui-scrollbar-scroller") as HTMLElement;
    Object.defineProperty(scrollEl, "clientWidth", { configurable: true, value: 300 });
    Object.defineProperty(scrollEl, "scrollWidth", { configurable: true, value: 900 });
    Object.defineProperty(scrollEl, "scrollLeft", { configurable: true, value: 0, writable: true });

    const wheelEvent = new WheelEvent("wheel", {
      deltaY: 120,
      bubbles: true,
      cancelable: true,
    });
    await fireEvent(scrollEl, wheelEvent);

    expect(wheelEvent.defaultPrevented).toBe(true);
    expect(scrollEl.scrollLeft).toBeGreaterThan(0);

    view.unmount();
  });

  it("navigates with snap points on next and previous controls", async () => {
    const view = render(UIRailTrack, {
      props: { items: makeItems(3), getKey: (item: unknown) => (item as { id: string }).id },
      slots: {
        default: ({ item }: { item: unknown }) => h("article", (item as { id: string }).id),
      },
    });
    await nextTick();

    const scrollEl = view.container.querySelector(".ui-scrollbar-scroller") as HTMLElement;
    Object.defineProperty(scrollEl, "clientWidth", { configurable: true, value: 300 });
    Object.defineProperty(scrollEl, "scrollWidth", { configurable: true, value: 900 });
    Object.defineProperty(scrollEl, "scrollLeft", { configurable: true, value: 0, writable: true });
    Object.defineProperty(scrollEl, "scrollTo", {
      configurable: true,
      value: (opts: ScrollToOptionsLike) => {
        if (typeof opts.left === "number") {
          scrollEl.scrollLeft = opts.left;
        }
      },
    });

    const cards = Array.from(view.container.querySelectorAll(".ui-rail-track-card"));
    Object.defineProperty(cards[0]!, "offsetLeft", { configurable: true, value: 120 });
    Object.defineProperty(cards[1]!, "offsetLeft", { configurable: true, value: 260 });
    Object.defineProperty(cards[2]!, "offsetLeft", { configurable: true, value: 420 });

    await fireEvent.scroll(scrollEl);
    await nextTick();

    const previousButton = within(view.container as HTMLElement).getByRole("button", {
      name: "Scroll previous",
      hidden: true,
    });
    const nextButton = within(view.container as HTMLElement).getByRole("button", {
      name: "Scroll next",
      hidden: true,
    });
    expect((nextButton as HTMLButtonElement).disabled).toBe(false);
    await fireEvent.click(nextButton as HTMLButtonElement);
    expect(scrollEl.scrollLeft).toBe(120);
    await fireEvent.scroll(scrollEl);
    await nextTick();

    await fireEvent.click(nextButton as HTMLButtonElement);
    expect(scrollEl.scrollLeft).toBe(260);
    await fireEvent.scroll(scrollEl);
    await nextTick();

    await fireEvent.click(previousButton as HTMLButtonElement);
    expect(scrollEl.scrollLeft).toBe(120);

    view.unmount();
  });

  it("snaps to the nearest card after idle scroll", async () => {
    const view = render(UIRailTrack, {
      props: { items: makeItems(3) },
      slots: {
        default: ({ index }: { index: number }) => h("div", `item-${index}`),
      },
    });
    await nextTick();

    const scrollEl = view.container.querySelector(".ui-scrollbar-scroller") as HTMLElement;
    Object.defineProperty(scrollEl, "clientWidth", { configurable: true, value: 320 });
    Object.defineProperty(scrollEl, "scrollWidth", { configurable: true, value: 920 });
    Object.defineProperty(scrollEl, "scrollLeft", {
      configurable: true,
      value: 132,
      writable: true,
    });
    Object.defineProperty(scrollEl, "scrollTo", {
      configurable: true,
      value: (opts: ScrollToOptionsLike) => {
        if (typeof opts.left === "number") {
          scrollEl.scrollLeft = opts.left;
        }
      },
    });

    const cards = Array.from(view.container.querySelectorAll(".ui-rail-track-card"));
    Object.defineProperty(cards[0]!, "offsetLeft", { configurable: true, value: 120 });
    Object.defineProperty(cards[1]!, "offsetLeft", { configurable: true, value: 280 });
    Object.defineProperty(cards[2]!, "offsetLeft", { configurable: true, value: 440 });

    await fireEvent.scroll(scrollEl);
    vi.advanceTimersByTime(300);
    await nextTick();
    expect(scrollEl.scrollLeft).toBe(120);

    view.unmount();
  });

  it("handles non-scrollable rail rendering", async () => {
    const view = render(UIRailTrack, {
      props: {
        items: makeItems(1),
        scrollable: false,
        showControls: true,
      },
      slots: {
        default: ({ index }: { index: number }) => h("div", `single-${index}`),
      },
    });
    await nextTick();

    expect(view.container.querySelector(".ui-scrollbar")).toBeNull();
    expect(view.container.querySelector(".ui-rail-track-scroll")?.tagName).toBe("DIV");
    expect(view.container.querySelector(".ui-rail-track-controls")).toBeNull();

    view.unmount();
  });

  it("exposes horizontal-only scrollbar track style function", async () => {
    const view = render(UIRailTrack, {
      props: { items: makeItems(2) },
      slots: {
        default: ({ index }: { index: number }) => h("div", `style-${index}`),
      },
    });
    await nextTick();

    const scrollEl = view.container.querySelector(".ui-scrollbar-scroller") as HTMLElement;
    const trackStyleProp = (
      scrollEl.parentElement as unknown as { __vueParentComponent?: { props: unknown } }
    ).__vueParentComponent?.props as
      | { trackStyle?: (horizontal?: boolean) => Record<string, string> }
      | undefined;
    expect(trackStyleProp?.trackStyle?.(false)).toEqual({});

    await fireEvent.scroll(scrollEl);
    await nextTick();

    view.unmount();
  });
});
