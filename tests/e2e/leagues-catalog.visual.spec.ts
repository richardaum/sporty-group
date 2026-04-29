import { expect, test } from "@playwright/test";

import { setupLeagueVisualMocks } from "./league-visual.fixtures";

test.beforeEach(async ({ page }) => {
  await setupLeagueVisualMocks(page);
});

test("captures visual snapshot for leagues catalog home", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "All leagues" })).toBeVisible();
  await expect(page).toHaveScreenshot("leagues-catalog-home.png", { fullPage: true });
});
