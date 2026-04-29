<script setup lang="ts">
defineOptions({
  name: "UICard",
});

withDefaults(
  defineProps<{
    interactive?: boolean;
    selected?: boolean;
    fullHeight?: boolean;
  }>(),
  {
    interactive: false,
    selected: false,
    fullHeight: false,
  },
);
</script>

<template>
  <section
    class="ui-card"
    :class="{
      'ui-card-interactive': interactive,
      'ui-card-selected': selected,
      'ui-card-full-height': fullHeight,
    }"
  >
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
  background: linear-gradient(
    180deg,
    color-mix(in oklab, var(--color-bg-elevated) 88%, black),
    var(--color-bg-surface)
  );
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
    transform 200ms ease,
    border-color 200ms ease,
    box-shadow 200ms ease;
  cursor: pointer;
  transform-origin: center;
}

.ui-card-interactive:hover {
  border-color: var(--color-border-strong);
  transform: scale(1.02);
  box-shadow:
    0 10px 26px rgba(0, 0, 0, 0.45),
    0 0 0 1px color-mix(in oklab, var(--color-border-strong) 55%, transparent);
}

.ui-card-interactive:focus-within {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.ui-card-selected {
  border-color: color-mix(in oklab, var(--color-brand-500) 60%, var(--color-border));
  box-shadow:
    var(--shadow-soft),
    0 0 0 1px color-mix(in oklab, var(--color-brand-500) 65%, transparent);
}

.ui-card-full-height {
  height: 100%;
}
</style>
