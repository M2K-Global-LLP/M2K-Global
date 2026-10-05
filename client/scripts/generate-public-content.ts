import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { clientRoot, loadContent, selectPublicContent, publicPages } from "./content.js";
import { buildEnv } from "./build-env.js";
const content = await loadContent();
const folder = resolve(clientRoot, "src/generated");
await mkdir(folder, { recursive: true });
await writeFile(resolve(folder, "public-content.ts"), "// Generated. Do not edit.\nexport const publicContent = " + JSON.stringify(selectPublicContent(content), null, 2) + ";\n");
await writeFile(resolve(folder, "route-manifest.ts"), 'import type { Page } from "../schemas/content.schema.js";\nexport const routeManifest: Page[] = ' + JSON.stringify(publicPages(content), null, 2) + ";\nexport const site = " + JSON.stringify({ origin: buildEnv.SITE_URL, indexable: buildEnv.SITE_INDEXABLE }) + ";\n");
console.log("Public content generated; unpublished records excluded.");


await writeFile(resolve(folder, "public-content.json"), JSON.stringify(selectPublicContent(content), null, 2));
