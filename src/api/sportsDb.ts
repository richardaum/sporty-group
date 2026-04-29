import { apiClient } from "@/api/apiClient";

const SPORTS_DB_API_URL = "https://www.thesportsdb.com/api/v1/json/3/all_leagues.php";
const SPORTS_DB_SEASONS_API_URL =
  "https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php";

interface SportsDbLeagueRaw {
  idLeague: string;
  strLeague: string | null;
  strSport: string | null;
  strLeagueAlternate: string | null;
}

interface SportsDbAllLeaguesResponse {
  leagues?: SportsDbLeagueRaw[] | null;
}

interface SportsDbSeasonRaw {
  strSeason: string | null;
  strBadge: string | null;
}

interface SportsDbLeagueSeasonsResponse {
  seasons?: SportsDbSeasonRaw[] | null;
}

export interface LeagueListItem {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string;
}

export interface LeagueSeasonBadge {
  season: string;
  badgeUrl: string | null;
}

export async function fetchAllLeagues(signal?: AbortSignal): Promise<LeagueListItem[]> {
  const data = await apiClient.get<SportsDbAllLeaguesResponse>(SPORTS_DB_API_URL, { signal });
  const leagues = Array.isArray(data.leagues) ? data.leagues : [];

  return leagues
    .filter((league) => Boolean(league.idLeague))
    .map((league) => ({
      idLeague: league.idLeague,
      strLeague: league.strLeague?.trim() || "Unknown league",
      strSport: league.strSport?.trim() || "Unknown sport",
      strLeagueAlternate: league.strLeagueAlternate?.trim() || "N/A",
    }));
}

export async function fetchLeagueSeasonBadges(
  leagueId: string,
  signal?: AbortSignal,
): Promise<LeagueSeasonBadge[]> {
  const requestUrl = new URL(SPORTS_DB_SEASONS_API_URL);
  requestUrl.searchParams.set("badge", "1");
  requestUrl.searchParams.set("id", leagueId);

  const data = await apiClient.get<SportsDbLeagueSeasonsResponse>(requestUrl, { signal });
  const seasons = Array.isArray(data.seasons) ? data.seasons : [];

  return seasons.map((season) => ({
    season: season.strSeason?.trim() || "Unknown season",
    badgeUrl: season.strBadge?.trim() || null,
  }));
}
