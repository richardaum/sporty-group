<script setup lang="ts">
import { PhInfo } from "@phosphor-icons/vue";
import UICard from "@/components/ui/UICard.vue";
import UIEmptyState from "@/components/ui/UIEmptyState.vue";
import UIScrollbar from "@/components/ui/UIScrollbar.vue";
import UITypography from "@/components/ui/UITypography.vue";
import { useLeagueSearchOverlayViewModel } from "@/composables/useLeagueSearchOverlayViewModel";
import type { LeaguePresentationItem } from "@/composables/useLeaguesCatalogDataViewModel";

type SearchLeagueItem = LeaguePresentationItem;

interface Props {
  isOpen: boolean;
  items: SearchLeagueItem[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  closeSearch: [];
  selectResult: [leagueId: string];
}>();

const { searchQuery, hasSearchQuery, setSearchQuery, clearSearchQuery, searchResults } =
  useLeagueSearchOverlayViewModel({
    items: () => props.items,
    isOpen: () => props.isOpen,
  });

function getAlternateLabel(item: SearchLeagueItem): string {
  return item.alternateLabel || item.strLeagueAlternate || "Not available";
}

function asSearchLeagueItem(item: unknown): SearchLeagueItem {
  return item as SearchLeagueItem;
}
</script>

<template>
  <Transition name="search-overlay">
    <section
      v-if="isOpen"
      class="search-overlay"
      aria-label="League search mode"
      @keydown.esc.prevent="emit('closeSearch')"
    >
      <button
        type="button"
        class="search-overlay-backdrop"
        aria-label="Close league search"
        @click="emit('closeSearch')"
      />
      <div class="search-overlay-panel">
        <section class="search-shell">
          <div class="search-control">
            <input
              id="league-search-input"
              ref="searchInput"
              :value="searchQuery"
              class="search-input"
              type="search"
              name="league-search"
              aria-label="Search leagues"
              placeholder="Type a league name"
              autocomplete="off"
              @input="setSearchQuery(($event.target as HTMLInputElement).value)"
            />
            <button
              v-if="hasSearchQuery"
              type="button"
              class="search-clear-button"
              aria-label="Clear search"
              @click="clearSearchQuery()"
            >
              Clear
            </button>
          </div>
        </section>

        <UIScrollbar
          class="results-scrollbar"
          skin="dark"
          :suppress-scroll-x="true"
          :track-gap="[0, 0, 0, 0]"
        >
          <section v-if="searchResults.length" class="results-shell" aria-label="Search results">
            <ul class="results-list">
              <li v-for="item in searchResults" :key="item.idLeague" class="results-item">
                <button
                  type="button"
                  class="search-result-trigger"
                  :aria-label="`Select ${asSearchLeagueItem(item).strLeague}`"
                  @click="emit('selectResult', asSearchLeagueItem(item).idLeague)"
                >
                  <UICard interactive>
                    <article class="league-card">
                      <img
                        :src="asSearchLeagueItem(item).imageSrc"
                        :alt="
                          asSearchLeagueItem(item).imageAlt ||
                          `Representative sport image for ${asSearchLeagueItem(item).strLeague}`
                        "
                        class="league-art"
                        loading="lazy"
                      />
                      <div class="league-body">
                        <div class="league-title-row">
                          <UITypography as="h3" variant="titleSm" class="league-title" truncate>
                            {{ asSearchLeagueItem(item).strLeague }}
                          </UITypography>
                          <span
                            class="league-info-button"
                            :aria-label="`Alternate name: ${getAlternateLabel(asSearchLeagueItem(item))}`"
                          >
                            <PhInfo :size="14" aria-hidden="true" />
                            <span class="league-tooltip" role="tooltip">
                              Alternate:
                              {{ getAlternateLabel(asSearchLeagueItem(item)) }}
                            </span>
                          </span>
                        </div>
                        <p class="league-meta">
                          <span class="league-label" title="Sport">Sport</span>
                          <UITypography as="span" class="league-value" truncate>{{
                            asSearchLeagueItem(item).strSport
                          }}</UITypography>
                        </p>
                      </div>
                    </article>
                  </UICard>
                </button>
              </li>
            </ul>
          </section>
          <UIEmptyState
            v-else
            variant="small"
            title="No leagues match your search"
            description="Try another term or clear the search to browse all visible leagues."
          />
        </UIScrollbar>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: var(--space-6);
}

