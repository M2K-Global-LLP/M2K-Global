import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { chromium } from "@playwright/test";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { createStaticServer } from "./static-server.js";
import { repoRoot } from "./content.js";
const server = createStaticServer().listen(0, "127.0.0.1");
await once(server, "listening");
const origin = "http://127.0.0.1:" + (server.address() as AddressInfo).port;
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless", "--no-sandbox"] });
const folder = resolve(repoRoot, "reports/lighthouse");
await mkdir(folder, { recursive: true });
const summary = [];
try {
  for (const route of ["/", "/tender-saar", "/services/social-impact", "/projects/mine-closure-social-impact"]) {
    assert.equal((await fetch(origin + route)).status, 200, "Performance routes must exist; run test:readiness for the private project fixture.");
    const result = await lighthouse(origin + route, { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] });
    assert.ok(result && !result.lhr.runtimeError, "Lighthouse must complete without a runtime error.");
    const lhr = result.lhr;
    const scores = Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, Math.round((value.score ?? 0) * 100)]));
    const metrics = Object.fromEntries(["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "total-byte-weight"].map(key => [key, lhr.audits[key]?.numericValue ?? null]));
    const unused = lhr.audits["unused-javascript"]?.details;
    const unusedJsBytes = unused && "overallSavingsBytes" in unused ? unused.overallSavingsBytes : null;
    summary.push({ route, scores, metrics, unusedJsBytes });
    await writeFile(resolve(folder, (route === "/" ? "home" : route.slice(1).replaceAll("/", "-")) + ".json"), JSON.stringify(lhr, null, 2));
    console.log(JSON.stringify({ route, scores, metrics }));
  }
  await writeFile(resolve(folder, "summary.json"), JSON.stringify({ date: new Date().toISOString(), profile: "Lighthouse default mobile simulated throttling; gzip-enabled static preview, one local run per route; project is a temporary editorial fixture", results: summary }, null, 2));
} finally {
  await chrome.kill();
  server.closeAllConnections();
  await new Promise<void>(done => server.close(() => done()));
}
