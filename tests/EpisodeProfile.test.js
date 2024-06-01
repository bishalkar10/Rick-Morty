import {test, expect} from "@playwright/test";
import {fixaturePilotEpisode, fixatureCharacters} from "../fixatures/episodeProfile.js"

const url = "http://localhost:5173/episodes/1";

test.beforeEach(async ({page})=> {
  await page.route("https://rickandmortyapi.com/api/episode/1", async (route)=> {
    route.fulfill({json : fixaturePilotEpisode})
  })

  await page.route("https://rickandmortyapi.com/api/character/*", async (route)=> {
    route.fulfill({json : fixatureCharacters})
  })

  await page.goto(url);
})

test("Episode is showing correctly", async ({page})=> {
  await expect(page.getByRole('heading', { name: 'Pilot' })).toBeVisible()
})

test("I can see the characters which are featured in this episode", async ({
  page,
}) => {
  await expect(page.getByText("Rick Sanchez")).toBeVisible();
  await expect(page.getByText("Pripudlian")).toBeVisible();
});

test("I can visit the character profile page by clicking a character card", async ({
  page,
}) => {
  await page.getByText("Rick Sanchez", { exact: true }).click();
  await expect(page).toHaveURL("http://localhost:5173/characters/1");
});