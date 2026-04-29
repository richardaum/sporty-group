<script setup lang="ts">
import UICard from "@/components/ui/UICard.vue";
import UIRailTrack from "@/components/ui/rail/UIRailTrack.vue";
import UITypography from "@/components/ui/UITypography.vue";

const skeletonItems = Array.from({ length: 8 }, (_, index) => index);
</script>

<template>
  <section class="catalog-shell" aria-label="Loading leagues" aria-busy="true">
    <section class="hero-panel hero-panel-skeleton" aria-hidden="true">
      <div class="hero-vignette">
        <div class="skeleton-block skeleton-block--kicker" />
        <div class="skeleton-block skeleton-block--title" />
        <div class="skeleton-block skeleton-block--lead" />
      </div>
    </section>

    <section class="rail-shell" aria-label="All leagues">
      <UITypography as="h2" variant="titleSm" class="rail-title">Loading catalog</UITypography>
      <UIRailTrack
        :items="skeletonItems"
        aria-label="Loading leagues skeleton"
        scrollbar-skin="dark"
        card-width="narrow"
        :get-key="(_, index) => index"
      >
        <template #default>
          <UICard interactive>
            <article class="league-card">
              <div class="skeleton-art" role="presentation" />
              <div class="league-body skeleton-league-body">
                <div class="skeleton-block skeleton-block--card-title" />
                <div class="skeleton-meta-row">
                  <div class="skeleton-block skeleton-block--label" />
                  <div class="skeleton-block skeleton-block--value" />
                </div>
                <div class="skeleton-meta-row">
                  <div class="skeleton-block skeleton-block--label" />
                  <div class="skeleton-block skeleton-block--value-short" />
                </div>
              </div>
            </article>
          </UICard>
        </template>
      </UIRailTrack>
    </section>
  </section>
</template>

<style scoped>
.catalog-shell {
  display: grid;
  gap: var(--space-6);
}

.rail-shell {
  display: grid;
  gap: var(--space-3);
}

.rail-title {
  margin: 0;
  padding-inline: var(--space-1);
}

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

.hero-panel.hero-panel-skeleton {
  background: var(--color-bg-elevated);
}

.league-card {
  display: grid;
  gap: var(--space-3);
}

.skeleton-art,
.skeleton-block {
  border-radius: var(--radius-sm);
  background: linear-gradient(
    110deg,
    var(--color-bg-surface) 35%,
    var(--color-bg-elevated) 45%,
    var(--color-bg-surface) 55%
  );
  background-size: 220% 100%;
  animation: shimmer 1.6s linear infinite;
}

.skeleton-block--kicker {
  width: 6.5rem;
  height: 0.75rem;
  max-width: 40%;
}

.skeleton-block--title {
  height: 1.75rem;
  width: min(100%, 22rem);
}

.skeleton-block--lead {
  height: 0.875rem;
  width: min(100%, 36rem);
}

.skeleton-art {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.skeleton-league-body {
  min-height: 4.5rem;
}

.skeleton-meta-row {
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  gap: var(--space-2);
  align-items: center;
}

.skeleton-block--card-title {
  height: 1rem;
  width: min(100%, 14rem);
}

.skeleton-block--label {
  height: 0.5rem;
  border-radius: 2px;
  opacity: 0.75;
}

.skeleton-block--value,
.skeleton-block--value-short {
  height: 0.65rem;
  border-radius: 2px;
}

.skeleton-block--value-short {
  width: 78%;
}

@media (min-width: 48rem) {
  .hero-panel,
  .hero-vignette {
    min-height: 76vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-art,
  .skeleton-block {
    animation: none;
  }
}

@keyframes shimmer {
  to {
    background-position-x: -220%;
  }
}
</style>
