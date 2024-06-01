import {test, expect} from "@playwright/test";
import {
  charactersJson,
  charactersJsonPage2,
  charactersJsonPage42,
} from "../fixatures/characters.js";
import {
  fixatureCharacterSearchNameDavid,
  fixtureCharacterSearchTrafolkianType,
  fixatureCharacterSearchGenderFemale,
  fixatureCharacterSearchSpeciesRobot,
  fixatureCharacterSearchStatusDead,
  fixatureCharacterSearchFilterNameStatusGender,
  fixatureNoCharactersFound
} from "../fixatures/characterSearch.js";

const url = "http://localhost:5173";

test.beforeEach(async ({page})=> {
  await page.route(
    "https://rickandmortyapi.com/api/character?page=1",
    async (route) => {
      route.fulfill({ json: charactersJson }); // override the json data
    }
  );

  await page.route(
    "https://rickandmortyapi.com/api/character?page=2",
    async (route) => {
      route.fulfill({ json: charactersJsonPage2 }); // override the json data
    }
  );

  await page.route(
    "https://rickandmortyapi.com/api/character?page=42",
    async (route) => {
      route.fulfill({ json: charactersJsonPage42 }); // override the json data
    }
  );
  await page.goto(url)
})

test("Page title is correct", async ({ page }) => {
  const title = await page.title()
  expect(title).toBe("Rick and Morty");
});


test("I can see Rick Sanchez card", async ({page})=> {
  await expect(page.getByText("Rick Sanchez")).toBeVisible();
  await expect(page.getByAltText("Photo of Rick Sanchez")).toBeVisible();
})

test("I can see 'Ants in my Eyes Johnson Card", async({page})=> {
  await expect(page.getByText("Ants in my Eyes Johnson")).toBeVisible()
  await expect(page.getByAltText("Photo of Ants in my Eyes Johnson")).toBeVisible()
})

test("I can goto next page by clicking next page button", async ({page})=> {
  await page.getByRole("button", {name : "Go to next page"}).click();

  await expect(page.getByText("Aqua Morty")).toBeVisible()
  await expect(page.getByAltText("Photo of Aqua Morty")).toBeVisible()

  await expect(page.getByText("Beth's Mytholog")).toBeVisible()
  await expect(page.getByAltText("Photo of Beth's Mytholog")).toBeVisible()
})

test("I can goto page 2", async ({page})=> {
  await page.getByRole("button", {name : "2"}).first().click(); // there are two button with '2'-  2 and 42. if we don't use .first() we will get "Error : strict mode violation"

  await expect(page.getByText("Aqua Morty")).toBeVisible()
  await expect(page.getByAltText("Photo of Aqua Morty")).toBeVisible()

  await expect(page.getByText("Beth's Mytholog")).toBeVisible()
  await expect(page.getByAltText("Photo of Beth's Mytholog")).toBeVisible()
})

test("I can goto next page by clicking previous page button", async ({page})=> {
  // first got to 2nd page then use previous page button
  await page.getByRole("button", {name : "2"}).first().click(); // there are two button 2 and 42. if we don't use .first() we will get "Error : strict mode violation"
  await page.getByRole("button", {name : "Go to previous page"}).click();

  await expect(page.getByText("Rick Sanchez")).toBeVisible();
  await expect(page.getByAltText("Photo of Rick Sanchez")).toBeVisible();

  await expect(page.getByText("Ants in my Eyes Johnson")).toBeVisible()
  await expect(page.getByAltText("Photo of Ants in my Eyes Johnson")).toBeVisible()
})

test("prev button is disabled when we are on first page", async ({page})=> {
  await expect(page.getByRole("button", {name : "Go to previous page"})).toBeDisabled();
})

test("We can't click the next page button if we are on the last page", async ({page})=> {
  await page.getByRole("button", {name : "42"}).click();  // character api has 42 page, so it is the last page
  await expect(page.getByRole("button", {name : "Go to next page"})).toBeDisabled();
})

