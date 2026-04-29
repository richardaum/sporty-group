import { expect, test } from "@playwright/test";

import { setupLeagueVisualMocks } from "./league-visual.fixtures";

test.beforeEach(async ({ page }) => {
  await setupLeagueVisualMocks(page);
});

test("search result selection closes overlay and opens badge lookup dialog", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open league search" }).click();
  await expect(page.getByLabel("League search mode")).toBeVisible();

  await page.getByLabel("Search leagues").fill("Premier");
  await page
    .getByRole("region", { name: "Search results" })
    .getByRole("button", { name: "Select English Premier League" })
    .click();

  await expect(page.getByLabel("League search mode")).toBeHidden();
  await expect(page.getByRole("dialog", { name: "League badge lookup result" })).toBeVisible();
  await expect(page.getByText("2023")).toBeVisible();
  await expect(page.getByText("2024")).toBeVisible();
  await expect(page).toHaveScreenshot("leagues-search-overlay-badge-dialog.png");
});
