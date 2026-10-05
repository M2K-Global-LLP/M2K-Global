import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const screenshotRoot = fileURLToPath(new URL("../../../screenshots/", import.meta.url));

test("Home hero presents the service carousel with its active copy above the fold", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const stage = page.locator(".home-carousel-stage");
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  await expect(stage).toBeInViewport();
  await expect(page.getByRole("button", { name: "Next service" })).toBeInViewport();
  const firstImage = page.locator(".home-carousel-slide img").last();
  const slideTitle = page.locator(".home-active-title");
  const slideSummary = page.locator(".home-active-description");
  await expect(page.locator(".home-cinematic-intro .button-row")).toHaveCount(0);
  await expect(slideTitle).toHaveText("Social Impact");
  await expect(slideSummary).toBeVisible();
  await expect(page.locator(".home-active-read-more")).toHaveText("Read More");
  await expect(page.locator(".home-active-slide")).toHaveAttribute("href", "/services/social-impact");
  await expect(firstImage).toHaveAttribute("src", "/images/home/social-impact-team.webp");
  expect(await firstImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.screenshot({ path: resolve(screenshotRoot, "home-hero-carousel-1440.png"), animations: "disabled" });
  await page.getByRole("button", { name: "Show Tender Advisory" }).click();
  await expect(stage).toHaveAttribute("data-active-service", "tender-advisory");
  await expect(page.locator(".home-carousel-slide img").last()).toHaveAttribute("src", "/images/home/tender-advisory-workspace.webp");
  expect(await page.locator(".home-carousel-slide img").last().evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(slideTitle).toHaveText("Tender Advisory");
  await expect(slideSummary).toBeVisible();
  await page.waitForTimeout(450);
  await page.screenshot({ path: resolve(screenshotRoot, "home-carousel-tender-1440.png"), animations: "disabled" });
});

test("clicking the active service slide opens its matching service page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Show Tender Advisory" }).click();
  await page.locator(".home-active-slide").click();
  await expect(page).toHaveURL(/\/services\/tender-advisory\/?$/);
});


test("Export Readiness slide opens its poster-backed page and buyer-growth contact route", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Show Export Readiness" }).click();
  const slideLink = page.locator(".home-active-slide");
  await expect(slideLink).toHaveAttribute("href", "/services/export-readiness");
  await slideLink.click();
  await expect(page).toHaveURL(/export-readiness/);
  await expect(page.getByRole("heading", { level: 1, name: "Export Readiness" })).toBeVisible();
  const poster = page.locator(".service-hero .hero-backdrop img");
  await expect(poster).toHaveAttribute("src", "/images/home/export-readiness.png");
  await expect.poll(() => poster.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page.getByRole("link", { name: "Talk to Our Team" }).last()).toHaveAttribute("href", "/contact?service=export-readiness");
});

test("every service slide displays its own supplied image without a blank state", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const cases = [
    ["Social Impact", "/images/home/social-impact-team.webp"],
    ["Tender Advisory", "/images/home/tender-advisory-workspace.webp"],
    ["IT & Product Delivery", "/images/home/service-support.png"],
    ["Language Training", "/images/home/language-services.jpg"],
    ["Skill Development", "/images/home/skill-development-workshop.webp"],
    ["Export Readiness", "/images/home/export-readiness.png"],
  ] as const;
  const image = page.locator(".home-carousel-slide img").last();
  for (const [title, src] of cases) {
    await page.getByRole("button", { name: `Show ${title}` }).click();
    await expect(image).toHaveAttribute("src", src);
    await expect(page.locator(".home-active-title")).toHaveText(title);
    await expect(page.locator(".home-active-description")).toBeVisible();
    const summaryLineCount = await page.locator(".home-active-description").evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return range.getClientRects().length;
    });
    expect(summaryLineCount, `${title} summary should fill four to five lines`).toBeGreaterThanOrEqual(4);
    expect(summaryLineCount, `${title} summary should stay within five lines`).toBeLessThanOrEqual(5);
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => Number.parseFloat(getComputedStyle(element.parentElement!).opacity))).toBeGreaterThan(0.99);
  }
});

