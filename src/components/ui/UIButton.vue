<script setup lang="ts">
defineOptions({
  name: "UIButton",
});

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
  }>(),
  {
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
    type: "button",
  },
);
</script>

<template>
  <button
    :type="type"
    class="ui-button"
    :class="[`ui-button-${variant}`, `ui-button-${size}`]"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <span v-if="$slots.leading && !loading" class="ui-button-icon" aria-hidden="true">
      <slot name="leading" />
    </span>
    <span v-if="loading" class="ui-button-spinner" aria-hidden="true" />
    <span class="ui-button-label">
      <slot />
    </span>
    <span v-if="$slots.trailing && !loading" class="ui-button-icon" aria-hidden="true">
      <slot name="trailing" />
    </span>
  </button>
</template>

<style scoped>
.ui-button {
  border: 1px solid transparent;
  min-height: 2.75rem;
  border-radius: var(--radius-md);
  padding: 0 var(--space-4);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  color: #ffffff;
  transition:
    transform 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease,
    color 180ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.ui-button-primary {
  background: linear-gradient(
    180deg,
    color-mix(in oklab, var(--color-brand-600) 82%, black),
    var(--color-brand-500)
  );
}

.ui-button-primary:hover {
  background: var(--color-brand-600);
  transform: translateY(-1px);
}

.ui-button-primary:active {
  background: var(--color-brand-700);
}

.ui-button-secondary {
  background: color-mix(in oklab, var(--color-bg-elevated) 85%, black);
  color: var(--color-text-primary);
  border-color: var(--color-border);
}

.ui-button-secondary:hover {
  border-color: var(--color-border-strong);
  background: var(--color-bg-subtle);
}

.ui-button-secondary:active {
  background: color-mix(in oklab, var(--color-bg-subtle) 75%, var(--color-text-primary));
}

.ui-button-ghost {
  background: transparent;
  color: var(--color-text-primary);
  border-color: var(--color-brand-100);
}

.ui-button-ghost:hover {
  background: color-mix(in oklab, var(--color-brand-500) 20%, transparent);
}

.ui-button-sm {
  min-height: 2.25rem;
  padding: 0 var(--space-3);
  font-size: 0.875rem;
}

.ui-button-md {
  min-height: 2.75rem;
}

.ui-button-lg {
  min-height: 3.25rem;
  padding: 0 var(--space-5);
  font-size: 1.0625rem;
}

.ui-button-icon {
  display: inline-flex;
  align-items: center;
}

.ui-button-label {
  line-height: 1;
}

.ui-button-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 999px;
  animation: ui-button-spin 0.8s linear infinite;
}

.ui-button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.ui-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
  transform: none;
  background: var(--color-bg-subtle);
}

@keyframes ui-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
