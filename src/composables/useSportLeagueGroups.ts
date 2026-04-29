import { computed, type MaybeRefOrGetter, toValue } from "vue";
import type {
  LeaguePresentationItem,
  SportLeagueGroupViewModel,
} from "@/composables/useLeaguesCatalogDataViewModel";

function toSportLeagueGroups(items: LeaguePresentationItem[]): SportLeagueGroupViewModel[] {
  const bySport = new Map<string, LeaguePresentationItem[]>();

  for (const item of items) {
    const sport = item.strSport || "Other";
    const current = bySport.get(sport) ?? [];
    current.push(item);
    bySport.set(sport, current);
  }

  return Array.from(bySport.entries())
    .filter(([, grouped]) => grouped.length >= 4)
    .sort((left, right) => right[1].length - left[1].length)
    .map(([sport, grouped]) => ({ sport, items: grouped }));
}

export function useSportLeagueGroups(items: MaybeRefOrGetter<LeaguePresentationItem[]>) {
  const sportLeagueGroups = computed(() => toSportLeagueGroups(toValue(items)));

  return {
    sportLeagueGroups,
  };
}
