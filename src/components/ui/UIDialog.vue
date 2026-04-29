<script setup lang="ts">
import { computed } from "vue";
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogRoot,
  DialogTitle,
} from "radix-vue";
import { PhX } from "@phosphor-icons/vue";

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    ariaLabel?: string;
    desktopWidth?: string;
    mobileWidth?: string;
    fitToContent?: boolean;
    surface?: "base" | "emphasized";
  }>(),
  {
    ariaLabel: "Dialog",
    desktopWidth: "80%",
    mobileWidth: "100%",
    fitToContent: false,
    surface: "base",
  },
);

const emit = defineEmits<{
  close: [];
}>();

const dialogSizeStyle = computed(() => ({
  "--ui-dialog-width-desktop": props.desktopWidth,
  "--ui-dialog-width-mobile": props.mobileWidth,
}));

function handleEscapeClose() {
  emit("close");
}

function handlePointerOutsideClose() {
  emit("close");
}

function handleButtonClose() {
  emit("close");
}
</script>

<template>
  <DialogRoot v-if="isOpen" :open="true">
    <DialogOverlay force-mount class="ui-dialog-overlay" />
    <DialogContent
      force-mount
      class="ui-dialog-content"
      :class="[
        { 'ui-dialog-content-fit': props.fitToContent },
        `ui-dialog-surface-${props.surface}`,
      ]"
      :style="dialogSizeStyle"
      :aria-label="ariaLabel"
      @escape-key-down.prevent="handleEscapeClose"
      @pointer-down-outside.prevent="handlePointerOutsideClose"
    >
      <DialogTitle class="ui-dialog-visually-hidden">{{ ariaLabel }}</DialogTitle>
      <DialogDescription class="ui-dialog-visually-hidden">
        Dialog content container.
      </DialogDescription>
      <div class="ui-dialog-inner">
        <button
          type="button"
          class="ui-dialog-close"
          data-ui-dialog-close
          aria-label="Close dialog"
          @click="handleButtonClose"
        >
          <PhX :size="20" weight="regular" aria-hidden="true" />
        </button>
        <slot />
      </div>
    </DialogContent>
  </DialogRoot>
</template>

<style>
.ui-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(3, 5, 12, 0.72);
  backdrop-filter: blur(8px);
}

.ui-dialog-content {
  /* Same cap as UIBadgeLookup .badge-panel so the close button aligns with the visible card edges on mobile */
  --ui-dialog-inner-max-width: min(30rem, calc(100vw - 2rem));
  position: fixed;
  z-index: 51;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(var(--ui-dialog-width-desktop), calc(100% - (var(--space-6) * 2)));
  max-width: var(--ui-dialog-width-desktop);
  max-height: min(80svh, 40rem);
  overflow: auto;
  outline: none;
}

.ui-dialog-inner {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: var(--ui-dialog-inner-max-width);
  margin-inline: auto;
}

.ui-dialog-close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  color: color-mix(in oklab, var(--color-text-primary) 90%, white);
  cursor: pointer;
  z-index: 1;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
}

.ui-dialog-close:hover {
  border-color: color-mix(in oklab, var(--color-border) 72%, white);
  background: color-mix(in oklab, var(--color-bg-surface) 26%, transparent);
  color: var(--color-text-primary);
}

.ui-dialog-close:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.ui-dialog-close :where(svg) {
  display: block;
}

.ui-dialog-content-fit {
  width: fit-content;
  max-width: min(var(--ui-dialog-width-desktop), calc(100% - (var(--space-6) * 2)));
}

.ui-dialog-surface-emphasized {
  border: none;
  border-radius: var(--radius-lg);
  background:
    radial-gradient(
      120% 90% at 50% 0%,
      color-mix(in oklab, var(--color-brand-500) 16%, transparent),
      transparent 60%
    ),
    linear-gradient(
      160deg,
      color-mix(in oklab, var(--color-brand-100) 20%, var(--color-bg-surface)) 0%,
      var(--color-bg-surface) 45%,
      color-mix(in oklab, var(--color-bg-elevated) 82%, black) 100%
    );
  box-shadow:
    var(--shadow-soft),
    inset 0 1px 0 color-mix(in oklab, white 8%, transparent);
}

.ui-dialog-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.ui-dialog-overlay[data-state="open"],
.ui-dialog-content[data-state="open"] {
  animation: ui-dialog-fade-in 180ms ease;
}

@keyframes ui-dialog-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ui-dialog-overlay[data-state],
  .ui-dialog-content[data-state] {
    animation: none;
  }
}

@media (max-width: 48rem) {
  .ui-dialog-content {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - (var(--space-4) * 2));
    max-width: calc(100% - (var(--space-4) * 2));
    height: auto;
    max-height: calc(100svh - (var(--space-4) * 2));
  }
}
</style>
