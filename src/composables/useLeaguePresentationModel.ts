import type { LeagueListItem } from "@/api/sportsDb";

export interface LeaguePresentationItem extends LeagueListItem {
  imageSrc: string;
  alternateLabel: string;
  imageAlt: string;
}

function normalizeText(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

export function toLeaguePresentationItem(
  league: LeagueListItem,
  imageSrc: string,
): LeaguePresentationItem {
  const leagueName = normalizeText(league.strLeague);
  const alternate = normalizeText(league.strLeagueAlternate);

  return {
    ...league,
    imageSrc,
    alternateLabel: alternate || "Not available",
    imageAlt: `Representative sport image for ${leagueName || "league"}`,
  };
}
