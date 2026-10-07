import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { load } from "cheerio";
import { outputRoot } from "./content.js";
import { routeManifest, site } from "../src/generated/route-manifest.js";
for (const page of routeManifest) {
  const file = resolve(outputRoot, page.path.slice(1), "index.html");
  const html = await readFile(file, "utf8");
  const $ = load(html);
  assert.equal($("title").length, 1, page.path + ": one title");
  assert.equal($("title").text(), page.seo.title, page.path + ": title");
  assert.equal($('meta[name="description"]').attr("content"), page.seo.description, page.path + ": description");
  assert.equal($('link[rel="canonical"]').attr("href"), new URL(page.path, site.origin).href, page.path + ": canonical");
  assert.equal($('meta[property="og:url"]').attr("content"), new URL(page.path, site.origin).href);
  assert.equal($('meta[property="og:title"]').attr("content"), page.seo.title);
  const image = new URL($('meta[property="og:image"]').attr("content")!);
  assert.equal(image.origin, site.origin, "OG images must be local");
  assert.ok((await readFile(resolve(outputRoot, image.pathname.slice(1)))).length > 0);
  if (site.indexable && !page.seo.noIndex) assert.equal($('meta[name="robots"]').length, 0);
  if (site.indexable) {
    assert.ok(!html.includes("example.invalid"), page.path + ": no placeholder production origin");
    assert.equal(new URL($('link[rel="canonical"]').attr("href")!).origin, "https://www.m2kglobal.com", page.path + ": production canonical origin");
    assert.equal(new URL($('meta[property="og:url"]').attr("content")!).origin, "https://www.m2kglobal.com", page.path + ": production Open Graph origin");
  }
  assert.equal($("h1").length, 1, page.path + ": one H1");
  assert.equal($("h1").text(), page.h1, page.path + ": H1");
  const visibleText = $("body").clone(); visibleText.find("script,style").remove();
  assert.ok(!/\[COMPANY NAME\]|\[EMAIL\]|\[PHONE\]|\[ADDRESS\]|support@m2kglobal\.com/.test(visibleText.text()), "No placeholder or obsolete contact details: " + page.path);
  for (const node of $('script[type="application/ld+json"]').toArray()) {
    const json = JSON.parse($(node).text()) as Record<string, unknown>;
    if (json["@type"] === "Organization") {
      assert.equal(json.name, "M2K Global"); assert.equal(json.email, "inquiry@m2kglobal.com");
      assert.ok(!JSON.stringify(json).includes("[COMPANY NAME]"));
    }
    if (site.indexable) assert.ok(!JSON.stringify(json).includes("example.invalid"), page.path + ": no placeholder structured-data URL");
  }
  if (!site.indexable || page.seo.noIndex) assert.equal($('meta[name="robots"]').attr("content"), "noindex, nofollow");
}
const robots = await readFile(resolve(outputRoot, "robots.txt"), "utf8");
assert.ok(robots.includes(site.indexable ? "Allow: /" : "Disallow: /"));
if (site.indexable && site.origin === "https://www.m2kglobal.com") {
  assert.equal(robots, "User-agent: *\nAllow: /\nSitemap: https://www.m2kglobal.com/sitemap.xml\n", "Production robots.txt must allow crawling and identify the canonical sitemap");
}
const sitemap = load(await readFile(resolve(outputRoot, "sitemap.xml"), "utf8"), { xmlMode: true });
assert.deepEqual(sitemap("loc").map((_, node) => sitemap(node).text()).get().sort(), routeManifest.filter((page) => !page.seo.noIndex).map((page) => new URL(page.path, site.origin).href).sort(), "Sitemap contains exactly public canonical routes");
if (site.indexable && site.origin === "https://www.m2kglobal.com") {
  for (const url of sitemap("loc").map((_, node) => sitemap(node).text()).get()) {
    assert.ok(url.startsWith("https://www.m2kglobal.com/"), "Production sitemap URLs use the canonical origin: " + url);
    assert.ok(!url.includes("example.invalid"), "Production sitemap excludes placeholder origins");
  }
}
assert.ok(!routeManifest.some((page) => /\/(projects|insights|careers)\/placeholder$/.test(page.path)));
const notFound = load(await readFile(resolve(outputRoot, "404.html"), "utf8"));
assert.equal(notFound("h1").text(), "Page not found");
console.log("verify-prerender passed: " + routeManifest.length + " routes have title, description, canonical and H1 in raw HTML; 404.html exists.");

