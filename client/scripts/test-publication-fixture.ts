import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { load } from "cheerio";
import { chromium } from "@playwright/test";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { clientRoot, repoRoot } from "./content.js";
const projectFile = resolve(clientRoot, "src/content/projects.ts");
const insightFile = resolve(clientRoot, "src/content/insights/tender-opportunities.md");
const originals = await Promise.all([projectFile, insightFile].map((file) => readFile(file, "utf8")));
const npm = process.env.npm_execpath;
assert.ok(npm, "Run this fixture through npm run test:publication-fixture.");
function build(allWorkspaces = false) {
  const result = spawnSync(process.execPath, [npm!, "run", "build", ...(allWorkspaces ? [] : ["-w", "@m2k/client"])], { cwd: repoRoot, stdio: "inherit" });
  assert.equal(result.status, 0, "Fixture build must pass.");
}
try {
  assert.ok(originals[0]?.includes("approved: false"));
  assert.ok(originals[1]?.includes("status: draft"));
  await writeFile(projectFile, originals[0]!.replace("approved: false", "approved: true"));
  await writeFile(insightFile, originals[1]!.replace("status: draft", "status: published"));
  build();
  const generated = JSON.parse(await readFile(resolve(clientRoot, "src/generated/public-content.json"), "utf8"));
  const sitemap = await readFile(resolve(clientRoot, "dist/client/sitemap.xml"), "utf8");
  for (const [prefix, item] of [["projects", generated.projects[0]], ["insights", generated.insights[0]]] as const) {
    const path = `/${prefix}/${item.slug}`;
    const html = load(await readFile(resolve(clientRoot, "dist/client" + path + "/index.html"), "utf8"));
    assert.equal(html("h1").text(), item.title);
    assert.equal(html("title").text(), item.seo.title);
    assert.equal(html('meta[name="description"]').attr("content"), item.seo.description);
    assert.ok(html('link[rel="canonical"]').attr("href")?.endsWith(path));
    assert.ok(sitemap.includes(path + "</loc>"));
  }
  const { createStaticServer } = await import("./static-server.js");
  const server = createStaticServer().listen(0, "127.0.0.1"); await once(server, "listening");
  const origin = "http://127.0.0.1:" + (server.address() as AddressInfo).port;
  const browser = await chromium.launch();
  try {
    assert.equal((await fetch(origin + "/projects")).status, 404, "The Our Work collection stays hidden while the client awaits certifications.");
    const page = await browser.newPage();
    await page.goto(origin + "/insights/tender-opportunities");
    assert.equal(await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => nodes.some((node) => JSON.parse(node.textContent ?? "{}")["@type"] === "Article")), true);
  } finally { await browser.close(); server.closeAllConnections(); await new Promise<void>((done) => server.close(() => done())); }
  console.log("Publication fixture passed: project collection remains hidden; approved project detail and published article have HTML, metadata and sitemap entries.");
} finally {
  await Promise.all([projectFile, insightFile].map((file, index) => writeFile(file, originals[index]!)));
  build(true);
  console.log("Fixture reverted: original private sources restored and clean production build regenerated.");
}
