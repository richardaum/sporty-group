import { shallowRef } from "vue";
import { useSearchOverlayKeydown } from "@/composables/useSearchOverlayKeydown";

export function useLeaguesSearchOverlay() {
  const isSearchOverlayOpen = shallowRef(false);

  function openSearchOverlay() {
    isSearchOverlayOpen.value = true;
  }

  function closeSearchOverlay() {
    isSearchOverlayOpen.value = false;
  }

  useSearchOverlayKeydown({
    isSearchModeOpen: isSearchOverlayOpen,
    openSearchOverlay,
    closeSearchOverlay,
  });

  return {
    isSearchOverlayOpen,
    openSearchOverlay,
    closeSearchOverlay,
  };
}
