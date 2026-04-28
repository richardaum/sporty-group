<script setup lang="ts">
defineOptions({
  name: "UICard",
});

withDefaults(
  defineProps<{
    interactive?: boolean;
  }>(),
  {
    interactive: false,
  },
);
</script>

<template>
  <section class="ui-card" :class="{ 'ui-card-interactive': interactive }">
    <header v-if="$slots.header" class="ui-card-header">
      <slot name="header" />
    </header>
    <div class="ui-card-content">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="ui-card-footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.ui-card {
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: var(--space-4);
  display: grid;
  gap: var(--space-3);
}

.ui-card-header {
  display: grid;
  gap: var(--space-1);
}

.ui-card-content {
  display: grid;
  gap: var(--space-2);
}

.ui-card-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  padding-top: var(--space-1);
}

.ui-card-interactive {
  transition:
    border-color 140ms ease,
    background-color 140ms ease,
    box-shadow 140ms ease;
  cursor: pointer;
}

.ui-card-interactive:hover {
  border-color: var(--color-border-strong);
  box-shadow: 0 0 0 1px color-mix(in oklab, var(--color-border-strong) 35%, transparent);
}

.ui-card-interactive:focus-within {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
</style>
