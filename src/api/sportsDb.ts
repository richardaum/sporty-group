const SPORTS_DB_API_URL = "https://www.thesportsdb.com/api/v1/json/3/all_leagues.php";

interface SportsDbLeagueRaw {
  idLeague: string;
  strLeague: string | null;
  strSport: string | null;
  strLeagueAlternate: string | null;
}

interface SportsDbAllLeaguesResponse {
  leagues?: SportsDbLeagueRaw[] | null;
}

export interface LeagueListItem {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string;
}

export async function fetchAllLeagues(signal?: AbortSignal): Promise<LeagueListItem[]> {
  const response = await fetch(SPORTS_DB_API_URL, { signal });

  if (!response.ok) {
    throw new Error(`Unable to load leagues (status ${response.status}).`);
  }

  const data = (await response.json()) as SportsDbAllLeaguesResponse;
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
