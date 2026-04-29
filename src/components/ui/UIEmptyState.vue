<script setup lang="ts">
import UIEmptyStateLarge from "@/components/ui/empty-states/UIEmptyStateLarge.vue";
import UIEmptyStateSmall from "@/components/ui/empty-states/UIEmptyStateSmall.vue";
import { PhRowsPlusBottom } from "@phosphor-icons/vue";

export type EmptyStateVariant = "large" | "small";

withDefaults(
  defineProps<{
    variant?: EmptyStateVariant;
    title: string;
    description: string;
    actionLabel?: string;
  }>(),
  {
    variant: "large",
    actionLabel: "",
  },
);

const emit = defineEmits<{
  action: [];
}>();
</script>

<template>
  <UIEmptyStateLarge
    v-if="variant === 'large'"
    :title="title"
    :description="description"
    :action-label="actionLabel || ''"
    @action="emit('action')"
  >
    <template #icon>
      <slot name="icon">
        <PhRowsPlusBottom :size="22" />
      </slot>
    </template>
  </UIEmptyStateLarge>
  <UIEmptyStateSmall v-else :title="title" :description="description">
    <template #icon>
      <slot name="icon">
        <PhRowsPlusBottom :size="22" />
      </slot>
    </template>
  </UIEmptyStateSmall>
</template>
