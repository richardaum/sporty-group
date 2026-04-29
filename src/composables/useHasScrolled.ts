import { onMounted, onUnmounted, shallowRef } from "vue";

export function useHasScrolled(threshold = 16) {
  const hasScrolled = shallowRef(false);

  function updateScrollState() {
    hasScrolled.value = window.scrollY > threshold;
  }

  onMounted(() => {
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", updateScrollState);
  });

  return { hasScrolled };
}
