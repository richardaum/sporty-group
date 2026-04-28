<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from "vue";
import type { ComponentPublicInstance } from "vue";
import UIScrollbar from "./UIScrollbar.vue";
import { useRailBleed } from "./composables/useRailBleed";
import { useRailNavigation } from "./composables/useRailNavigation";
import { useRailSnap } from "./composables/useRailSnap";
import { useRailWheelMomentum } from "./composables/useRailWheelMomentum";

defineOptions({
  name: "UIRailTrack",
});

const props = withDefaults(
  defineProps<{
    items: unknown[];
    ariaLabel?: string;
    scrollable?: boolean;
    showControls?: boolean;
    scrollbarSkin?: "light" | "dark";
    cardWidth?: "default" | "narrow";
    getKey?: (item: unknown, index: number) => string | number;
  }>(),
  {
    ariaLabel: "Horizontal rail",
    scrollable: true,
    showControls: true,
    scrollbarSkin: "light",
    cardWidth: "default",
    getKey: undefined,
  },
);

defineSlots<{
  default(props: { item: unknown; index: number }): unknown;
}>();

type ScrollTargetInstance = ComponentPublicInstance & { scrollEl?: HTMLElement | null };

const rootTag = computed(() => (props.scrollable ? UIScrollbar : "div"));
const railRootEl = shallowRef<HTMLElement | null>(null);
const scrollTarget = shallowRef<HTMLElement | ScrollTargetInstance | null>(null);
const listEl = shallowRef<HTMLElement | null>(null);
const {
  viewportBleedLeft,
  viewportBleedRight,
  fadedBleedCardIndexes,
  bleedStyle,
  updateViewportBleed,
  updateBleedCardOpacityState: recomputeBleedCardOpacityState,
} = useRailBleed(railRootEl, listEl);
const { onWheel: onWheelMomentum, clearMomentum } = useRailWheelMomentum({
  getScrollElement,
});
const { canGoPrevious, canGoNext, updateNavigationState } = useRailNavigation({
  getScrollElement,
  getCardOffsets,
  updateViewportBleed,
  onReadyState: recomputeBleedCardOpacityState,
  onEmptyState: () => {
    fadedBleedCardIndexes.value = new Set();
  },
});
const {
  goToNext,
  goToPrevious,
  onScrollForSnap,
  markWheelActivity,
  cleanup: cleanupSnap,
} = useRailSnap({
  getScrollElement,
  getCardOffsets,
  clearMomentum,
});
const shouldRenderControls = computed(
  () => props.scrollable && props.showControls && props.items.length > 1,
);
const scrollbarTrackStyle = computed(() => (horizontal?: boolean) => {
  if (!horizontal) {
    return {};
  }

  return {
    left: `${viewportBleedLeft.value}px`,
    right: `${viewportBleedRight.value}px`,
    overflow: "hidden",
  };
});
function getScrollElement(): HTMLElement | null {
  const target = scrollTarget.value;
  if (!target) {
    return null;
  }

  if (target instanceof HTMLElement) {
    return target;
  }

  if (target.scrollEl instanceof HTMLElement) {
    return target.scrollEl;
  }

  return (target.$el as HTMLElement | undefined) ?? null;
}

function getCardOffsets(): number[] {
  if (!listEl.value) {
    return [];
  }

  return Array.from(listEl.value.children).map((child) => (child as HTMLElement).offsetLeft);
}

function onScroll() {
  onScrollForSnap();

  updateNavigationState();
}

function onWheel(event: WheelEvent) {
  markWheelActivity();
  onWheelMomentum(event);
}

function onResize() {
  syncViewportWidth();
  updateViewportBleed();
  updateNavigationState();
}

function syncViewportWidth() {
  const viewport = getScrollElement();
  const viewportWidth = viewport?.clientWidth;
  if (!railRootEl.value || !viewportWidth) {
    return;
  }

  railRootEl.value.style.setProperty("--rail-viewport-width", `${viewportWidth}px`);
}

onMounted(async () => {
  await nextTick();
  syncViewportWidth();
  updateViewportBleed();
  const scrollEl = getScrollElement();
  scrollEl?.addEventListener("scroll", onScroll, { passive: true });
  scrollEl?.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("resize", onResize);
  updateNavigationState();
});

onBeforeUnmount(() => {
  const scrollEl = getScrollElement();
  scrollEl?.removeEventListener("scroll", onScroll);
  scrollEl?.removeEventListener("wheel", onWheel);
  cleanupSnap();
  clearMomentum();
  window.removeEventListener("resize", onResize);
});

watch(
  () => props.items.length,
  async () => {
    syncViewportWidth();
    updateViewportBleed();
    await nextTick();
    updateNavigationState();
  },
);
</script>

