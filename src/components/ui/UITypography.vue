<script setup lang="ts">
import { computed } from "vue";

defineOptions({
  name: "UITypography",
});

type TypographyAs = "p" | "span" | "div" | "h1" | "h2" | "h3";
type TypographyVariant = "kicker" | "title" | "titleSm" | "body" | "muted";

const props = withDefaults(
  defineProps<{
    as?: TypographyAs;
    variant?: TypographyVariant;
    truncate?: boolean;
  }>(),
  {
    as: "p",
    variant: "body",
    truncate: false,
  },
);

const tagName = computed(() => props.as);
</script>

<template>
  <component
    :is="tagName"
    class="ui-typography"
    :class="[`ui-typography-${variant}`, { 'ui-typography-truncate': truncate }]"
  >
    <slot />
  </component>
</template>

<style scoped>
.ui-typography {
  margin: 0;
}

.ui-typography-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-typography-kicker {
  color: var(--color-brand-600);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.75rem;
}

.ui-typography-title {
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  font-weight: 800;
}

.ui-typography-titleSm {
  font-size: 1.125rem;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.ui-typography-body {
  color: var(--color-text-primary);
}

.ui-typography-muted {
  color: var(--color-text-secondary);
  max-width: 60ch;
}
</style>
