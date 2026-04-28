import { computed, shallowRef } from "vue";
import type { Ref } from "vue";

export function useRailBleed(railRootEl: Ref<HTMLElement | null>, listEl: Ref<HTMLElement | null>) {
  const viewportBleedLeft = shallowRef(0);
  const viewportBleedRight = shallowRef(0);
  const fadedBleedCardIndexes = shallowRef<Set<number>>(new Set());
  const leftBleedIndex = shallowRef<number | null>(null);
  const rightBleedIndex = shallowRef<number | null>(null);
  let lastFirstVisibleIndex: number | null = null;
  let lastLastVisibleIndex: number | null = null;
  let lastCardCount = -1;

  const bleedStyle = computed(() => ({
    "--rail-inline-bleed-left": `${viewportBleedLeft.value}px`,
    "--rail-inline-bleed-right": `${viewportBleedRight.value}px`,
  }));

  function updateViewportBleed() {
    const railEl = railRootEl.value;
    if (!railEl) {
      viewportBleedLeft.value = 0;
      viewportBleedRight.value = 0;
      return;
    }

    const rect = railEl.getBoundingClientRect();
    const layoutViewportWidth = document.documentElement.clientWidth;
    viewportBleedLeft.value = Math.max(rect.left, 0);
    viewportBleedRight.value = Math.max(layoutViewportWidth - rect.right, 0);
  }

  function updateBleedCardOpacityState() {
    if (!railRootEl.value || !listEl.value) {
      fadedBleedCardIndexes.value = new Set();
      leftBleedIndex.value = null;
      rightBleedIndex.value = null;
      lastFirstVisibleIndex = null;
      lastLastVisibleIndex = null;
      lastCardCount = -1;
      return;
    }

    const railRect = railRootEl.value.getBoundingClientRect();
    const cards = listEl.value.children;
    const cardCount = cards.length;
    let firstVisibleIndex = -1;
    let lastVisibleIndex = -1;

    for (let index = 0; index < cardCount; index += 1) {
      const cardRect = (cards[index] as HTMLElement).getBoundingClientRect();
      const isVisible = cardRect.right > railRect.left && cardRect.left < railRect.right;
      if (!isVisible) {
        continue;
      }
      if (firstVisibleIndex === -1) {
        firstVisibleIndex = index;
      }
      lastVisibleIndex = index;
    }

    const nextLeftBleedIndex = firstVisibleIndex === -1 ? null : firstVisibleIndex;
    const nextRightBleedIndex = lastVisibleIndex === -1 ? null : lastVisibleIndex;
    if (
      nextLeftBleedIndex === lastFirstVisibleIndex &&
      nextRightBleedIndex === lastLastVisibleIndex &&
      cardCount === lastCardCount
    ) {
      return;
    }

    leftBleedIndex.value = nextLeftBleedIndex;
    rightBleedIndex.value = nextRightBleedIndex;
    lastFirstVisibleIndex = nextLeftBleedIndex;
    lastLastVisibleIndex = nextRightBleedIndex;
    lastCardCount = cardCount;

    if (nextLeftBleedIndex === null || nextRightBleedIndex === null) {
      fadedBleedCardIndexes.value = new Set(Array.from({ length: cardCount }, (_, index) => index));
    } else {
      const nextFaded = new Set<number>();
      for (let index = 0; index < cardCount; index += 1) {
        if (index < nextLeftBleedIndex || index > nextRightBleedIndex) {
          nextFaded.add(index);
        }
      }
      fadedBleedCardIndexes.value = nextFaded;
    }
  }

  return {
    viewportBleedLeft,
    viewportBleedRight,
    fadedBleedCardIndexes,
    leftBleedIndex,
    rightBleedIndex,
    bleedStyle,
    updateViewportBleed,
    updateBleedCardOpacityState,
  };
}
