import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { routeManifest } from "../../src/generated/route-manifest.js";

for (const width of [375, 1024, 1440]) for (const route of routeManifest) {
  test(`Phase 5 accessibility ${route.path} at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error" && !(route.path === "/404" && message.text().includes("404 (Not Found)"))) errors.push(message.text());
    });
    expect((await page.goto(route.path))?.status()).toBe(route.path === "/404" ? 404 : 200);
    await expect(page.locator("h1")).toHaveText(route.h1);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveAttribute("href", "#main-content");
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const levels = await page.locator("h1,h2,h3,h4,h5,h6").evaluateAll(nodes => nodes.map(node => Number(node.tagName[1])));
    expect(levels.filter((level, i) => i > 0 && level > levels[i - 1]! + 1)).toEqual([]);
    const audit = await new AxeBuilder({ page }).analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test.describe("Phase 5 without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const route of routeManifest) test(`raw document ${route.path}`, async ({ page, request }) => {
    expect((await page.goto(route.path))?.status()).toBe(route.path === "/404" ? 404 : 200);
    await expect(page.locator("h1")).toHaveText(route.h1);
    await expect(page).toHaveTitle(route.seo.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", route.seo.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.m2kglobal.com" + (route.path === "/" ? "/" : route.path));
    const links = await page.locator('main a[href^="/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("href")!));
    for (const link of new Set(links)) expect((await request.get(link)).status()).toBe(200);
    if (["/privacy-policy", "/terms"].includes(route.path)) await expect(page.locator("main")).toContainText("DRAFT — review before launch");
    await page.locator('footer a[href="/contact"]').first().click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator("main")).toContainText("inquiry@m2kglobal.com");
  });
});
