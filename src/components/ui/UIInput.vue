<script setup lang="ts">
import { useSlots } from "vue";

defineOptions({
  name: "UIInput",
});

const model = defineModel<string>({ required: true });
const slots = useSlots();

withDefaults(
  defineProps<{
    id?: string;
    label?: string;
    placeholder?: string;
    helperText?: string;
    errorText?: string;
    disabled?: boolean;
    hasError?: boolean;
  }>(),
  {
    id: "",
    label: "",
    placeholder: "",
    helperText: "",
    errorText: "",
    disabled: false,
    hasError: false,
  },
);
</script>

<template>
  <div class="ui-input-field">
    <label v-if="label" class="ui-input-label" :for="id || undefined">{{ label }}</label>

    <div class="ui-input-root">
      <span v-if="slots.leading" class="ui-input-leading-icon" aria-hidden="true">
        <slot name="leading" />
      </span>

      <input
        :id="id || undefined"
        v-model="model"
        class="ui-input"
        :class="{
          'ui-input-error': hasError,
          'ui-input-with-leading-icon': !!slots.leading,
          'ui-input-with-trailing-icon': !!slots.trailing,
        }"
        type="text"
        :placeholder="placeholder"
        :aria-invalid="hasError"
        :aria-describedby="id ? `${id}-hint` : undefined"
        :disabled="disabled"
      />

      <span v-if="slots.trailing" class="ui-input-trailing-icon" aria-hidden="true">
        <slot name="trailing" />
      </span>
    </div>

    <p
      v-if="hasError && errorText"
      :id="id ? `${id}-hint` : undefined"
      class="ui-input-message-error"
    >
      {{ errorText }}
    </p>
    <p v-else-if="helperText" :id="id ? `${id}-hint` : undefined" class="ui-input-message-helper">
      {{ helperText }}
    </p>
  </div>
</template>

<style scoped>
.ui-input-field {
  display: grid;
  gap: var(--space-2);
}

.ui-input-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.ui-input-root {
  position: relative;
}

.ui-input-leading-icon {
  position: absolute;
  top: 50%;
  left: var(--space-3);
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  pointer-events: none;
  display: inline-flex;
}

.ui-input-trailing-icon {
  position: absolute;
  top: 50%;
  right: var(--space-3);
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  pointer-events: none;
  display: inline-flex;
}

.ui-input {
  width: 100%;
  min-height: 2.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: color-mix(in oklab, var(--color-bg-elevated) 90%, black);
  color: var(--color-text-primary);
  font: inherit;
  padding: 0 var(--space-3);
  transition:
    border-color 140ms ease,
    background-color 140ms ease;
}

.ui-input::placeholder {
  color: color-mix(in oklab, var(--color-text-secondary) 75%, transparent);
}

.ui-input:hover {
  border-color: var(--color-border-strong);
  background: var(--color-bg-elevated);
}

.ui-input:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.ui-input-error {
  border-color: var(--color-error);
}

.ui-input-with-leading-icon {
  padding-left: calc(var(--space-3) * 2 + 18px);
}

.ui-input-with-trailing-icon {
  padding-right: calc(var(--space-3) * 2 + 18px);
}

.ui-input:disabled {
  cursor: not-allowed;
  opacity: 0.65;
  background: color-mix(in oklab, var(--color-bg-subtle) 80%, black);
}

.ui-input-message-helper {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.ui-input-message-error {
  margin: 0;
  color: var(--color-error);
  font-size: 0.875rem;
}
</style>
