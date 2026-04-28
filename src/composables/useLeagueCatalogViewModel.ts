import { computed } from "vue";
import type { LeagueListItem } from "../api/sportsDb";
import { useLeaguesQuery } from "./useLeaguesQuery";
import leagueHeroImage from "../assets/leagues/league-hero.jpg";
import league01 from "../assets/leagues/league-01.jpg";
import league02 from "../assets/leagues/league-02.jpg";
import league03 from "../assets/leagues/league-03.jpg";
import league04 from "../assets/leagues/league-04.jpg";
import league05 from "../assets/leagues/league-05.jpg";
import league06 from "../assets/leagues/league-06.jpg";
import league07 from "../assets/leagues/league-07.jpg";
import league08 from "../assets/leagues/league-08.jpg";

interface LeagueCardViewModel extends LeagueListItem {
  imageSrc: string;
}

interface SportRailViewModel {
  sport: string;
  items: LeagueCardViewModel[];
}

const railImages = [league01, league02, league03, league04, league05, league06, league07, league08];

function toCardViewModel(leagues: LeagueListItem[]): LeagueCardViewModel[] {
  return leagues.map((league, index) => ({
    ...league,
    imageSrc: railImages[index % railImages.length],
  }));
}

function toSportRails(items: LeagueCardViewModel[]): SportRailViewModel[] {
  const bySport = new Map<string, LeagueCardViewModel[]>();

  for (const item of items) {
    const sport = item.strSport || "Other";
    const current = bySport.get(sport) ?? [];
    current.push(item);
    bySport.set(sport, current);
  }

  return Array.from(bySport.entries())
    .filter(([, grouped]) => grouped.length >= 4)
    .sort((left, right) => right[1].length - left[1].length)
    .map(([sport, grouped]) => ({
      sport,
      items: grouped,
    }));
}

export function useLeagueCatalogViewModel() {
  const leaguesQuery = useLeaguesQuery();

  const cardItems = computed(() => toCardViewModel(leaguesQuery.data.value ?? []));
  const heroItem = computed(() => cardItems.value[0] ?? null);
  const mainRailItems = computed(() => cardItems.value);
  const sportRails = computed(() => toSportRails(cardItems.value));

  return {
    leaguesQuery,
    heroItem,
    heroImageSrc: leagueHeroImage,
    mainRailItems,
    sportRails,
  };
}