<template>
  <section ref="railRootEl" class="ui-rail-track" :style="bleedStyle">
    <component
      :is="rootTag"
      ref="scrollTarget"
      class="ui-rail-track-scroll"
      :skin="scrollable ? scrollbarSkin : undefined"
      :track-style="scrollable ? scrollbarTrackStyle : undefined"
      :max-thumb-ratio="scrollable ? 0.55 : undefined"
      :suppress-scroll-y="true"
      :aria-label="ariaLabel"
    >
      <ul ref="listEl" class="ui-rail-track-list">
        <li
          v-for="(item, index) in items"
          :key="getKey?.(item, index) ?? index"
          class="ui-rail-track-card"
          :class="[
            cardWidth === 'narrow' ? 'ui-rail-track-card-narrow' : undefined,
            fadedBleedCardIndexes.has(index) ? 'ui-rail-track-card-bleed' : undefined,
          ]"
        >
          <slot :item="item" :index="index" />
        </li>
      </ul>
    </component>

    <div v-if="shouldRenderControls" class="ui-rail-track-controls" aria-hidden="true">
      <button
        type="button"
        class="ui-rail-track-button"
        aria-label="Scroll previous"
        :disabled="!canGoPrevious"
        @click="goToPrevious"
      >
        <span class="ui-rail-track-icon ui-rail-track-icon-left" />
      </button>
      <button
        type="button"
        class="ui-rail-track-button"
        aria-label="Scroll next"
        :disabled="!canGoNext"
        @click="goToNext"
      >
        <span class="ui-rail-track-icon ui-rail-track-icon-right" />
      </button>
    </div>
  </section>
</template>

<style scoped>
.ui-rail-track {
  --rail-hover-overscan-inline: 0.45rem;
  --rail-hover-overscan-block: 0.45rem;
  position: relative;
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.ui-rail-track-controls {
  position: absolute;
  top: calc(var(--space-6) * -1);
  right: var(--space-1);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  z-index: 2;
}

.ui-rail-track-button {
  --rail-control-size: 1.625rem;
  width: var(--rail-control-size);
  height: var(--rail-control-size);
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: color-mix(in oklab, var(--color-bg-surface) 88%, black);
  color: var(--color-text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background-color 160ms ease;
  z-index: 2;
}

.ui-rail-track-button:disabled {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text-secondary);
  cursor: not-allowed;
}

.ui-rail-track-button:hover:enabled {
  border-color: var(--color-border-strong);
  background: var(--color-bg-subtle);
}

.ui-rail-track-button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.ui-rail-track-icon {
  width: 0.42rem;
  height: 0.42rem;
  border-top: 1.5px solid currentColor;
  border-right: 1.5px solid currentColor;
}

.ui-rail-track-icon-left {
  transform: rotate(-135deg);
  margin-left: 0.15rem;
}

.ui-rail-track-icon-right {
  transform: rotate(45deg);
  margin-right: 0.15rem;
}

.ui-rail-track-scroll {
  padding-bottom: 0;
  min-width: 0;
  width: calc(100% + var(--rail-inline-bleed-left) + var(--rail-inline-bleed-right));
  max-width: calc(100% + var(--rail-inline-bleed-left) + var(--rail-inline-bleed-right));
  margin-left: calc(var(--rail-inline-bleed-left) * -1);
  margin-right: calc(var(--rail-inline-bleed-right) * -1);
}

.ui-rail-track-scroll :deep(.ui-scrollbar-scroller) {
  overflow-x: auto !important;
  overflow-y: hidden !important;
  padding-top: var(--rail-hover-overscan-block);
  padding-bottom: var(--rail-hover-overscan-block);
  scroll-snap-type: none;
  scroll-padding-left: calc(var(--rail-inline-bleed-left) + var(--rail-hover-overscan-inline));
  scroll-padding-right: calc(var(--rail-inline-bleed-right) + var(--rail-hover-overscan-inline));
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.ui-rail-track-scroll :deep(.ui-scrollbar-scroller::-webkit-scrollbar) {
  width: 0 !important;
  height: 0 !important;
  display: none;
}

.ui-rail-track-list {
  --rail-visible-full-cards: 5;
  --rail-visible-partial-card: 0.2;
  --rail-visible-cards: calc(var(--rail-visible-full-cards) + var(--rail-visible-partial-card));
  --rail-visible-gaps: 5;
  --rail-card-width: calc(
    (var(--rail-viewport-width, 100%) - (var(--space-4) * var(--rail-visible-gaps))) /
      var(--rail-visible-cards)
  );
  list-style: none;
  margin: 0;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: var(--rail-inline-bleed-left);
  padding-right: calc(var(--rail-inline-bleed-right) + var(--rail-hover-overscan-inline));
  display: flex;
  gap: var(--space-4);
  min-width: max-content;
}

.ui-rail-track-card {
  flex: 0 0 var(--rail-card-width);
  min-width: 0;
  aspect-ratio: 5 / 6;
  overflow: hidden;
  scroll-snap-align: start;
  opacity: 1;
  transition: opacity 200ms ease;
}

.ui-rail-track-card-bleed {
  opacity: 0.2;
}

.ui-rail-track-card-narrow {
  flex-basis: calc(var(--rail-card-width) * 0.82);
}

.ui-rail-track-card > :deep(*) {
  width: 100%;
  height: 100%;
}

.ui-rail-track-card > :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
