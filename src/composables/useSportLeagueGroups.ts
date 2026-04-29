import type { LeaguePresentationItem } from "@/composables/useLeaguePresentationModel";

export interface SportLeagueGroupViewModel {
  sport: string;
  items: LeaguePresentationItem[];
}

export function toSportLeagueGroups(items: LeaguePresentationItem[]): SportLeagueGroupViewModel[] {
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
