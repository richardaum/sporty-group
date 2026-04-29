import { computed } from "vue";
import type { LeagueListItem } from "@/api/sportsDb";
import { useLeaguesQuery } from "@/composables/useLeaguesQuery";
import leagueHeroImage from "@/assets/leagues/league-hero.jpg";
import league01 from "@/assets/leagues/league-01.jpg";
import league02 from "@/assets/leagues/league-02.jpg";
import league03 from "@/assets/leagues/league-03.jpg";
import league04 from "@/assets/leagues/league-04.jpg";
import league05 from "@/assets/leagues/league-05.jpg";
import league06 from "@/assets/leagues/league-06.jpg";
import league07 from "@/assets/leagues/league-07.jpg";
import league08 from "@/assets/leagues/league-08.jpg";

export interface LeaguePresentationItem extends LeagueListItem {
  imageSrc: string;
  alternateLabel: string;
  alternateTags: string[];
  imageAlt: string;
}

export interface SportLeagueGroupViewModel {
  sport: string;
  items: LeaguePresentationItem[];
}

export function getLeagueKey(item: LeaguePresentationItem): string {
  return item.idLeague;
}

export function getSportLeagueKey(sport: string, item: LeaguePresentationItem): string {
  return `${sport}-${item.idLeague}`;
}

export function getHeroDescription(item: LeaguePresentationItem): string {
  return `${item.strSport} league catalog from TheSportsDB. Alternate title: ${item.strLeagueAlternate}.`;
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

function normalizeText(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function toAlternateTags(value: string): string[] {
  return value
    .split(",")
    .map((chunk) => chunk.trim())
    .filter((chunk) => {
      if (!chunk) {
        return false;
      }

      return chunk.toLowerCase() !== "n/a";
    });
}

function toLeaguePresentationItem(
  league: LeagueListItem,
  imageSrc: string,
): LeaguePresentationItem {
  const leagueName = normalizeText(league.strLeague);
  const alternate = normalizeText(league.strLeagueAlternate);

  return {
    ...league,
    imageSrc,
    alternateLabel: alternate || "Not available",
    alternateTags: toAlternateTags(alternate),
    imageAlt: `Representative sport image for ${leagueName || "league"}`,
  };
}

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
