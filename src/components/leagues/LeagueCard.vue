<script setup lang="ts">
import UICard from "@/components/ui/UICard.vue";
import UITypography from "@/components/ui/UITypography.vue";
import type { LeaguePresentationItem } from "@/composables/useLeaguePresentationModel";

defineProps<{
  item: LeaguePresentationItem;
}>();
</script>

<template>
  <UICard interactive>
    <article class="league-card">
      <img
        :src="item.imageSrc"
        :alt="item.imageAlt || `Representative sport image for ${item.strLeague}`"
        class="league-art"
        loading="lazy"
      />
      <div class="league-body">
        <UITypography as="h3" variant="titleSm" class="league-title" truncate>
          {{ item.strLeague }}
        </UITypography>
        <p class="league-meta">
          <span class="league-label">Sport</span>
          <UITypography as="span" truncate>{{ item.strSport }}</UITypography>
        </p>
        <p class="league-meta">
          <span class="league-label">Alternate</span>
          <UITypography as="span" truncate>
            {{ item.alternateLabel || item.strLeagueAlternate }}
          </UITypography>
        </p>
      </div>
    </article>
  </UICard>
</template>

<style scoped>
.league-card {
  display: grid;
  gap: var(--space-3);
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
}

.league-body {
  display: grid;
  gap: var(--space-2);
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
