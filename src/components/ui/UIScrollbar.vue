<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, useAttrs, useSlots } from "vue";
import type { CSSProperties } from "vue";

type TrackGapTuple = [startX: number, endX: number, startY: number, endY: number];
type TrackGapValue =
  | number
  | TrackGapTuple
  | ((showBarX: boolean, showBarY: boolean) => TrackGapTuple);

defineOptions({
  name: "UIScrollbar",
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    as?: string;
    skin?: "light" | "dark";
    trackGap?: TrackGapValue;
    trackStyle?: (horizontal?: boolean) => CSSProperties;
    thumbStyle?: (horizontal?: boolean) => CSSProperties;
    minThumbSize?: number;
    maxThumbRatio?: number;
    suppressAutoHide?: boolean;
    suppressScrollX?: boolean;
    suppressScrollY?: boolean;
  }>(),
  {
    as: "div",
    skin: "light",
    trackGap: 16,
    trackStyle: undefined,
    thumbStyle: undefined,
    minThumbSize: 20,
    maxThumbRatio: 1,
    suppressAutoHide: false,
    suppressScrollX: false,
    suppressScrollY: false,
  },
);

const attrs = useAttrs();
const slots = useSlots();

const scrollEl = shallowRef<HTMLElement | null>(null);
const isHovering = shallowRef(false);
const isInteracting = shallowRef(false);
const canScrollX = shallowRef(false);
const canScrollY = shallowRef(false);
const thumbXSize = shallowRef(0);
const thumbYSize = shallowRef(0);
const thumbXOffset = shallowRef(0);
const thumbYOffset = shallowRef(0);
const xTravelPx = shallowRef(0);
const yTravelPx = shallowRef(0);
const paddingTopPx = shallowRef(0);
const paddingRightPx = shallowRef(0);
const paddingBottomPx = shallowRef(0);
const paddingLeftPx = shallowRef(0);

let resizeObserver: ResizeObserver | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let dragAxis: "x" | "y" | null = null;
let dragStartPointer = 0;
let dragStartScroll = 0;

const hasDefaultSlot = computed(() => !!slots.default);
const shouldShowX = computed(() => !props.suppressScrollX && canScrollX.value);
const shouldShowY = computed(() => !props.suppressScrollY && canScrollY.value);

const isTrackVisible = computed(
  () => props.suppressAutoHide || isHovering.value || isInteracting.value,
);

const rootStyle = computed<CSSProperties>(() => ({
  overflowX: props.suppressScrollX ? "hidden" : "auto",
  overflowY: props.suppressScrollY ? "hidden" : "auto",
}));

const resolvedGap = computed<TrackGapTuple>(() => {
  const gap = props.trackGap as TrackGapValue;

  if (typeof gap === "function") {
    return gap(shouldShowX.value, shouldShowY.value);
  }

  if (Array.isArray(gap)) {
    return gap;
  }

  return [0, shouldShowY.value ? gap : 0, 0, shouldShowX.value ? gap : 0];
});

const xTrackStyle = computed<CSSProperties>(() => {
  const [startX, endX] = resolvedGap.value;
  return {
    left: `${paddingLeftPx.value + startX}px`,
    right: `${paddingRightPx.value + endX}px`,
    ...props.trackStyle?.(true),
  };
});

const yTrackStyle = computed<CSSProperties>(() => {
  const [, , startY, endY] = resolvedGap.value;
  return {
    top: `${paddingTopPx.value + startY}px`,
    bottom: `${paddingBottomPx.value + endY}px`,
    ...props.trackStyle?.(false),
  };
});

const xThumbStyle = computed<CSSProperties>(() => ({
  width: `${thumbXSize.value}px`,
  transform: `translateX(${thumbXOffset.value}px)`,
  ...props.thumbStyle?.(true),
}));

const yThumbStyle = computed<CSSProperties>(() => ({
  height: `${thumbYSize.value}px`,
  transform: `translateY(${thumbYOffset.value}px)`,
  ...props.thumbStyle?.(false),
}));

defineExpose({
  scrollEl,
});

function clearHideTimer() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function scheduleHide() {
  clearHideTimer();
  hideTimer = setTimeout(() => {
    isInteracting.value = false;
  }, 1000);
}

