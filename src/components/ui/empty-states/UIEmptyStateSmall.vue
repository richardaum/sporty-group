<script setup lang="ts">
import UITypography from "@/components/ui/UITypography.vue";
import { PhRowsPlusBottom } from "@phosphor-icons/vue";

defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <section class="empty-state-small" role="status" aria-live="polite">
    <div class="empty-state-small-icon" aria-hidden="true">
      <slot name="icon">
        <PhRowsPlusBottom :size="18" />
      </slot>
    </div>
    <UITypography as="h2" variant="titleSm" class="empty-state-small-title">
      {{ title }}
    </UITypography>
    <UITypography as="p" variant="body" class="empty-state-small-description">
      {{ description }}
    </UITypography>
  </section>
</template>

<style scoped>
.empty-state-small {
  display: grid;
  justify-items: start;
  gap: var(--space-2);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}

.empty-state-small-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: var(--color-brand-500);
  background: color-mix(in oklab, var(--color-brand-500) 14%, transparent);
}

.empty-state-small-title,
.empty-state-small-description {
  margin: 0;
}

.empty-state-small-description {
  color: var(--color-text-secondary);
}
</style>
