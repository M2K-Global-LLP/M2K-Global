import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { load } from "cheerio";
import { outputRoot } from "./content.js";
import { routeManifest } from "../src/generated/route-manifest.js";

const routes = routeManifest.filter((page) => ["/", "/about", "/services", "/tender-saar"].includes(page.path) || page.path.startsWith("/services/"));
for (const route of routes) {
  const $ = load(await readFile(resolve(outputRoot, route.path.slice(1), "index.html"), "utf8"));
  const jsonLd = $('script[type="application/ld+json"]').toArray().map((element) => JSON.parse($(element).text()) as { "@type": string; itemListElement?: Array<{ name: string }> });
  const breadcrumb = jsonLd.find((item) => item["@type"] === "BreadcrumbList");
  if (route.path !== "/") {
    assert.ok(breadcrumb, route.path + ": BreadcrumbList JSON-LD required");
    assert.deepEqual(breadcrumb.itemListElement?.map((item) => item.name), $(".breadcrumb li").toArray().map((element) => $(element).text()), route.path + ": visible and structured breadcrumbs must match");
  }
  $("script, style").remove();
  const text = $("body").text();
  assert.doesNotMatch(text, /lorem ipsum|guaranteed|#1|100%|in-house developers/i, route.path + ": prohibited placeholder or claim");
  let previous = 0;
  for (const element of $("main h1, main h2, main h3, main h4").toArray()) {
    const current = Number(element.tagName.slice(1));
    assert.ok(current <= previous + 1, route.path + ": skipped heading level at " + $(element).text());
    previous = current;
  }
}
console.log("Core-page copy grep, breadcrumb JSON-LD and heading-order checks passed: " + routes.length + " routes.");
