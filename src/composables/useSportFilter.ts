import { computed, shallowRef, type MaybeRefOrGetter, toValue } from "vue";
import type { LeaguePresentationItem } from "@/composables/useLeaguePresentationModel";

export interface SportFilterOption {
  value: string;
  label: string;
}

const ALL_SPORTS_FILTER_VALUE = "all";
const SUPPORTED_SPORT_FILTERS = ["Soccer", "Basketball", "Motorsport"] as const;

function toSportLabel(sport: string | null | undefined): string {
  const trimmedSport = sport?.trim() ?? "";
  return trimmedSport || "Other";
}

function toSportFilterValue(sport: string | null | undefined): string {
  return toSportLabel(sport).toLocaleLowerCase();
}

export function useSportFilter(items: MaybeRefOrGetter<LeaguePresentationItem[]>) {
  const selectedSport = shallowRef(ALL_SPORTS_FILTER_VALUE);

  const sportFilterOptions = computed<SportFilterOption[]>(() => {
    const sports = SUPPORTED_SPORT_FILTERS.map((label) => ({
      value: toSportFilterValue(label),
      label,
    }));

    return [{ value: ALL_SPORTS_FILTER_VALUE, label: "All sports" }, ...sports];
  });

  const isSportFilterActive = computed(() => selectedSport.value !== ALL_SPORTS_FILTER_VALUE);

  const visibleItems = computed(() => {
    const sourceItems = toValue(items);

    if (!isSportFilterActive.value) {
      return sourceItems;
    }

    return sourceItems.filter((item) => toSportFilterValue(item.strSport) === selectedSport.value);
  });

  function setSelectedSport(sport: string) {
    selectedSport.value =
      sport === ALL_SPORTS_FILTER_VALUE ? ALL_SPORTS_FILTER_VALUE : toSportFilterValue(sport);
  }

  return {
    sportFilterOptions,
    selectedSport,
    isSportFilterActive,
    visibleItems,
    setSelectedSport,
  };
}