.search-overlay-backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(3, 5, 12, 0.72);
  backdrop-filter: blur(8px);
}

.search-overlay-panel {
  position: relative;
  width: min(100%, 56rem);
  max-height: min(80svh, 40rem);
  padding: 0 var(--space-6) var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: rgba(10, 10, 12, 0.95);
  box-shadow: var(--shadow-lg);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: var(--space-4);
  overflow: hidden;
}

.search-shell {
  display: grid;
  gap: var(--space-2);
  position: sticky;
  top: 0;
  z-index: 3;
  margin-inline: calc(var(--space-6) * -1);
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-border);
  background: rgba(10, 10, 12, 0.95);
  box-shadow: 0 10px 16px -14px rgba(0, 0, 0, 0.85);
}

.search-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.search-control {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.search-input {
  flex: 1 1 16rem;
  min-width: 0;
  min-height: 2.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  font: inherit;
  font-size: 1rem;
  line-height: 1.25;
  padding: 0 var(--space-3);
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.search-input:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.search-clear-button {
  min-height: 2.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  font: inherit;
  font-weight: 600;
  padding: 0 var(--space-4);
  cursor: pointer;
}

.search-clear-button:hover {
  border-color: var(--color-border-strong);
  background: var(--color-bg-subtle);
}

.search-clear-button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.search-overlay-enter-active,
.search-overlay-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.search-overlay-enter-from,
.search-overlay-leave-to {
  opacity: 0;
  transform: scale(0.985);
}

.results-scrollbar {
  min-height: 0;
  margin-inline: calc(var(--space-6) * -1);
}

.results-scrollbar :deep(.ui-scrollbar-scroller) {
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding-left: var(--space-6);
  padding-right: var(--space-6);
}

.results-shell {
  display: grid;
  gap: var(--space-3);
}

.results-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-3);
}

.results-item {
  min-width: 0;
}

.search-result-trigger {
  appearance: none;
  border: 0;
  background: transparent;
  text-align: left;
  width: 100%;
  max-width: 100%;
  padding: 0;
  border-radius: var(--radius-lg);
  min-width: 0;
  cursor: pointer;
}

.search-result-trigger:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.league-card {
  display: flex;
  align-items: stretch;
  gap: var(--space-3);
}

.league-art {
  width: 5rem;
  height: 100%;
  flex: 0 0 5rem;
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

.league-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.league-info-button {
  position: relative;
  display: inline-grid;
  place-items: center;
  min-width: 1.5rem;
  min-height: 1.5rem;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--color-text-secondary);
  padding: 0;
  flex: 0 0 auto;
  cursor: pointer;
}

.league-info-button:hover {
  color: var(--color-text-primary);
  border-color: var(--color-border);
  background: color-mix(in srgb, var(--color-bg-surface) 60%, transparent);
}

.league-tooltip {
  position: absolute;
  right: 0;
  top: calc(100% + var(--space-2));
  width: max-content;
  max-width: min(18rem, 70vw);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
  font-size: 0.75rem;
  line-height: 1.3;
  padding: var(--space-2) var(--space-3);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-2px);
  transition:
    opacity 120ms ease,
    transform 120ms ease;
  z-index: 2;
}

.league-info-button:hover .league-tooltip,
.league-info-button:focus-visible .league-tooltip {
  opacity: 1;
  transform: translateY(0);
}

.league-info-button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.league-body {
  display: grid;
  align-content: start;
  gap: var(--space-1);
  min-width: 0;
  flex: 1 1 auto;
}

.league-meta {
  margin: 0;
  color: var(--color-text-secondary);
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
  gap: var(--space-2);
  min-width: 0;
}

.league-title + .league-meta {
  margin-top: var(--space-1);
}

.league-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  flex: 0 0 auto;
}

.league-value {
  min-width: 0;
  flex: 1 1 auto;
}

@media (prefers-reduced-motion: reduce) {
  .search-overlay-enter-active,
  .search-overlay-leave-active {
    transition: none;
  }
}

@media (max-width: 40rem) {
  .league-art {
    width: 4rem;
    flex-basis: 4rem;
  }
}
</style>
