<script setup lang="ts">
import { PhCaretDown } from "@phosphor-icons/vue";
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "radix-vue";

defineOptions({
  name: "UISelect",
});

export interface SelectOption {
  value: string;
  label: string;
}

const model = defineModel<string | undefined>({ required: true });

withDefaults(
  defineProps<{
    id?: string;
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    disabled?: boolean;
    hasError?: boolean;
    errorText?: string;
    dropdownDirection?: "top" | "bottom";
    context?: "default" | "header";
    contentWidth?: "trigger" | "content";
  }>(),
  {
    id: "",
    label: "",
    placeholder: "Select an option",
    disabled: false,
    hasError: false,
    errorText: "",
    dropdownDirection: "bottom",
    context: "default",
    contentWidth: "trigger",
  },
);
</script>

<template>
  <div class="ui-select-field">
    <label v-if="label" class="ui-select-label" :for="id || undefined">{{ label }}</label>

    <SelectRoot v-model="model" :disabled="disabled">
      <SelectTrigger
        :id="id || undefined"
        class="ui-select-trigger"
        :class="{
          'ui-select-trigger-error': hasError,
          'ui-select-trigger-header': context === 'header',
        }"
        aria-label="Select an option"
        :aria-invalid="hasError"
        :aria-describedby="id ? `${id}-hint` : undefined"
      >
        <SelectValue :placeholder="placeholder" />
        <SelectIcon class="ui-select-icon">
          <PhCaretDown :size="18" aria-hidden="true" />
        </SelectIcon>
      </SelectTrigger>

      <SelectPortal>
        <SelectContent
          class="ui-select-content"
          :class="{
            'ui-select-content-header': context === 'header',
            'ui-select-content-trigger-width': contentWidth === 'trigger',
            'ui-select-content-content-width': contentWidth === 'content',
          }"
          position="popper"
          :side="dropdownDirection"
          :side-offset="8"
        >
          <SelectViewport class="ui-select-viewport">
            <SelectItem
              v-for="option in options"
              :key="option.value"
              class="ui-select-item"
              :value="option.value"
            >
              <SelectItemText>{{ option.label }}</SelectItemText>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>

    <p
      v-if="hasError && errorText"
      :id="id ? `${id}-hint` : undefined"
      class="ui-select-message-error"
    >
      {{ errorText }}
    </p>
  </div>
</template>

<style scoped>
.ui-select-field {
  display: grid;
  gap: var(--space-2);
}

.ui-select-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.ui-select-icon {
  display: inline-flex;
  align-items: center;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.ui-select-trigger {
  width: 100%;
  min-height: 2.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: color-mix(in oklab, var(--color-bg-elevated) 90%, black);
  color: var(--color-text-primary);
  font: inherit;
  padding: 0 var(--space-4) 0 var(--space-3);
  transition:
    border-color 140ms ease,
    background-color 140ms ease;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  text-align: left;
  appearance: none;
}

.ui-select-trigger:hover {
  border-color: var(--color-border-strong);
  background: var(--color-bg-elevated);
}

.ui-select-trigger-header {
  background: color-mix(in oklab, var(--color-bg-surface) 94%, black);
}

.ui-select-trigger-header:hover {
  background: var(--color-bg-surface);
}

.ui-select-trigger:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.ui-select-trigger-error {
  border-color: var(--color-error);
}

.ui-select-trigger[data-disabled] {
  cursor: not-allowed;
  opacity: 0.65;
  background: var(--color-bg-subtle);
}

.ui-select-message-error {
  margin: 0;
  color: var(--color-error);
  font-size: 0.875rem;
}
</style>

<style>
.ui-select-content {
  background: color-mix(in oklab, var(--color-bg-elevated) 82%, transparent);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
  z-index: 50;
  backdrop-filter: blur(10px);
}

.ui-select-content-header {
  background: color-mix(in oklab, var(--color-bg-surface) 84%, transparent);
}

.ui-select-content-trigger-width {
  width: var(--radix-select-trigger-width);
  min-width: var(--radix-select-trigger-width);
}

.ui-select-content-content-width {
  width: max-content;
  min-width: max(var(--radix-select-trigger-width), 12rem);
}

.ui-select-viewport {
  background: inherit;
}

.ui-select-item {
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-primary);
  cursor: pointer;
  outline: none;
}

.ui-select-item[data-highlighted] {
  background: color-mix(in oklab, var(--color-brand-500) 18%, var(--color-bg-subtle));
}
</style>
