<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from "vue";
import UICard from "../ui/UICard.vue";
import UIRailTrack from "../ui/rail/UIRailTrack.vue";
import UITypography from "../ui/UITypography.vue";
import { useLeagueCatalogViewModel } from "../../composables/useLeagueCatalogViewModel";

const { leaguesQuery, heroItem, heroImageSrc, mainRailItems, sportRails } =
  useLeagueCatalogViewModel();
const hasScrolled = shallowRef(false);
type RailLeagueItem = (typeof mainRailItems.value)[number];

const skeletonItems = Array.from({ length: 8 }, (_, index) => index);

function updateScrollState() {
  hasScrolled.value = window.scrollY > 16;
}

function asRailLeagueItem(item: unknown): RailLeagueItem {
  return item as RailLeagueItem;
}

function getMainRailKey(item: unknown): string {
  return asRailLeagueItem(item).idLeague;
}

function getSportRailKey(sport: string, item: unknown): string {
  return `${sport}-${asRailLeagueItem(item).idLeague}`;
}

onMounted(() => {
  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateScrollState);
});
</script>

<template>
  <div class="app-shell">
    <header class="app-nav" :class="{ 'app-nav-scrolled': hasScrolled }">
      <div class="top-bar">
        <div>
          <UITypography as="p" variant="titleSm" class="brand-mark">SportBet</UITypography>
        </div>
        <div>
          <UITypography as="p" variant="muted" class="top-note">Live leagues catalog</UITypography>
        </div>
      </div>
    </header>

    <main class="app-main">
      <section
        v-if="heroItem"
        class="hero-panel"
        :style="{ backgroundImage: `url(${heroImageSrc})` }"
      >
        <div class="hero-vignette">
          <UITypography as="p" variant="kicker">Sporty Group</UITypography>
          <UITypography as="h1" variant="title">{{ heroItem.strLeague }}</UITypography>
          <UITypography as="p" variant="muted">
            {{ heroItem.strSport }} league catalog from TheSportsDB. Alternate title:
            {{ heroItem.strLeagueAlternate }}.
          </UITypography>
        </div>
      </section>

      <section v-if="leaguesQuery.isLoading.value" class="rail-shell" aria-label="Loading leagues">
        <UITypography as="h2" variant="titleSm" class="rail-title">Loading catalog</UITypography>
        <UIRailTrack
          :items="skeletonItems"
          aria-label="Loading leagues skeleton"
          :scrollable="false"
          card-width="narrow"
          :get-key="(_, index) => index"
        >
          <template #default>
            <div class="card-skeleton" />
          </template>
        </UIRailTrack>
      </section>

      <section v-else-if="mainRailItems.length" class="catalog-shell">
        <p
          v-if="leaguesQuery.isError.value"
          class="status status-error"
          role="status"
          aria-live="polite"
        >
          Showing the last loaded leagues. Refresh failed.
        </p>

        <section class="rail-shell" aria-label="All leagues">
          <UITypography as="h2" variant="titleSm" class="rail-title">All leagues</UITypography>
          <UIRailTrack
            :items="mainRailItems"
            aria-label="Scrollable leagues list"
            scrollbar-skin="dark"
            card-width="narrow"
            :get-key="getMainRailKey"
          >
            <template #default="{ item }">
              <UICard interactive>
                <article class="league-card">
                  <img
                    :src="asRailLeagueItem(item).imageSrc"
                    :alt="`Representative sport image for ${asRailLeagueItem(item).strLeague}`"
                    class="league-art"
                    loading="lazy"
                  />
                  <div class="league-body">
                    <UITypography as="h3" variant="titleSm" class="league-title" truncate>
                      {{ asRailLeagueItem(item).strLeague }}
                    </UITypography>
                    <p class="league-meta">
                      <span class="league-label">Sport</span>
                      <UITypography as="span" truncate>{{
                        asRailLeagueItem(item).strSport
                      }}</UITypography>
                    </p>
                    <p class="league-meta">
                      <span class="league-label">Alternate</span>
                      <UITypography as="span" truncate>
                        {{ asRailLeagueItem(item).strLeagueAlternate }}
                      </UITypography>
                    </p>
                  </div>
                </article>
              </UICard>
            </template>
          </UIRailTrack>
        </section>

        <section
          v-for="rail in sportRails"
          :key="rail.sport"
          class="rail-shell"
          :aria-label="`${rail.sport} leagues`"
        >
          <UITypography as="h2" variant="titleSm" class="rail-title">{{ rail.sport }}</UITypography>
          <UIRailTrack
            :items="rail.items"
            :aria-label="`${rail.sport} horizontal rail`"
            scrollbar-skin="dark"
            card-width="narrow"
            :get-key="(item) => getSportRailKey(rail.sport, item)"
          >
            <template #default="{ item }">
              <UICard interactive>
                <article class="league-card">
                  <img
                    :src="asRailLeagueItem(item).imageSrc"
                    :alt="`Representative sport image for ${asRailLeagueItem(item).strLeague}`"
                    class="league-art"
                    loading="lazy"
                  />
                  <div class="league-body">
                    <UITypography as="h3" variant="titleSm" class="league-title" truncate>
                      {{ asRailLeagueItem(item).strLeague }}
                    </UITypography>
                    <p class="league-meta">
                      <span class="league-label">Sport</span>
                      <UITypography as="span" truncate>{{
                        asRailLeagueItem(item).strSport
                      }}</UITypography>
                    </p>
                    <p class="league-meta">
                      <span class="league-label">Alternate</span>
                      <UITypography as="span" truncate>
                        {{ asRailLeagueItem(item).strLeagueAlternate }}
                      </UITypography>
                    </p>
                  </div>
                </article>
              </UICard>
            </template>
          </UIRailTrack>
        </section>
      </section>

      <section v-else-if="leaguesQuery.isError.value" class="status-group">
        <p class="status status-error" role="status" aria-live="polite">
          We could not load leagues right now.
        </p>
        <button type="button" class="retry-button" @click="leaguesQuery.refetch()">
          Try again
        </button>
      </section>

      <p v-else class="status" role="status" aria-live="polite">
        No leagues were returned by the API.
      </p>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100svh;
  background: var(--color-bg-canvas);
}

