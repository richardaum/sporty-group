import { useTemplateRef, watch } from "vue";
import { useLeagueSearch } from "@/composables/useLeagueSearch";

interface UseLeagueSearchOverlayViewModelOptions<TItem extends { strLeague: string }> {
  isOpen: () => boolean;
  items: () => TItem[];
}

export function useLeagueSearchOverlayViewModel<TItem extends { strLeague: string }>(
  options: UseLeagueSearchOverlayViewModelOptions<TItem>,
) {
  const searchInputRef = useTemplateRef<HTMLInputElement>("searchInput");
  const { searchQuery, hasSearchQuery, setSearchQuery, clearSearchQuery, searchResults } =
    useLeagueSearch(options.items, options.isOpen);

  watch(options.isOpen, (isOpen) => {
    if (isOpen) {
      requestAnimationFrame(() => {
        searchInputRef.value?.focus();
      });
      return;
    }

    clearSearchQuery();
  });

  return {
    searchInputRef,
    searchQuery,
    hasSearchQuery,
    setSearchQuery,
    clearSearchQuery,
    searchResults,
  };
}
