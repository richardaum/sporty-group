<script setup lang="ts" generic="T">
import { computed, ref, watch } from "vue";
import { PhArrowLeft, PhArrowRight } from "@phosphor-icons/vue";

const props = withDefaults(
  defineProps<{
    items: T[];
    initialIndex?: number;
    previousLabel?: string;
    nextLabel?: string;
    showPosition?: boolean;
  }>(),
  {
    initialIndex: 0,
    previousLabel: "Show previous item",
    nextLabel: "Show next item",
    showPosition: true,
  },
);

const currentIndex = ref(0);

function clampIndex(index: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), total - 1);
}

watch(
  () => [props.items, props.initialIndex] as const,
  ([items, initialIndex]) => {
    currentIndex.value = clampIndex(initialIndex, items.length);
  },
  { immediate: true },
);

const totalItems = computed(() => props.items.length);
const currentItem = computed(() => props.items[currentIndex.value] ?? null);
const canGoToPrevious = computed(() => currentIndex.value > 0);
const canGoToNext = computed(() => currentIndex.value < totalItems.value - 1);
const hasMultipleItems = computed(() => totalItems.value > 1);

function goToPrevious() {
  if (!canGoToPrevious.value) {
    return;
  }

  currentIndex.value -= 1;
}

function goToNext() {
  if (!canGoToNext.value) {
    return;
  }

  currentIndex.value += 1;
}
</script>

<template>
  <section class="item-navigator">
    <div v-if="hasMultipleItems" class="item-navigator-controls">
      <button
        type="button"
        class="item-navigator-button"
        :aria-label="previousLabel"
        :disabled="!canGoToPrevious"
        @click="goToPrevious"
      >
        <PhArrowLeft :size="16" weight="bold" />
      </button>
      <span v-if="showPosition" class="item-navigator-position">
        {{ currentIndex + 1 }} / {{ totalItems }}
      </span>
      <button
        type="button"
        class="item-navigator-button"
        :aria-label="nextLabel"
        :disabled="!canGoToNext"
        @click="goToNext"
      >
        <PhArrowRight :size="16" weight="bold" />
      </button>
    </div>

    <slot
      v-if="currentItem"
      :current-item="currentItem"
      :current-index="currentIndex"
      :total-items="totalItems"
      :can-go-to-previous="canGoToPrevious"
      :can-go-to-next="canGoToNext"
    />
  </section>
</template>

<style scoped>
.item-navigator {
  display: grid;
  gap: var(--space-2);
  justify-items: center;
  width: 100%;
}

.item-navigator-controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.item-navigator-button {
  min-height: 2rem;
  min-width: 2rem;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--color-brand-500) 34%, var(--color-border));
  background: color-mix(in oklab, var(--color-bg-surface) 88%, black);
  color: var(--color-text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.item-navigator-button:hover:not(:disabled) {
  border-color: color-mix(in oklab, var(--color-brand-400) 56%, var(--color-border));
}

.item-navigator-button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.item-navigator-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.item-navigator-position {
  min-width: 4.5ch;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}
</style>
