<script setup lang="ts">
import UITypography from "@/components/ui/UITypography.vue";
import type { LeagueListItem } from "@/api/sportsDb";

defineOptions({
  name: "LeagueHero",
});

interface HeroProps {
  item: LeagueListItem;
  imageSrc: string;
}

const props = defineProps<HeroProps>();
</script>

<template>
  <section class="hero-panel" :style="{ backgroundImage: `url(${props.imageSrc})` }">
    <div class="hero-vignette">
      <UITypography as="p" variant="kicker">Sporty Group</UITypography>
      <UITypography as="h1" variant="title">{{ props.item.strLeague }}</UITypography>
      <UITypography as="p" variant="muted">
        {{ props.item.strSport }} league catalog from TheSportsDB. Alternate title:
        {{ props.item.strLeagueAlternate }}.
      </UITypography>
    </div>
  </section>
</template>

<style scoped>
.hero-panel {
  min-height: 70vh;
  border-radius: var(--radius-lg);
  background-size: cover;
  background-position: center;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.hero-vignette {
  min-height: 70vh;
  display: grid;
  align-content: end;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-5);
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.94) 20%,
    rgba(0, 0, 0, 0.72) 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

@media (min-width: 48rem) {
  .hero-panel,
  .hero-vignette {
    min-height: 76vh;
  }
}
</style>
