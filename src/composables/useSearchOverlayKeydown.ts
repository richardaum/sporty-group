import { unref, type MaybeRefOrGetter } from "vue";
import { useGlobalKeydown } from "@/composables/useGlobalKeydown";

interface UseSearchOverlayKeydownOptions {
  isSearchModeOpen: MaybeRefOrGetter<boolean>;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
}

export function useSearchOverlayKeydown(options: UseSearchOverlayKeydownOptions) {
  function onGlobalKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      options.openSearchOverlay();
      return;
    }

    if (event.key === "Escape" && unref(options.isSearchModeOpen)) {
      event.preventDefault();
      options.closeSearchOverlay();
    }
  }

  useGlobalKeydown(onGlobalKeyDown);
}
