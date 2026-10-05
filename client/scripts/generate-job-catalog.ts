import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { repoRoot, loadContent } from "./content.js";
const { careers } = await loadContent();
const catalog = careers.filter((job) => job.status === "open" && (!job.closesAt || job.closesAt >= new Date().toISOString().slice(0, 10))).map((job) => ({
  slug: job.slug, status: job.status, ...(job.closesAt ? { closesAt: job.closesAt } : {}),
}));
const folder = resolve(repoRoot, "server/src/generated");
await mkdir(folder, { recursive: true });
await writeFile(resolve(folder, "job-catalog.json"), JSON.stringify(catalog, null, 2) + "\n");
console.log("Job catalog generated: " + catalog.length + " open jobs.");