.app-main {
  width: min(100%, 110rem);
  margin: 0 auto;
  padding: var(--space-7) 0 var(--space-6);
  display: grid;
  gap: var(--space-6);
}

.app-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: var(--space-3) var(--space-4);
  transition: background-color 220ms ease;
}

.app-nav-scrolled {
  background: rgba(0, 0, 0, 0.9);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(8px);
}

.top-bar {
  width: min(100%, 110rem);
  margin: 0 auto;
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.brand-mark {
  color: var(--color-brand-500);
  max-width: unset;
}

.top-note {
  font-size: 0.875rem;
  max-width: unset;
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

.card-skeleton {
  border-radius: var(--radius-lg);
  aspect-ratio: 16 / 9;
  background: linear-gradient(
    110deg,
    var(--color-bg-surface) 35%,
    var(--color-bg-elevated) 45%,
    var(--color-bg-surface) 55%
  );
  background-size: 220% 100%;
  animation: shimmer 1.6s linear infinite;
}

.status {
  margin: 0;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}

.status-group {
  display: grid;
  gap: var(--space-3);
}

.status-error {
  color: var(--color-error);
}

.retry-button {
  min-height: 2.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  font: inherit;
  font-weight: 600;
  padding: 0 var(--space-4);
  justify-self: start;
  cursor: pointer;
}

.retry-button:hover {
  border-color: var(--color-border-strong);
  background: var(--color-bg-subtle);
}

.retry-button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

@media (min-width: 48rem) {
  .hero-panel,
  .hero-vignette {
    min-height: 76vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-skeleton {
    animation: none;
  }
}

@keyframes shimmer {
  to {
    background-position-x: -220%;
  }
}
</style>
