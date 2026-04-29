import { expect, test } from "@playwright/test";

import { setupLeagueVisualMocks } from "./league-visual.fixtures";

test.beforeEach(async ({ page }) => {
  await setupLeagueVisualMocks(page);
});

test("captures visual snapshot for league badge lookup dialog", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Select English Premier League" }).click();
  await expect(page.getByText("2023")).toBeVisible();
  await expect(page.getByText("2024")).toBeVisible();
  await expect(page).toHaveScreenshot("league-badge-lookup-dialog.png");
});
