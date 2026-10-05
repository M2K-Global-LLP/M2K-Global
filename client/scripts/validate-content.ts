import { loadContent, publicPages } from "./content.js";
const content = await loadContent();
const routes = publicPages(content);
if (new Set(routes.map((page) => page.path)).size !== routes.length) throw new Error("Duplicate public route.");
if (new Set(routes.map((page) => page.seo.title)).size !== routes.length) throw new Error("Duplicate page title.");
console.log("Content validation passed: " + content.services.length + " services, " + routes.length + " public/error routes; draft records remain private.");

