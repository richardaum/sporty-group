import { shallowRef, watch, type Ref } from "vue";

export function useDebouncedRef<T>(source: Ref<T>, delayMs: number) {
  const debouncedValue = shallowRef(source.value) as Ref<T>;

  watch(
    source,
    (value, _, onCleanup) => {
      const timeoutId = window.setTimeout(() => {
        debouncedValue.value = value;
      }, delayMs);

      onCleanup(() => {
        window.clearTimeout(timeoutId);
      });
    },
    { immediate: true },
  );

  return debouncedValue;
}
