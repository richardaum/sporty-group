import { shallowRef } from "vue";

type ListElementGetter = () => HTMLElement | null;

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(", ");

type UseRailKeyboardNavigationOptions = {
  getListElement: ListElementGetter;
  getItemCount: () => number;
};

function clampIndex(index: number, maxExclusive: number): number {
  if (maxExclusive <= 0) {
    return -1;
  }

  return Math.min(Math.max(index, 0), maxExclusive - 1);
}

export function useRailKeyboardNavigation(options: UseRailKeyboardNavigationOptions) {
  const activeIndex = shallowRef(0);

  function getCards(): HTMLElement[] {
    const listEl = options.getListElement();
    if (!listEl) {
      return [];
    }

    return Array.from(listEl.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );
  }

  function getFocusableInCard(card: HTMLElement): HTMLElement | null {
    return card.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
  }

  function applyRovingTabIndex() {
    const cards = getCards();
    if (!cards.length) {
      activeIndex.value = 0;
      return;
    }

    const nextIndex = clampIndex(activeIndex.value, cards.length);
    activeIndex.value = nextIndex;

    cards.forEach((card, index) => {
      const focusable = getFocusableInCard(card);
      if (!focusable) {
        return;
      }

      focusable.tabIndex = index === nextIndex ? 0 : -1;
    });
  }

  function setActiveIndex(index: number, moveFocus: boolean) {
    const cards = getCards();
    if (!cards.length) {
      activeIndex.value = 0;
      return;
    }

    const nextIndex = clampIndex(index, cards.length);
    activeIndex.value = nextIndex;
    applyRovingTabIndex();

    if (!moveFocus) {
      return;
    }

    const targetFocusable = getFocusableInCard(cards[nextIndex]!);
    if (!targetFocusable) {
      return;
    }

    targetFocusable.focus();
    if (typeof targetFocusable.scrollIntoView === "function") {
      targetFocusable.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    }
  }

  function onFocusIn(event: FocusEvent) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const cards = getCards();
    const focusedCardIndex = cards.findIndex((card) => card.contains(target));
    if (focusedCardIndex === -1) {
      return;
    }

    setActiveIndex(focusedCardIndex, false);
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    const listEl = options.getListElement();
    const eventTarget = event.target;
    if (!listEl || !(eventTarget instanceof HTMLElement) || !listEl.contains(eventTarget)) {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    setActiveIndex(activeIndex.value + direction, true);
  }

  function reset() {
    const itemCount = options.getItemCount();
    activeIndex.value = itemCount > 0 ? 0 : -1;
    applyRovingTabIndex();
  }

  return {
    onFocusIn,
    onKeydown,
    reset,
  };
}
