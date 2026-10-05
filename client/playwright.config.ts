import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e", timeout: 60000, expect: { timeout: 10000 }, fullyParallel: false,
  workers: 2, reporter: [["list"], ["json", { outputFile: "../screenshots/playwright-results.json" }]],
  outputDir: "../test-results",
  use: { baseURL: "http://127.0.0.1:4173", browserName: "chromium", headless: true, reducedMotion: "reduce", trace: "retain-on-failure" },
  webServer: { command: "npm run preview", url: "http://127.0.0.1:4173", reuseExistingServer: false, timeout: 30000 },
});

