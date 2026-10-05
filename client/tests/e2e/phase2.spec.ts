import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const screenshotRoot = fileURLToPath(new URL("../../../screenshots/", import.meta.url));
const routes = ["/", "/about", "/services", "/services/social-impact", "/services/tender-advisory", "/services/it-product-delivery", "/services/language-training", "/services/skill-development", "/services/export-readiness", "/tender-saar"];
const widths = [375, 768, 1024, 1440];
const serviceImageSources: Record<string, string> = { "/services/social-impact": "/images/home/social-impact-team.webp", "/services/tender-advisory": "/images/home/tender-advisory-workspace.webp", "/services/it-product-delivery": "/images/home/analytics-interface.jpeg", "/services/language-training": "/images/home/language-services.jpg", "/services/skill-development": "/images/home/skill-development-workshop.webp", "/services/export-readiness": "/images/home/export-readiness.png" };
for (const width of widths) for (const route of routes) {
  test(route + " at " + width + "px: screenshot, overflow, console and AA checks", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.setViewportSize({ width, height: width === 375 ? 812 : 900 });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    if (serviceImageSources[route]) { const serviceImage = page.locator(".service-hero .hero-backdrop img"); await expect(serviceImage).toHaveAttribute("src", serviceImageSources[route]!); await expect.poll(() => serviceImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true); }
    await page.locator("footer").waitFor();
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all(Array.from(document.images).map((image) => image.complete ? Promise.resolve() : new Promise((resolve) => { image.onload = resolve; image.onerror = resolve; }))); });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(result.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })) }))).toEqual([]);
    await mkdir(screenshotRoot, { recursive: true });
    const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    await page.screenshot({ path: resolve(screenshotRoot, slug + "-" + width + ".png"), fullPage: true, animations: "disabled" });
  });
}

