import { shallowRef } from "vue";
import { useSearchOverlayKeydown } from "@/composables/useSearchOverlayKeydown";

export function useLeaguesCatalogScreenViewModel() {
  const isSearchModeOpen = shallowRef(false);

  function openSearchOverlay() {
    isSearchModeOpen.value = true;
  }

  function closeSearchOverlay() {
    isSearchModeOpen.value = false;
  }

  useSearchOverlayKeydown({
    isSearchModeOpen,
    openSearchOverlay,
    closeSearchOverlay,
  });

  return {
    isSearchModeOpen,
    openSearchOverlay,
    closeSearchOverlay,
  };
}
