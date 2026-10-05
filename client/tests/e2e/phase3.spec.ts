import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const routes = ["/projects", "/insights", "/careers", "/privacy-policy", "/terms", "/missing-phase3-page"];
const folder = fileURLToPath(new URL("../../../screenshots/phase3/", import.meta.url));
for (const width of [375, 768, 1024, 1440]) for (const route of routes) {
  test(`Phase 3 ${route} at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      // Chromium reports the intentionally missing document as a network error.
      if (message.type() === "error" && !((route.startsWith("/missing") || route === "/projects") && message.text() === "Failed to load resource: the server responded with a status of 404 (Not Found)")) errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(route);
    expect(response?.status()).toBe(route.startsWith("/missing") || route === "/projects" ? 404 : 200);
    await expect(page.locator("h1")).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await mkdir(folder, { recursive: true });
    await page.screenshot({ path: folder + route.slice(1) + "-" + width + ".png", fullPage: true });
  });
}
test("collection links and unknown detail slugs retain correct HTTP statuses", async ({ page, request }) => {
  const links = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    for (const href of await page.locator('a[href^="/"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")!))) links.add(href);
  }
  for (const link of links) expect((await request.get(link)).status(), link).toBe(200);
  for (const path of ["/projects/placeholder", "/insights/placeholder", "/careers/placeholder", "/projects/unknown", "/insights/unknown", "/careers/unknown"]) {
    const response = await request.get(path); expect(response.status()).toBe(404); expect(await response.text()).toContain("Page not found");
  }
  console.log(`Phase 3 link crawl passed: ${links.size} links and 6 unknown/removed detail routes.`);
});

test("unknown detail documents mount cleanly and remain navigable", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error" && message.text() !== "Failed to load resource: the server responded with a status of 404 (Not Found)") errors.push(message.text()); });
  for (const route of ["/projects/unknown", "/insights/unknown", "/careers/unknown"]) {
    expect((await page.goto(route))?.status()).toBe(404);
    await page.getByRole("link", { name: "Return home", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("h1")).toContainText("Consulting, Technology & Skills");
  }
  expect(errors).toEqual([]);
});
