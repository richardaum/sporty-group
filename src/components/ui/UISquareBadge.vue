<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: "sm" | "md";
  }>(),
  {
    size: "sm",
  },
);
</script>

<template>
  <span data-testid="ui-square-badge" class="ui-square-badge" :class="`ui-square-badge-${size}`">
    <span class="ui-square-badge-label">
      <slot />
    </span>
  </span>
</template>

<style scoped>
.ui-square-badge {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: color-mix(in oklab, var(--color-surface-2) 80%, transparent);
  color: var(--color-text-secondary);
}

.ui-square-badge-label {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-square-badge-sm {
  max-width: 7.5rem;
  min-height: 1.25rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.6875rem;
  line-height: 1.25;
}

.ui-square-badge-md {
  min-width: 4.75rem;
  min-height: 2rem;
  padding: 0.25rem 0.625rem;
  font-size: 0.875rem;
  line-height: 1.2;
  font-weight: 600;
  color: var(--color-text-primary);
}
</style>
