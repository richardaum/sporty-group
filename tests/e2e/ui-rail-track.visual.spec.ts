import { expect, test } from "@playwright/test";

const allLeaguesFixture = {
  leagues: [
    {
      idLeague: "5001",
      strLeague: "League One",
      strSport: "Soccer",
      strLeagueAlternate:
        "Alt 01, Alt 02, Alt 03, Alt 04, Alt 05, Alt 06, Alt 07, Alt 08, Alt 09, Alt 10",
    },
    {
      idLeague: "5002",
      strLeague: "League Two",
      strSport: "Soccer",
      strLeagueAlternate: "L2",
    },
    {
      idLeague: "5003",
      strLeague: "League Three",
      strSport: "Soccer",
      strLeagueAlternate: "L3",
    },
    {
      idLeague: "5004",
      strLeague: "League Four",
      strSport: "Soccer",
      strLeagueAlternate: "L4",
    },
    {
      idLeague: "5005",
      strLeague: "League Five",
      strSport: "Soccer",
      strLeagueAlternate: "",
    },
    {
      idLeague: "5006",
      strLeague: "League Six",
      strSport: "Soccer",
      strLeagueAlternate: "L6",
    },
    {
      idLeague: "5007",
      strLeague: "League Seven",
      strSport: "Soccer",
      strLeagueAlternate: "L7",
    },
    {
      idLeague: "5008",
      strLeague: "League Eight",
      strSport: "Soccer",
      strLeagueAlternate: "",
    },
    {
      idLeague: "5009",
      strLeague: "League Nine",
      strSport: "Soccer",
      strLeagueAlternate: "L9",
    },
    {
      idLeague: "5010",
      strLeague: "League Ten",
      strSport: "Soccer",
      strLeagueAlternate: "L10",
    },
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route("**/all_leagues.php", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(allLeaguesFixture),
    });
  });
});

test("captures alternate badges snapshot with 10 tags", async ({ page }) => {
  await page.goto("/");

  const railSection = page.locator('section[aria-label="All leagues"]');
  await expect(railSection).toBeVisible();
  const firstCard = railSection.locator(".ui-rail-track-card").first();
  await expect(firstCard).toBeVisible();

  const alternateBadges = firstCard.locator(".league-alternate-tag");
  await expect(alternateBadges).toHaveCount(10);
  await expect(firstCard).toHaveJSProperty("clientWidth", 200);

  await expect(firstCard).toHaveScreenshot("ui-rail-track-first-card-10-alternate-badges.png");
});
