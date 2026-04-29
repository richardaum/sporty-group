<script setup lang="ts">
import { computed } from "vue";
import UIRailTrack from "@/components/ui/rail/UIRailTrack.vue";
import UITypography from "@/components/ui/UITypography.vue";
import UIButton from "@/components/ui/UIButton.vue";
import UISelect from "@/components/ui/UISelect.vue";
import UIEmptyState from "@/components/ui/UIEmptyState.vue";
import UIHero from "@/components/ui/UIHero.vue";
import LeagueCard from "@/components/leagues/LeagueCard.vue";
import LeaguesCatalogSkeleton from "@/components/leagues/LeaguesCatalogSkeleton.vue";
import LeaguesSearchOverlay from "@/components/leagues/LeaguesSearchOverlay.vue";
import { useLeaguesCatalogDataViewModel } from "@/composables/useLeaguesCatalogDataViewModel";
import { useLeaguesSearchOverlay } from "@/composables/useLeaguesSearchOverlay";
import { useSportFilter } from "@/composables/useSportFilter";
import { toSportLeagueGroups } from "@/composables/useSportLeagueGroups";
import { useHasScrolled } from "@/composables/useHasScrolled";
import { PhMagnifyingGlass } from "@phosphor-icons/vue";

const { leaguesQuery, heroImageSrc, leagueItems } = useLeaguesCatalogDataViewModel();
const { isSearchOverlayOpen, openSearchOverlay, closeSearchOverlay } = useLeaguesSearchOverlay();
const { sportFilterOptions, selectedSport, isSportFilterActive, visibleItems } =
  useSportFilter(leagueItems);

type LeagueItem = (typeof leagueItems.value)[number];

const { hasScrolled } = useHasScrolled();

const visibleLeagueItems = computed(() => visibleItems.value);
const heroItem = computed(() =>
  isSportFilterActive.value ? null : (visibleLeagueItems.value[0] ?? null),
);
const sportLeagueGroups = computed(() => toSportLeagueGroups(visibleLeagueItems.value));

function asLeagueItem(item: unknown): LeagueItem {
  return item as LeagueItem;
}

function getLeagueKey(item: unknown): string {
  return asLeagueItem(item).idLeague;
}

function getSportLeagueKey(sport: string, item: unknown): string {
  return `${sport}-${asLeagueItem(item).idLeague}`;
}

function getHeroDescription(item: LeagueItem): string {
  return `${item.strSport} league catalog from TheSportsDB. Alternate title: ${item.strLeagueAlternate}.`;
}

function resetSportFilter() {
  selectedSport.value = "all";
}
</script>

<template>
  <div class="app-shell">
    <header class="app-nav" :class="{ 'app-nav-scrolled': hasScrolled }">
      <div class="top-bar">
        <div>
          <UITypography as="p" variant="titleSm" class="brand-mark">SportBet</UITypography>
        </div>
        <UISelect
          id="sport-filter"
          v-model="selectedSport"
          class="sport-filter"
          placeholder="All sports"
          :options="sportFilterOptions"
          context="header"
          dropdown-direction="bottom"
        />
        <UIButton
          variant="surface"
          class="search-overlay-trigger"
          aria-label="Open league search"
          @click="openSearchOverlay"
        >
          <template #leading>
            <PhMagnifyingGlass :size="16" aria-hidden="true" />
          </template>
          <span class="trigger-shortcut" aria-hidden="true">⌘K</span>
        </UIButton>
      </div>
    </header>

    <main class="app-main">
      <UIHero
        v-if="heroItem"
        kicker="Sporty Group"
        :title="heroItem.strLeague"
        :description="getHeroDescription(heroItem)"
        :image-src="heroImageSrc"
      />

      <LeaguesCatalogSkeleton v-if="leaguesQuery.isLoading.value" />

      <section v-else-if="visibleLeagueItems.length" class="catalog-shell">
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
            :items="visibleLeagueItems"
            aria-label="Scrollable leagues list"
            scrollbar-skin="dark"
            card-width="narrow"
            :get-key="getLeagueKey"
          >
            <template #default="{ item }">
              <LeagueCard :item="asLeagueItem(item)" />
            </template>
          </UIRailTrack>
        </section>

        <section
          v-for="group in sportLeagueGroups"
          :key="group.sport"
          class="rail-shell"
          :aria-label="`${group.sport} leagues`"
        >
          <UITypography as="h2" variant="titleSm" class="rail-title">{{
            group.sport
          }}</UITypography>
          <UIRailTrack
            :items="group.items"
            :aria-label="`${group.sport} horizontal rail`"
            scrollbar-skin="dark"
            card-width="narrow"
            :get-key="(item) => getSportLeagueKey(group.sport, item)"
          >
            <template #default="{ item }">
              <LeagueCard :item="asLeagueItem(item)" />
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

      <UIEmptyState
        v-else-if="isSportFilterActive"
        title="No leagues match this sport filter"
        description="Try another sport, or reset the filter to browse every league."
        action-label="Show all sports"
        @action="resetSportFilter"
      />

      <p v-else class="status" role="status" aria-live="polite">
        No leagues were returned by the API.
      </p>
    </main>

    <LeaguesSearchOverlay
      :is-open="isSearchOverlayOpen"
      :items="visibleLeagueItems"
      @close-search="closeSearchOverlay"
    />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100svh;
  background: var(--color-bg-canvas);
  --layout-max-width: 110rem;
  --layout-inline-pad: var(--space-4);
}

.app-main {
  width: min(100%, var(--layout-max-width));
  margin: 0 auto;
  box-sizing: border-box;
  padding: var(--space-7) var(--layout-inline-pad) var(--space-6);
  display: grid;
  gap: var(--space-6);
}

.app-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  padding-block: var(--space-3);
  padding-inline: 0;
  transition: background-color 220ms ease;
}

.app-nav-scrolled {
  background: rgba(0, 0, 0, 0.9);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(8px);
}

.top-bar {
  width: min(100%, var(--layout-max-width));
  margin: 0 auto;
  min-height: 2.75rem;
  box-sizing: border-box;
  padding-inline: var(--layout-inline-pad);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.sport-filter {
  width: min(20rem, 100%);
}

.search-overlay-trigger {
  justify-self: end;
}

.trigger-shortcut {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.brand-mark {
  color: var(--color-brand-500);
  max-width: unset;
}

.top-note {
  font-size: 0.875rem;
  max-width: unset;
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
  .sport-filter {
    margin-left: auto;
  }
}
</style>