test("header ribbon inverts on hover and hides down, reappears up", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/tender-saar");
  const header = page.locator(".site-header");
  const about = page.locator('.desktop-nav a[href="/about"]');
  await expect(header).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await about.hover();
  await expect(header).toHaveCSS("background-color", "rgb(8, 24, 39)");
  await expect(about).toHaveCSS("color", "rgb(248, 250, 252)");
  await page.mouse.move(900, 650);
  await expect(header).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.mouse.wheel(0, 420);
  await expect(header).toHaveClass(/is-scrolled/);
  await expect(header).toHaveClass(/is-hidden/);
  await page.mouse.wheel(0, -140);
  await expect(header).not.toHaveClass(/is-hidden/);
  await expect(header).toHaveClass(/is-scrolled/);
  await expect(header).toHaveCSS("background-color", "rgb(8, 24, 39)");
  const aboutBox = await about.boundingBox();
  if (aboutBox) await page.mouse.move(aboutBox.x + aboutBox.width / 2, aboutBox.y + aboutBox.height / 2);
  await expect(header).toHaveCSS("background-color", "rgb(248, 250, 252)");
  await expect(about).toHaveCSS("color", "rgb(16, 42, 67)");
  await page.mouse.move(900, 650);
  await page.goto("/");
  await expect(header).not.toHaveClass(/is-scrolled/);
  await expect.poll(() => header.evaluate(element => getComputedStyle(element).backgroundImage)).toContain("linear-gradient");
  await page.getByRole("button", { name: "Services" }).hover();
  await expect(header).toHaveCSS("background-color", "rgb(248, 250, 252)");
  await page.mouse.move(900, 650);
  await page.mouse.wheel(0, 10000);
  await expect(header).toHaveClass(/is-hidden/);
  await page.mouse.wheel(0, -180);
  await expect(header).not.toHaveClass(/is-hidden/);
});test("all navbar, footer and CTA internal links resolve; pricing and other hashes exist", async ({ page, request }) => {
  const links = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    for (const href of await page.locator('header a[href], footer a[href], [data-cta][href]').evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href))) {
      if (href.startsWith("http://127.0.0.1:4173")) links.add(href);
    }
  }
  expect(links.size).toBeGreaterThan(15);
  for (const href of links) {
    const url = new URL(href);
    const response = await request.get(url.pathname + url.search);
    expect(response.status(), href).toBe(200);
    if (url.hash) {
      await page.goto(url.pathname + url.search + url.hash);
      await expect(page.locator('[id="' + decodeURIComponent(url.hash.slice(1)) + '"]')).toHaveCount(1);
    }
  }
  await page.goto("/tender-saar#pricing");
  await expect(page.locator("#pricing")).toBeInViewport();
  console.log("Crawled " + links.size + " unique internal navigation/CTA URLs.");
});
test("footer social icons open the supplied company profiles and use the updated phone", async ({ page }) => {
  await page.goto("/");
  const social = page.locator('footer nav[aria-label="Social media"] a');
  await expect(social).toHaveCount(3);
  await expect(page.getByRole("link", { name: "LinkedIn", exact: true })).toHaveAttribute("href", "https://www.linkedin.com/company/m2k-global-mrgc/?viewAsMember=true");
  await expect(page.getByRole("link", { name: "Instagram", exact: true })).toHaveAttribute("href", "https://www.instagram.com/m2kglobal/");
  await expect(page.getByRole("link", { name: "Twitter", exact: true })).toHaveAttribute("href", "https://x.com/M2KGlobal");
  await expect(page.locator('footer a[href="tel:+919821096817"]')).toBeVisible();
  for (const link of await social.all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await page.goto("/contact");
  await expect(page.locator('.contact-details a[href="tel:+919821096817"]')).toHaveText("+91-9821096817");
});
test("contact marks name, email, phone and message required and blocks an empty phone", async ({ page }) => {
  let requests = 0;
  page.on("request", (request) => { if (request.url().endsWith("/api/contact")) requests += 1; });
  await page.goto("/contact");
  for (const field of ["name", "email", "phone", "message"]) {
    await expect(page.locator(`label[for="contact-${field}"] .required-mark`)).toHaveText("*");
    await expect(page.locator(`#contact-${field}`)).toHaveAttribute("required", "");
  }
  await expect(page.getByText("Fields marked * are required.")).toBeVisible();
  await expect(page.locator('label[for="contact-organization"] .required-mark')).toHaveCount(0);
  await page.locator("#contact-name").fill("Test Contact");
  await page.locator("#contact-email").fill("contact@example.com");
  await page.locator("#contact-message").fill("Please contact me about your services.");
  await page.getByLabel("Privacy consent", { exact: true }).check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("#contact-phone")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#contact-phone-error")).toBeVisible();
  expect(requests).toBe(0);
});
test("desktop Services disclosure supports Enter, Space, arrows and Escape", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const trigger = page.locator(".desktop-nav button");
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("ArrowDown");
  const links = page.locator("#services-dropdown a");
  await expect(links.nth(0)).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(links.nth(1)).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(links.nth(0)).toBeFocused();
  await page.keyboard.press("End");
  await expect(links.nth(5)).toBeFocused();
  await page.keyboard.press("Home");
  await expect(links.nth(0)).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Space");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/services\/social-impact$/);
  await expect(page.locator("h1")).toHaveText("Social Impact");
});
test("mobile menu traps focus, supports service links and returns focus on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const close = page.getByRole("button", { name: "Close menu" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.locator(".button").last()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(dialog.locator("summary")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(dialog.locator("details")).toHaveAttribute("open", "");
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("link", { name: "Explore all services" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});
test("sample search, native FAQ and missing-app contact fallback work", async ({ page }) => {
  await page.goto("/tender-saar");
  await expect(page.getByRole("link", { name: "Login", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Enquire about Tender Saar" })).toHaveAttribute("href", "/contact?service=tender-saar");
  const search = page.getByRole("searchbox", { name: "Search sample tenders" });
  await search.fill("training");
  await expect(page.locator(".sample-tender")).toHaveCount(1);
  await search.fill("no-such-sample");
  await expect(page.getByText("No sample tenders match your search.")).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.locator(".sample-tender")).toHaveCount(2);
  const faq = page.locator(".faq-list summary").first();
  await faq.focus(); await page.keyboard.press("Enter");
  await expect(page.locator(".faq-list details").first()).toHaveAttribute("open", "");
});
test("SSR remains readable without JavaScript, and published copy contains no prohibited claims", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:4173/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("Expertise that connects the dots.", { exact: true })).toBeVisible();
    await expect(page.locator("main")).toContainText("SAMPLE DATA");
  } finally { await context.close(); }
  for (const route of routes) {
    const response = await request.get(route);
    const html = await response.text();
    const text = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ");
    expect(text, route).not.toMatch(/lorem ipsum|guaranteed|#1|100%|in-house developers/i);
  }
});

