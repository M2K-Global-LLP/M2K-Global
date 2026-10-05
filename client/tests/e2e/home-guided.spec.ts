import { test, expect } from "@playwright/test";

test("Home guided entry routes from focus to a matching service", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Tender Advisory", exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Assessment" }).click();
  await page.getByRole("link", { name: "Explore Tender Advisory" }).click();
  await expect(page).toHaveURL(/\/services\/tender-advisory$/);
});

test("Home guided entry prefills the selected IT service in Contact", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "IT & Product Delivery", exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Technology" }).click();
  await page.getByRole("link", { name: "Discuss technology with our team" }).click();
  await expect(page).toHaveURL(/\/contact\?service=it-product-delivery$/);
  await expect(page.locator("#contact-service")).toHaveValue("it-product-delivery");
});