function updateMetrics() {
  const el = scrollEl.value;
  if (!el) {
    return;
  }

  const clientWidth = el.clientWidth;
  const clientHeight = el.clientHeight;
  const scrollWidth = el.scrollWidth;
  const scrollHeight = el.scrollHeight;
  const scrollLeft = el.scrollLeft;
  const scrollTop = el.scrollTop;

  canScrollX.value = scrollWidth - clientWidth > 1;
  canScrollY.value = scrollHeight - clientHeight > 1;

  const [startX, endX, startY, endY] = resolvedGap.value;
  const computedStyle = window.getComputedStyle(el);
  paddingTopPx.value = Number.parseFloat(computedStyle.paddingTop) || 0;
  paddingRightPx.value = Number.parseFloat(computedStyle.paddingRight) || 0;
  paddingBottomPx.value = Number.parseFloat(computedStyle.paddingBottom) || 0;
  paddingLeftPx.value = Number.parseFloat(computedStyle.paddingLeft) || 0;

  const xTrackSize = Math.max(
    clientWidth - paddingLeftPx.value - paddingRightPx.value - startX - endX,
    0,
  );
  const yTrackSize = Math.max(
    clientHeight - paddingTopPx.value - paddingBottomPx.value - startY - endY,
    0,
  );
  const rootEl = el.parentElement;
  const xTrackEl = rootEl?.querySelector(".ui-scrollbar-track-x") as HTMLElement | null;
  const yTrackEl = rootEl?.querySelector(".ui-scrollbar-track-y") as HTMLElement | null;
  const measuredXTrackSize = xTrackEl?.getBoundingClientRect().width ?? xTrackSize;
  const measuredYTrackSize = yTrackEl?.getBoundingClientRect().height ?? yTrackSize;
  const effectiveXTrackSize = Math.max(measuredXTrackSize, 0);
  const effectiveYTrackSize = Math.max(measuredYTrackSize, 0);

  if (canScrollX.value && scrollWidth > 0 && effectiveXTrackSize > 0) {
    const rawXThumbSize = (clientWidth / scrollWidth) * effectiveXTrackSize;
    const maxXThumbSize = Math.min(
      effectiveXTrackSize,
      effectiveXTrackSize * Math.max(props.maxThumbRatio, 0),
    );
    thumbXSize.value = Math.min(Math.max(rawXThumbSize, props.minThumbSize), maxXThumbSize);
    const xTravel = Math.max(effectiveXTrackSize - thumbXSize.value, 0);
    xTravelPx.value = xTravel;
    const xRange = scrollWidth - clientWidth;
    thumbXOffset.value = xRange > 0 ? (scrollLeft / xRange) * xTravel : 0;
  } else {
    thumbXSize.value = 0;
    thumbXOffset.value = 0;
    xTravelPx.value = 0;
  }

  if (canScrollY.value && scrollHeight > 0 && effectiveYTrackSize > 0) {
    const rawYThumbSize = (clientHeight / scrollHeight) * effectiveYTrackSize;
    const maxYThumbSize = Math.min(
      effectiveYTrackSize,
      effectiveYTrackSize * Math.max(props.maxThumbRatio, 0),
    );
    thumbYSize.value = Math.min(Math.max(rawYThumbSize, props.minThumbSize), maxYThumbSize);
    const yTravel = Math.max(effectiveYTrackSize - thumbYSize.value, 0);
    yTravelPx.value = yTravel;
    const yRange = scrollHeight - clientHeight;
    thumbYOffset.value = yRange > 0 ? (scrollTop / yRange) * yTravel : 0;
  } else {
    thumbYSize.value = 0;
    thumbYOffset.value = 0;
    yTravelPx.value = 0;
  }
}

function onScroll() {
  isInteracting.value = true;
  updateMetrics();
  scheduleHide();
}

function onMouseEnter() {
  isHovering.value = true;
}

function onMouseLeave() {
  isHovering.value = false;
}

function onThumbPointerDown(axis: "x" | "y", event: PointerEvent) {
  const el = scrollEl.value;
  if (!el) {
    return;
  }

  dragAxis = axis;
  dragStartPointer = axis === "x" ? event.clientX : event.clientY;
  dragStartScroll = axis === "x" ? el.scrollLeft : el.scrollTop;
  isInteracting.value = true;
  clearHideTimer();
  window.addEventListener("pointermove", onWindowPointerMove);
  window.addEventListener("pointerup", onWindowPointerUp);
}

function onWindowPointerMove(event: PointerEvent) {
  const el = scrollEl.value;
  if (!el || !dragAxis) {
    return;
  }

  if (dragAxis === "x") {
    const travel = Math.max(xTravelPx.value, 1);
    const ratio = (el.scrollWidth - el.clientWidth) / travel;
    const delta = event.clientX - dragStartPointer;
    el.scrollLeft = dragStartScroll + delta * ratio;
  } else {
    const travel = Math.max(yTravelPx.value, 1);
    const ratio = (el.scrollHeight - el.clientHeight) / travel;
    const delta = event.clientY - dragStartPointer;
    el.scrollTop = dragStartScroll + delta * ratio;
  }
}

