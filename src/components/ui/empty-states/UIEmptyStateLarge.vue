<script setup lang="ts">
import UIButton from "@/components/ui/UIButton.vue";
import UITypography from "@/components/ui/UITypography.vue";
import { PhRowsPlusBottom } from "@phosphor-icons/vue";

defineProps<{
  title: string;
  description: string;
  actionLabel: string;
}>();

const emit = defineEmits<{
  action: [];
}>();
</script>

<template>
  <section class="empty-state" role="status" aria-live="polite">
    <div class="empty-state-icon" aria-hidden="true">
      <slot name="icon">
        <PhRowsPlusBottom :size="22" />
      </slot>
    </div>
    <UITypography as="h2" variant="title" class="empty-state-title">
      {{ title }}
    </UITypography>
    <UITypography as="p" variant="body" class="empty-state-description">
      {{ description }}
    </UITypography>
    <UIButton variant="surface" @click="emit('action')">{{ actionLabel }}</UIButton>
  </section>
</template>

<style scoped>
.empty-state {
  display: grid;
  justify-items: start;
  gap: var(--space-3);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in oklab, var(--color-border) 82%, var(--color-brand-500));
  background:
    radial-gradient(
      circle at 15% 15%,
      color-mix(in oklab, var(--color-brand-500) 18%, transparent),
      transparent 58%
    ),
    var(--color-bg-surface);
}

.empty-state-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: var(--color-brand-500);
  background: color-mix(in oklab, var(--color-brand-500) 14%, transparent);
}

.empty-state-title,
.empty-state-description {
  margin: 0;
  max-width: 44ch;
}

.empty-state-title {
  font-weight: 500;
}

.empty-state-description {
  color: var(--color-text-secondary);
}
</style>
