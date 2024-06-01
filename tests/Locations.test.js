import {test, expect} from "@playwright/test";
import {fixatureLocations, fixatureLocationsPage2, fixatureLocationsPage7, fixatureLocationsSearchFrance} from "../fixatures/locations.js";
const url = "http://localhost:5173/locations";

test.beforeEach(async ({ page }) => {
	await page.route("https://rickandmortyapi.com/api/location?page=1", async (route) => {
		route.fulfill({ json: fixatureLocations });
	});
	await page.route("https://rickandmortyapi.com/api/location?page=2", async (route) => {
		route.fulfill({ json: fixatureLocationsPage2 });
	});
	await page.route("https://rickandmortyapi.com/api/location?name=france&page=1", async (route) => {
		route.fulfill({ json: fixatureLocationsSearchFrance });
	});
	await page.route("https://rickandmortyapi.com/api/location?page=7", async (route) => {
		route.fulfill({ json: fixatureLocationsPage7 });
	});

	await page.route(
    "https://rickandmortyapi.com/api/location?name=fjdslfjldsjf&page=1",
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

test("I can see the location cards", async ({page})=> {
	await expect(page.getByText("Citadel of Ricks")).toBeVisible()
  await expect(page.getByText("Space station").first()).toBeVisible()
})

test("I can search location card by name", async({page})=> {
	await page.getByPlaceholder("Enter name").fill("france");
	await page.getByRole("button", {name : "Search button"}).click();

	await expect(page.getByText("France")).toBeVisible();
	await expect(page.getByText("Country")).toBeVisible();
})

test("prev button is disabled when we are on first page", async ({page})=> {
  await expect(page.getByRole("button", {name : "Go to previous page"})).toBeDisabled();
})

test("We can't click the next page button if we are on the last page", async ({page})=> {
  await page.getByRole("button", {name : "7"}).click();   // location api has only 7 page, so it is the last page
  await expect(page.getByRole("button", {name : "Go to next page"})).toBeDisabled();
})

test("I can goto next page by clicking next page button", async ({page})=> {
  await page.getByRole("button", {name : "Go to next page"}).click();
  
  await expect(page.getByText("Testicle Monster Dimension", {exact: true})).toBeVisible();
	await expect(page.getByText("Dimension", {exact: true}).first()).toBeVisible();

  await expect(page.getByText("Earth (C-500A)", {exact: true})).toBeVisible();
	await expect(page.getByText("Planet", {exact: true}).first()).toBeVisible();
})

test("I can goto page 2 by clicking '2' button", async ({page})=> {
  await page.getByRole("button", {name : "2"}).click(); 

  await expect(page.getByText("Testicle Monster Dimension", {exact: true})).toBeVisible();
	await expect(page.getByText("Dimension", {exact: true}).first()).toBeVisible();

  await expect(page.getByText("Earth (C-500A)", {exact: true})).toBeVisible();
	await expect(page.getByText("Planet", {exact: true}).first()).toBeVisible();
})

test("I can goto previous page by clicking previous page button", async ({page})=> {
  // first go to 2nd page then use previous page button
  await page.getByRole("button", {name : "2"}).click(); 
  await page.getByRole("button", {name : "Go to previous page"}).click();

  await expect(page.getByText("Earth (C-137)", {exact: true})).toBeVisible();
	await expect(page.getByText("Planet", {exact: true}).first()).toBeVisible();

  await expect(page.getByText("Abadango", {exact: true})).toBeVisible();
	await expect(page.getByText("Cluster", {exact: true}).first()).toBeVisible();
})

test("we can see no episode", async ({page})=> {
  await page.getByPlaceholder("Enter name").fill("fjdslfjldsjf") // search for something that's not present in database
  await page.getByRole("button", {name : "Search button"}).click()

  await expect(page.getByText("No location found")).toBeVisible();
})
