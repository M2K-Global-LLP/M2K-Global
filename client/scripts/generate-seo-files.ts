import { copyFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { outputRoot } from "./content.js";
import { routeManifest, site } from "../src/generated/route-manifest.js";
const escapeXml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const urls = routeManifest.filter((page) => !page.seo.noIndex).map((page) => "<url><loc>" + escapeXml(new URL(page.path, site.origin).href) + "</loc></url>");
await writeFile(resolve(outputRoot, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.join("") + "</urlset>\n");
await writeFile(resolve(outputRoot, "robots.txt"), site.indexable ? "User-agent: *\nAllow: /\nSitemap: " + site.origin + "/sitemap.xml\n" : "User-agent: *\nDisallow: /\n");
await copyFile(resolve(outputRoot, "404/index.html"), resolve(outputRoot, "404.html"));
console.log("Sitemap, robots and 404.html generated. Indexable: " + site.indexable);

