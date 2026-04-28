import { shallowRef } from "vue";

type ScrollElementGetter = () => HTMLElement | null;
type CardOffsetsGetter = () => number[];

type UseRailNavigationOptions = {
  getScrollElement: ScrollElementGetter;
  getCardOffsets: CardOffsetsGetter;
  updateViewportBleed: () => void;
  onReadyState: () => void;
  onEmptyState: () => void;
};

export function useRailNavigation(options: UseRailNavigationOptions) {
  const canGoPrevious = shallowRef(false);
  const canGoNext = shallowRef(false);

  function updateNavigationState() {
    options.updateViewportBleed();
    const scrollEl = options.getScrollElement();
    const offsets = options.getCardOffsets();

    if (!scrollEl || !offsets.length) {
      canGoPrevious.value = false;
      canGoNext.value = false;
      options.onEmptyState();
      return;
    }

    canGoPrevious.value = scrollEl.scrollLeft > 0;
    canGoNext.value = scrollEl.scrollLeft < scrollEl.scrollWidth - scrollEl.clientWidth;
    options.onReadyState();
  }

  return {
    canGoPrevious,
    canGoNext,
    updateNavigationState,
  };
}
