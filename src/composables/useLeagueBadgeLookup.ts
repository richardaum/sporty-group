import { computed, shallowRef } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { fetchLeagueSeasonBadges } from "@/api/sportsDb";
import type { LeaguePresentationItem } from "@/composables/useLeaguesCatalogDataViewModel";
import type { PreviewAsset } from "@/composables/useBadgeLookupDataView";

type LeagueLookupItem = LeaguePresentationItem;

export function useLeagueBadgeLookup(items: () => LeagueLookupItem[]) {
  const selectedLeagueId = shallowRef<string | null>(null);

  const selectedLeague = computed(() => {
    if (!selectedLeagueId.value) {
      return null;
    }

    return items().find((item) => item.idLeague === selectedLeagueId.value) ?? null;
  });

  const badgesQuery = useQuery({
    queryKey: computed(() => ["league-season-badges", selectedLeagueId.value]),
    enabled: computed(() => Boolean(selectedLeagueId.value)),
    queryFn: ({ signal }) => fetchLeagueSeasonBadges(selectedLeagueId.value as string, signal),
  });

  const primaryBadge = computed(() => badgesQuery.data.value?.[0] ?? null);
  const badgePreviewAssets = computed<PreviewAsset[]>(() => {
    if (!selectedLeague.value) {
      return [];
    }

    return (badgesQuery.data.value ?? []).map((badge) => ({
      imageSrc: badge.badgeUrl ?? "",
      imageAlt: badge.badgeUrl
        ? `Season badge for ${selectedLeague.value?.strLeague}`
        : `No season badge available for ${selectedLeague.value?.strLeague}`,
      strSeason: badge.season,
      caption: badge.badgeUrl ? undefined : "No season badge is available.",
    }));
  });
  const badgePreviewAsset = computed(() => badgePreviewAssets.value[0] ?? null);

  function selectLeague(leagueId: string) {
    selectedLeagueId.value = leagueId;
  }

  function clearSelectedLeague() {
    selectedLeagueId.value = null;
  }

  return {
    selectedLeagueId,
    selectedLeague,
    badgesQuery,
    primaryBadge,
    badgePreviewAssets,
    badgePreviewAsset,
    selectLeague,
    clearSelectedLeague,
  };
}
