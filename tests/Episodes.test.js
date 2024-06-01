import {test, expect} from "@playwright/test";
import {
  fixatureEpisodes,
  fixatureEpisodesPage2,
  fixatureEpisodesPage3, 
  fixatureEpisodeSearchPromo,
} from "../fixatures/episodes.js";

const url = "http://localhost:5173/episodes";

test.beforeEach(async ({ page }) => {
  
  await page.route("https://rickandmortyapi.com/api/episode?page=1", async (route) => {
    route.fulfill({ json: fixatureEpisodes });
  });
  await page.route("https://rickandmortyapi.com/api/episode?page=2", async (route) => {
    route.fulfill({ json: fixatureEpisodesPage2 });
  });
  await page.route("https://rickandmortyapi.com/api/episode?page=3", async (route) => {
    route.fulfill({ json: fixatureEpisodesPage3 });
  });
  await page.route("https://rickandmortyapi.com/api/episode?name=promo&page=1", async (route) => {
    route.fulfill({ json: fixatureEpisodeSearchPromo });
  });
  await page.route(
    "https://rickandmortyapi.com/api/episode?name=fjdslfjldsjf&page=1",
    async (route) => {
      // Fulfill the route with a 404 status code and the custom error message
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({"error":"There is nothing here"})
      });
    }
  );
  await page.goto(url);
});


test("I can see the episode cards", async ({page})=> {
	await expect(page.getByText("Pilot", {exact: true})).toBeVisible();
	await expect(page.getByText("S01E01", {exact: true})).toBeVisible();
	await expect(page.getByText("December 2, 2013", {exact: true})).toBeVisible();
})

test("prev button is disabled when we are on first page", async ({page})=> {
  await expect(page.getByRole("button", {name : "Go to previous page"})).toBeDisabled();
})

test("We can't click the next page button if we are on the last page", async ({page})=> {
  await page.getByRole("button", {name : "3"}).click();   // episodes api has only 3 page, so it is the last page
  await expect(page.getByRole("button", {name : "Go to next page"})).toBeDisabled();
})

test("I can search episode name", async ({page})=> {
  await page.getByPlaceholder("Enter name").fill("promo");
  await page.getByRole("button", {name : "Search button"}).click()

  await expect(page.getByText("Promortyus", {exact: true})).toBeVisible();
	await expect(page.getByText("S04E07", {exact: true})).toBeVisible();
	await expect(page.getByText("May 10, 2020", {exact: true})).toBeVisible();
})

test("I can goto next page by clicking next page button", async ({page})=> {
  await page.getByRole("button", {name : "Go to next page"}).click();
  
  await expect(page.getByText("Pickle Rick", {exact: true})).toBeVisible();
	await expect(page.getByText("S03E03", {exact: true})).toBeVisible();
	await expect(page.getByText("August 6, 2017", {exact: true})).toBeVisible();

  await expect(page.getByText("The Wedding Squanchers", {exact: true})).toBeVisible();
	await expect(page.getByText("S02E10", {exact: true})).toBeVisible();
	await expect(page.getByText("October 4, 2015", {exact: true})).toBeVisible();
})

test("I can goto page 2 by clicking '2' button", async ({page})=> {
  await page.getByRole("button", {name : "2"}).click(); 

  await expect(page.getByText("Pickle Rick", {exact: true})).toBeVisible();
	await expect(page.getByText("S03E03", {exact: true})).toBeVisible();
	await expect(page.getByText("August 6, 2017", {exact: true})).toBeVisible();

  await expect(page.getByText("The Wedding Squanchers", {exact: true})).toBeVisible();
	await expect(page.getByText("S02E10", {exact: true})).toBeVisible();
	await expect(page.getByText("October 4, 2015", {exact: true})).toBeVisible();
})

test("I can goto prev page by clicking previous page button", async ({page})=> {
  // first go to 2nd page then use previous page button
  await page.getByRole("button", {name : "2"}).click(); 
  await page.getByRole("button", {name : "Go to previous page"}).click();

  await expect(page.getByText("Pilot", {exact: true})).toBeVisible();
	await expect(page.getByText("S01E01", {exact: true})).toBeVisible();
	await expect(page.getByText("December 2, 2013", {exact: true})).toBeVisible();
})

test("we can see no episode", async ({page})=> {
  await page.getByPlaceholder("Enter name").fill("fjdslfjldsjf") // search for something that's not present in database
  await page.getByRole("button", {name : "Search button"}).click()

  await expect(page.getByText("No episode found")).toBeVisible();
})