test.describe("search Characters", ()=> {
  test.beforeEach(async ({page})=> {

    await page.route(
      "https://rickandmortyapi.com/api/character?name=David&page=1",
      async (route) => {
        route.fulfill({ json: fixatureCharacterSearchNameDavid }); // override the json data
      }
    );

    await page.route(
      "https://rickandmortyapi.com/api/character?type=Traflorkian&page=1",
      async (route) => {
        route.fulfill({ json: fixtureCharacterSearchTrafolkianType });
      }
    );
    await page.route(
      "https://rickandmortyapi.com/api/character?gender=female&page=1",
      async (route) => {
        route.fulfill({ json: fixatureCharacterSearchGenderFemale });
      }
    );
    await page.route(
      "https://rickandmortyapi.com/api/character?species=robot&page=1",
      async (route) => {
        route.fulfill({ json: fixatureCharacterSearchSpeciesRobot });
      }
    );
    await page.route(
      "https://rickandmortyapi.com/api/character?status=dead&page=1",
      async (route) => {
        route.fulfill({ json: fixatureCharacterSearchStatusDead });
      }
    );
    await page.route(
      " https://rickandmortyapi.com/api/character?name=morty&gender=male&status=dead&page=1",
      async (route) => {
        route.fulfill({ json: fixatureCharacterSearchFilterNameStatusGender });
      }
    );
    await page.route(
      "https://rickandmortyapi.com/api/character?name=fjdslfjldsjf&page=1",
      async (route) => {
        route.fulfill({json: fixatureNoCharactersFound});
      }
    )
    await page.route(
      "https://rickandmortyapi.com/api/character?name=fjdslfjldsjf&page=1",
      async (route) => {
        // Fulfill the route with a 404 status code and the custom error message
        route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({"error":"There is nothing here"})
        });
      }
    );
    await page.getByRole("button", {name: "Toggle filter button"}).click() // open the filter 
  })

  test("I can search character by name", async ({page})=> {
    await page.getByPlaceholder("Enter name").fill("David");
    await page.getByRole("button", {name : "Search button"}).click()

    await expect(page.getByText("David Letterman")).toBeVisible();
    await expect(page.getByAltText("David Letterman")).toBeVisible()
  })

  test("I can search characters by applying filter type", async ({ page }) => {
    await page.getByLabel("Character type").fill("Traflorkian");
    await page.getByLabel("Apply").click();

    await expect(page.getByText("Traflorkian", { exact: true })).toBeVisible();
    await expect(page.getByText("Traflorkian Journalist", { exact: true })).toBeVisible();
  });

  test("I can search characters by applying filter gender", async ({page}) => {
    await page.getByLabel("Choose a gender").selectOption({ value: "female" });
    await page.getByLabel("Apply").click();

    await expect(page.getByText("Summer Smith", { exact: true })).toBeVisible();
    await expect(page.getByText("Bearded Lady", { exact: true })).toBeVisible();
  });

  test("I can search characters by applying filter species", async ({page}) => {
    await page.getByLabel("Choose a species").selectOption({ value: "robot" });
    await page.getByLabel("Apply").click();

    await expect(page.getByText("Conroy", { exact: true })).toBeVisible();
    await expect(page.getByText("Robot Rick", { exact: true })).toBeVisible();
  });

  test("I can search characters by applying filter status", async ({page}) => {
    await page.getByLabel("Choose a status").selectOption({ value: "dead" });
    await page.getByLabel("Apply").click();

    await expect(page.getByText("Alexander", { exact: true })).toBeVisible();
    await expect(page.getByText("Adjudicator Rick", { exact: true })).toBeVisible();
  });

  test("I can search by name and apply filter status & gender", async ({page}) => {
    await page.getByPlaceholder("Enter name").fill("morty");
    await page.getByLabel("Choose a gender").selectOption({ value: "male" });
    await page.getByLabel("Choose a status").selectOption({ value: "dead" });
    await page.getByLabel("Apply").click();

    await expect(page.getByText("Big Morty", { exact: true })).toBeVisible();
    await expect(page.getByText("Cop Morty", { exact: true })).toBeVisible();
  });

  test("we can see no characters", async ({page})=> {
    await page.getByPlaceholder("Enter name").fill("fjdslfjldsjf") // search for something that's not present in database
    await page.getByRole("button", {name : "Search button"}).click()

    await expect(page.getByText("No character found")).toBeVisible();

  })
})
