import { computed } from "vue";
import type { LeagueListItem } from "@/api/sportsDb";
import { useLeaguesQuery } from "@/composables/useLeaguesQuery";
import {
  toLeaguePresentationItem,
  type LeaguePresentationItem,
} from "@/composables/useLeaguePresentationModel";
import leagueHeroImage from "@/assets/leagues/league-hero.jpg";
import league01 from "@/assets/leagues/league-01.jpg";
import league02 from "@/assets/leagues/league-02.jpg";
import league03 from "@/assets/leagues/league-03.jpg";
import league04 from "@/assets/leagues/league-04.jpg";
import league05 from "@/assets/leagues/league-05.jpg";
import league06 from "@/assets/leagues/league-06.jpg";
import league07 from "@/assets/leagues/league-07.jpg";
import league08 from "@/assets/leagues/league-08.jpg";

export interface SportLeagueGroupViewModel {
  sport: string;
  items: LeaguePresentationItem[];
}

const leagueImages = [
  league01,
  league02,
  league03,
  league04,
  league05,
  league06,
  league07,
  league08,
];

function toLeagueItems(leagues: LeagueListItem[]): LeaguePresentationItem[] {
  return leagues.map((league, index) =>
    toLeaguePresentationItem(league, leagueImages[index % leagueImages.length]),
  );
}

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

export function useLeaguesCatalogDataViewModel() {
  const leaguesQuery = useLeaguesQuery();
  const leagueItems = computed(() => toLeagueItems(leaguesQuery.data.value ?? []));
  const heroItem = computed(() => leagueItems.value[0] ?? null);
  const sportLeagueGroups = computed(() => toSportLeagueGroups(leagueItems.value));

  return {
    leaguesQuery,
    heroItem,
    heroImageSrc: leagueHeroImage,
    leagueItems,
    sportLeagueGroups,
  };
}
