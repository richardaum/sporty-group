<script setup lang="ts">
import { computed } from "vue";
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "radix-vue";
import UICard from "@/components/ui/UICard.vue";
import UITypography from "@/components/ui/UITypography.vue";
import UISquareBadge from "@/components/ui/UISquareBadge.vue";
import type { LeaguePresentationItem } from "@/composables/useLeaguesCatalogDataViewModel";

const props = defineProps<{
  item: LeaguePresentationItem;
  isSelected?: boolean;
}>();

const emit = defineEmits<{
  select: [leagueId: string];
}>();

const alternateTags = computed(() => props.item.alternateTags ?? []);
</script>

<template>
  <button
    type="button"
    class="league-card-trigger"
    :class="{ 'league-card-trigger-selected': isSelected }"
    :aria-label="`Select ${item.strLeague}`"
    :aria-pressed="isSelected ? 'true' : 'false'"
    @click="emit('select', item.idLeague)"
  >
    <UICard interactive>
      <article class="league-card">
        <img
          :src="item.imageSrc"
          :alt="item.imageAlt || `Representative sport image for ${item.strLeague}`"
          class="league-art"
          loading="lazy"
        />
        <div class="league-body">
          <div class="league-title-row">
            <UITypography as="h3" variant="titleSm" class="league-title" truncate>
              {{ props.item.strLeague }}
            </UITypography>
            <span v-if="props.isSelected" class="league-selected-badge">Selected</span>
          </div>
          <div
            class="league-alternate-tags"
            :class="{ 'league-alternate-tags-empty': !alternateTags.length }"
            :aria-label="alternateTags.length ? 'League alternate names' : undefined"
          >
            <TooltipProvider :delay-duration="200" :skip-delay-duration="150">
              <TooltipRoot v-for="(tag, index) in alternateTags" :key="`${tag}-${index}`">
                <TooltipTrigger as-child>
                  <UISquareBadge class="league-alternate-tag">
                    {{ tag }}
                  </UISquareBadge>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent class="league-tag-tooltip" :side-offset="6">
                    {{ tag }}
                    <TooltipArrow class="league-tag-tooltip-arrow" />
                  </TooltipContent>
                </TooltipPortal>
              </TooltipRoot>
            </TooltipProvider>
          </div>
          <p class="league-meta">
            <span class="league-label">Sport</span>
            <UITypography as="span" truncate>{{ props.item.strSport }}</UITypography>
          </p>
        </div>
      </article>
    </UICard>
  </button>
</template>

<style scoped>
.league-card-trigger {
  appearance: none;
  border: 0;
  background: transparent;
  text-align: left;
  width: 100%;
  max-width: var(--rail-card-width, 100%);
  padding: 0;
  border-radius: var(--radius-lg);
  min-width: 0;
}

.league-card-trigger:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.league-card-trigger-selected :deep(.ui-card) {
  border-color: color-mix(in oklab, var(--color-brand-500) 60%, var(--color-border));
  box-shadow:
    var(--shadow-soft),
    0 0 0 1px color-mix(in oklab, var(--color-brand-500) 65%, transparent);
}

.league-card {
  display: grid;
  gap: var(--space-3);
  min-width: 0;
}

.league-art {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.league-title {
  margin: 0;
  font-size: 1rem;
  line-height: 1.2;
  letter-spacing: -0.01em;
  flex: 1 1 auto;
  min-width: 0;
}

.league-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.league-selected-badge {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.125rem 0.375rem;
  color: var(--color-text-primary);
  background: color-mix(in oklab, var(--color-brand-500) 24%, transparent);
  flex-shrink: 0;
}

.league-body {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
}

.league-alternate-tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--space-1);
  min-height: auto;
  max-height: none;
  min-width: 0;
  align-items: flex-start;
  align-content: flex-start;
  overflow: visible;
}

.league-alternate-tags-empty {
  visibility: hidden;
}

.league-alternate-tag {
  width: auto;
  max-width: calc((100% - var(--space-1)) / 2);
  flex: 0 1 auto;
}

:deep(.league-tag-tooltip) {
  z-index: 70;
  max-width: 18rem;
  padding: 0.5rem 0.625rem;
  border-radius: var(--radius-sm);
  background: color-mix(in oklab, white 98%, var(--color-bg-surface));
  border: 1px solid color-mix(in oklab, white 98%, var(--color-bg-surface));
  color: #111827;
  font-size: 0.8125rem;
  line-height: 1.4;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.28),
    0 2px 6px rgba(0, 0, 0, 0.2);
}

:deep(.league-tag-tooltip-arrow) {
  fill: color-mix(in oklab, white 94%, var(--color-bg-surface));
}

.league-meta {
  margin: 0;
  color: var(--color-text-secondary);
  display: grid;
  gap: var(--space-1);
}

.league-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
</style>
