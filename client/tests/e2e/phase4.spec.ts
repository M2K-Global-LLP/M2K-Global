import { pdfFixture } from "../../../packages/contracts/tests/pdf-fixture.js";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.describe("Phase 4 live forms", () => {
  test.skip(process.env.PHASE4_LIVE_E2E !== "true", "Run npm run test:forms-e2e for real Supabase-backed tests with a temporary public job.");
  test("contact succeeds without a reload and query prefill is correct", async ({ page }) => {
    await page.goto("/contact?service=tender-saar");
    await expect(page.getByLabel("Service", { exact: true })).toHaveValue("tender-saar");
    let navigations = 0; page.on("framenavigated", (frame) => { if (frame === page.mainFrame()) navigations++; });
    await page.locator("#contact-name").fill("Browser Test Person"); await page.locator("#contact-email").fill("phase4-browser@example.invalid"); await page.locator("#contact-phone").fill("+1 555 0100");
    await page.locator("#contact-message").fill("Automated Phase 4 browser test enquiry."); await page.getByLabel("Privacy consent", { exact: true }).check();
    const response = page.waitForResponse((response) => response.url().endsWith("/api/contact"));
    await page.getByRole("button", { name: "Send enquiry" }).click(); await expect(page.getByRole("button", { name: "Submitting…" })).toBeDisabled(); expect((await response).status()).toBe(202);
    await expect(page.getByRole("status")).toContainText("Thank you"); expect(navigations).toBe(0);
  });
  test("invalid email is inline, accessible, and does not submit", async ({ page }) => {
    let requests = 0; page.on("request", (request) => { if (request.url().endsWith("/api/contact")) requests++; });
    await page.goto("/contact"); await page.locator("#contact-name").fill("Browser Test"); await page.locator("#contact-email").fill("not-an-email"); await page.locator("#contact-phone").fill("+1 555 0100");
    await page.locator("#contact-message").fill("Automated validation test enquiry."); await page.getByLabel("Privacy consent", { exact: true }).check(); await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.locator("#contact-email")).toHaveAttribute("aria-invalid", "true"); await expect(page.locator("#contact-email-error")).toBeVisible(); expect(requests).toBe(0);
  });
  for (const valid of [true, false]) test(valid ? "valid PDF application succeeds" : "fake-signature PDF rejected, entered data preserved", async ({ page }) => {
    await page.goto("/careers/programme-coordinator-example#apply");
    await page.getByLabel("Name", { exact: true }).fill("Browser Applicant"); await page.getByLabel("Email", { exact: true }).fill("phase4-applicant@example.invalid");
    await page.getByLabel("Privacy consent", { exact: true }).check();
    await page.locator("#apply-resume").setInputFiles({ name: "resume.pdf", mimeType: "application/pdf", buffer: valid ? pdfFixture : Buffer.from("This is renamed plain text, not PDF bytes.") });
    const response = page.waitForResponse((response) => response.url().endsWith("/api/careers/apply")); await page.getByRole("button", { name: "Submit application" }).click(); expect((await response).status()).toBe(valid ? 202 : 422);
    if (valid) await expect(page.getByRole("status")).toContainText("Thank you");
    else { await expect(page.locator("#apply-resume-error")).toBeVisible(); await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Browser Applicant"); await expect(page.getByRole("button", { name: "Submit application" })).toBeEnabled(); }
  });
  for (const width of [375, 768, 1024, 1440]) test(`forms layout and accessibility at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/contact", "/careers/programme-coordinator-example#apply"]) {
      await page.goto(route); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
      const folder = fileURLToPath(new URL("../../../screenshots/phase4/", import.meta.url)); await mkdir(folder, { recursive: true });
      await page.screenshot({ path: folder + (route === "/contact" ? "contact" : "application") + "-" + width + ".png", fullPage: true });
    }
  });
});