function onWindowPointerUp() {
  dragAxis = null;
  scheduleHide();
  window.removeEventListener("pointermove", onWindowPointerMove);
  window.removeEventListener("pointerup", onWindowPointerUp);
}

onMounted(() => {
  const el = scrollEl.value;
  if (!el) {
    return;
  }

  resizeObserver = new ResizeObserver(() => {
    updateMetrics();
  });

  resizeObserver.observe(el);
  Array.from(el.children)
    .filter((child) => !(child as HTMLElement).classList.contains("ui-scrollbar-track"))
    .forEach((child) => {
      resizeObserver?.observe(child);
    });

  el.addEventListener("scroll", onScroll, { passive: true });
  updateMetrics();
});

onBeforeUnmount(() => {
  clearHideTimer();
  resizeObserver?.disconnect();
  resizeObserver = null;

  const el = scrollEl.value;
  if (el) {
    el.removeEventListener("scroll", onScroll);
  }
  window.removeEventListener("pointermove", onWindowPointerMove);
  window.removeEventListener("pointerup", onWindowPointerUp);
});
</script>

<template>
  <component
    :is="as"
    class="ui-scrollbar"
    :class="[`ui-scrollbar-skin-${skin}`]"
    v-bind="attrs"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div ref="scrollEl" class="ui-scrollbar-scroller" :style="rootStyle">
      <slot v-if="hasDefaultSlot" />
    </div>

    <div
      v-if="shouldShowX"
      class="ui-scrollbar-track ui-scrollbar-track-x"
      :class="{ 'ui-scrollbar-visible': isTrackVisible }"
      :style="xTrackStyle"
      aria-hidden="true"
    >
      <div
        class="ui-scrollbar-thumb ui-scrollbar-thumb-x"
        :style="xThumbStyle"
        @pointerdown.prevent="onThumbPointerDown('x', $event)"
      />
    </div>

    <div
      v-if="shouldShowY"
      class="ui-scrollbar-track ui-scrollbar-track-y"
      :class="{ 'ui-scrollbar-visible': isTrackVisible }"
      :style="yTrackStyle"
      aria-hidden="true"
    >
      <div
        class="ui-scrollbar-thumb ui-scrollbar-thumb-y"
        :style="yThumbStyle"
        @pointerdown.prevent="onThumbPointerDown('y', $event)"
      />
    </div>
  </component>
</template>

<style scoped>
.ui-scrollbar {
  --scrollbar-thumb-light: rgba(156, 163, 175, 0.5);
  --scrollbar-thumb-dark: rgba(107, 114, 128, 0.38);
  --scrollbar-track-light: rgba(148, 163, 184, 0.08);
  --scrollbar-track-dark: rgba(255, 255, 255, 0.04);
  --scrollbar-size: 11px;
  position: relative;
  overflow: hidden;
}

.ui-scrollbar-scroller {
  width: 100%;
  height: 100%;
  overflow: auto;
  scrollbar-width: none;
}

.ui-scrollbar-scroller::-webkit-scrollbar {
  display: none;
}

.ui-scrollbar-track {
  position: absolute;
  opacity: 0;
  transition: opacity 180ms ease;
  pointer-events: none;
  z-index: 2;
}

.ui-scrollbar-track-x {
  bottom: 2px;
  height: var(--scrollbar-size);
}

.ui-scrollbar-track-y {
  right: 2px;
  width: var(--scrollbar-size);
}

.ui-scrollbar-visible {
  opacity: 1;
}

.ui-scrollbar-thumb {
  position: absolute;
  border-radius: 999px;
  pointer-events: auto;
  cursor: default;
}

.ui-scrollbar-thumb-x {
  top: 1px;
  left: 0;
  height: calc(var(--scrollbar-size) - 2px);
  cursor: ew-resize;
}

.ui-scrollbar-thumb-y {
  top: 0;
  left: 1px;
  width: calc(var(--scrollbar-size) - 2px);
  cursor: ns-resize;
}

.ui-scrollbar-skin-light .ui-scrollbar-track {
  background: var(--scrollbar-track-light);
  border-radius: 999px;
}

.ui-scrollbar-skin-light .ui-scrollbar-thumb {
  background: var(--scrollbar-thumb-light);
}

.ui-scrollbar-skin-dark .ui-scrollbar-track {
  background: var(--scrollbar-track-dark);
  border-radius: 999px;
}

.ui-scrollbar-skin-dark .ui-scrollbar-thumb {
  background: var(--scrollbar-thumb-dark);
}

@media (prefers-reduced-motion: reduce) {
  .ui-scrollbar-track {
    transition: none;
  }
}
</style>
