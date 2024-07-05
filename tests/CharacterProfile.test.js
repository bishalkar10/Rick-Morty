import {test, expect} from "@playwright/test";

// when we click the human or male link on the profile page and it takes us to character/ route
// before the filter can be applied it makes an api call to this route "https://rickandmortyapi.com/api/character?page=1"
// so we need mock this api call else two test will fail offline
import {
  charactersJson,
} from "../fixatures/characters.js";  

import {
  fixatureRickCharacterProfile,
  fixatureEpisode,
  fixatureLocation,
  fixatureFilterGenderMale,
  fixatureFilterSpeciesHuman,
} from "../fixatures/characterProfile.js";

const url = "http://localhost:5173/characters/1";

test.beforeEach(async ({ page }) => {
  await page.route(
    "https://rickandmortyapi.com/api/character?page=1",
    async (route) => {
      route.fulfill({ json: charactersJson }); // override the json data
    }
  );
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
  await page.route(
    "https://rickandmortyapi.com/api/character?gender=male&page=1",
    async (route) => {
      route.fulfill({ json: fixatureFilterGenderMale }); // override the json data
    }
  );
  await page.route(
    "https://rickandmortyapi.com/api/character?species=human&page=1",
    async (route) => {
      route.fulfill({ json: fixatureFilterSpeciesHuman }); // override the json data
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

test("I can see Human characters by clicking 'Human' link from Rick's profile page", async({page})=> {
  await page.getByText("Human").click();
  await expect(page.getByText("Aqua Morty")).toBeVisible();
  await expect(page.getByText("Baby Legs")).toBeVisible()
});

test("I can see Male characters by clicking 'Male' link from Rick's profile page", async({page})=> {
  await page.getByText("Male").click();
  await expect(page.getByText("Aqua Morty")).toBeVisible();
  await expect(page.getByText("Armothy")).toBeVisible();
});