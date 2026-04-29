import { computed, shallowRef, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useDebouncedRef } from "@/composables/useDebouncedRef";

const SEARCH_DEBOUNCE_MS = 120;

function normalizeTerm(text: string): string {
  return text.trim().toLocaleLowerCase();
}

/**
 * League name filtering with debounced input. Filtering runs only while `isSearchActive` is truthy.
 */
export function useLeagueSearch<TItem extends { strLeague: string }>(
  items: () => TItem[],
  isSearchActive: MaybeRefOrGetter<boolean>,
) {
  const searchQuery = shallowRef("");
  const debouncedQuery = useDebouncedRef(searchQuery, SEARCH_DEBOUNCE_MS);

  /** Debounced substring applied to `items` only while search UI is active. */
  const activeFilterTerm = computed(() => (toValue(isSearchActive) ? debouncedQuery.value : ""));

  const searchResults = computed(() => {
    const term = normalizeTerm(activeFilterTerm.value);
    const list = items();

    if (!term) return list;

    return list.filter((item) => item.strLeague.toLocaleLowerCase().includes(term));
  });

  const hasSearchQuery = computed(() => normalizeTerm(searchQuery.value).length > 0);

  function setSearchQuery(value: string) {
    searchQuery.value = value;
  }

  function clearSearchQuery() {
    searchQuery.value = "";
  }

  return {
    searchQuery,
    hasSearchQuery,
    setSearchQuery,
    clearSearchQuery,
    searchResults,
  };
}
