import {test, expect} from "@playwright/test";

import {
  fixatureRickCharacterProfile,
  fixatureEpisode,
  fixatureLocation,
} from "../fixatures/characterProfile.js";

const url = "http://localhost:5173/characters/1";

test.beforeEach(async ({ page }) => {
  await page.route(
    "https://rickandmortyapi.com/api/character/1",
    async (route) => {
      route.fulfill({ json: fixatureRickCharacterProfile }); // override the json data
    }
  );
  await page.route(
    "https://rickandmortyapi.com/api/episode/*",
    async (route) => {
      route.fulfill({ json: fixatureEpisode }); // override the json data
    }
  );

  await page.route(
    "https://rickandmortyapi.com/api/location/3",
    async (route) => {
      route.fulfill({ json: fixatureLocation });
    }
  );
  await page.goto(url);
});

test("I can see character details", async ({ page }) => {
  await expect(page.getByText("Rick Sanchez").first()).toBeVisible(); // there are multiple mention of the same character . if we don't use .first() then test will fail
  await expect(page.getByAltText("Photo of Rick Sanchez")).toBeVisible();
  await expect(page.getByText("Male")).toBeVisible();
  await expect(page.getByText("Earth (C-137)")).toBeVisible();
  await expect(page.getByText("Citadel of Ricks")).toBeVisible();
  await expect(page.getByText("unknown")).toBeVisible();
  await expect(page.getByText("101")).toBeVisible();
});

test("I can see the episode cards", async ({page})=> {
	await expect(page.getByText("Pilot", {exact: true})).toBeVisible();
	await expect(page.getByText("S01E01", {exact: true})).toBeVisible();
	await expect(page.getByText("December 2, 2013", {exact: true})).toBeVisible();
})

test("I can visit the episode profile page from character profile", async ({page}) => {
  await page.getByText("Pilot", { exact: true }).click();
  await expect(page).toHaveURL("http://localhost:5173/episodes/1");
});