test("Services navbar dropdown opens on hover with readable service links", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const servicesButton = page.getByRole("button", { name: "Services" });
  await servicesButton.hover();
  const dropdown = page.locator("#services-dropdown");
  await expect(dropdown).toBeVisible();
  for (const title of ["Social Impact", "Tender Advisory", "IT & Product Delivery", "Language Training", "Skill Development", "Export Readiness"]) {
    const link = dropdown.getByRole("link", { name: title });
    await expect(link).toBeVisible();
    await expect(link).toHaveCSS("color", "rgb(16, 42, 67)");
  }
  await page.screenshot({ path: resolve(screenshotRoot, "home-services-dropdown-1440.png"), animations: "disabled" });
});
test("service slides advance automatically and pause/resume controls work", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const stage = page.locator(".home-carousel-stage");
  await expect(stage).toHaveAttribute("data-active-service", "social-impact");
  await expect(page.locator(".home-carousel-progress")).toHaveCount(0);
  await expect(page.locator(".home-carousel-dots button.is-active .home-carousel-tab-progress")).toHaveCSS("animation-duration", "4s");
  expect(await page.locator(".home-carousel-dots button.is-active").evaluate((button) => getComputedStyle(button, "::before").display)).toBe("none");
  const activeTab = page.locator(".home-carousel-dots button.is-active");
  const timerPlacement = await activeTab.evaluate((button) => ({ textBottom: button.querySelector("span")!.getBoundingClientRect().bottom, timerTop: button.querySelector(".home-carousel-tab-progress")!.getBoundingClientRect().top }));
  expect(timerPlacement.timerTop).toBeGreaterThan(timerPlacement.textBottom);
  const timerStartedAt = Date.now();
  await expect(stage).toHaveAttribute("data-active-service", "tender-advisory", { timeout: 5500 });
  const advanceMs = Date.now() - timerStartedAt;
  expect(advanceMs).toBeGreaterThanOrEqual(3500);
  expect(advanceMs).toBeLessThan(5500);
  await page.getByRole("button", { name: "Pause service slides" }).click();
  await expect(page.getByRole("button", { name: "Play service slides" })).toBeVisible();
  await page.getByRole("button", { name: "Next service" }).click();
  await expect(stage).toHaveAttribute("data-active-service", "it-product-delivery");
  await page.getByRole("button", { name: "Play service slides" }).click();
  await expect(page.getByRole("button", { name: "Pause service slides" })).toBeVisible();
  await expect(stage).toHaveAttribute("data-active-service", "language-training", { timeout: 5500 });
});

test("manual next and service selection keep autoplay running", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const stage = page.locator(".home-carousel-stage");
  await expect(stage).toHaveAttribute("data-active-service", "social-impact");
  await page.getByRole("button", { name: "Next service" }).click();
  await expect(stage).toHaveAttribute("data-active-service", "tender-advisory");
  await expect(stage).toHaveAttribute("data-active-service", "it-product-delivery", { timeout: 5500 });
  await page.getByRole("button", { name: "Show Language Training" }).click();
  await expect(stage).toHaveAttribute("data-active-service", "language-training");
  await expect(stage).toHaveAttribute("data-active-service", "skill-development", { timeout: 5500 });
  await expect(stage).toHaveAttribute("data-active-service", "export-readiness", { timeout: 5500 });
});

test("reduced motion disables autoplay while keeping manual slide controls", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const stage = page.locator(".home-carousel-stage");
  await page.clock.fastForward(5500);
  await expect(stage).toHaveAttribute("data-active-service", "social-impact");
  await page.getByRole("button", { name: "Next service" }).click();
  await expect(stage).toHaveAttribute("data-active-service", "tender-advisory");
});

test("all services remain readable with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("/");
  const fallback = page.locator(".home-service-static-list");
  await expect(fallback).toBeVisible();
  for (const title of ["Social Impact", "Tender Advisory", "IT & Product Delivery", "Language Training", "Skill Development", "Export Readiness"]) {
    await expect(fallback.getByRole("heading", { name: title })).toBeVisible();
  }
  await context.close();
});
