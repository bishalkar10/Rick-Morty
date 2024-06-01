import {test, expect} from "@playwright/test";
import {fixatureCitadelOfRicks, fixatureCronenbergEarth, fixatureVenzenulon7, fixatureBeebo, fixatureCharacters} from "../fixatures/locationProfile.js";

test("I can see the location info correctly on the page", async ({ page }) => {
  await page.route("https://rickandmortyapi.com/api/location/3", async (route)=> {
    route.fulfill({json : fixatureCitadelOfRicks})
  })

  await page.route("https://rickandmortyapi.com/api/character/*", async (route)=> {
    route.fulfill({json : fixatureCharacters})
  })

  await page.goto("http://localhost:5173/locations/3");

  await expect(page.getByRole("heading", { name: "Citadel of Ricks" })).toBeVisible();
  await expect(page.getByText("Rick Sanchez")).toBeVisible();
  await expect(page.getByAltText("Photo of Rick Sanchez")).toBeVisible();
  await expect(page.getByText("Morty Smith")).toBeVisible();
  await expect(page.getByAltText("Photo of Morty Smith")).toBeVisible();
  await expect(page.getByText("Adjudicator Rick")).toBeVisible();
  await expect(page.getByAltText("Adjudicator Rick")).toBeVisible();
});

// ! important test case 
test("I can see Cronenberg Earth has no residents", async ({ page }) => {
  await page.route("https://rickandmortyapi.com/api/location/12", async (route)=> {
    route.fulfill({json : fixatureCronenbergEarth})
  })

  await page.goto("http://localhost:5173/locations/12");

  await expect(page.getByText("No Characters")).toBeVisible();
});

// ! important test case
test("Location profile where only one characters reside is working fine", async ({page})=> {

  await page.route("https://rickandmortyapi.com/api/location/10", async (route)=> {
    route.fulfill({json : fixatureVenzenulon7})
  })

  await page.route("https://rickandmortyapi.com/api/character/33", async (route)=> {
    route.fulfill({json : fixatureBeebo})
  })
  await page.goto("http://localhost:5173/locations/10");

  await expect(page.getByText("Beebo")).toBeVisible();
  await expect(page.getByAltText("Photo of Beebo")).toBeVisible();
})

