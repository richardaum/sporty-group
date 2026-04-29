import type { Page } from "@playwright/test";

const allLeaguesFixture = {
  leagues: [
    {
      idLeague: "4328",
      strLeague: "English Premier League",
      strSport: "Soccer",
      strLeagueAlternate: "EPL, Premier League",
    },
    {
      idLeague: "4331",
      strLeague: "German Bundesliga",
      strSport: "Soccer",
      strLeagueAlternate: "Fussball-Bundesliga",
    },
  ],
};

const seasonBadgesFixture = {
  seasons: [
    {
      strSeason: "2023-2024",
      strBadge: "https://www.thesportsdb.com/images/media/league/badge/epl-sample.png",
    },
  ],
};

export async function setupLeagueVisualMocks(page: Page): Promise<void> {
  await page.route("**/all_leagues.php", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(allLeaguesFixture),
    });
  });

  await page.route("**/search_all_seasons.php**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(seasonBadgesFixture),
    });
  });
}
