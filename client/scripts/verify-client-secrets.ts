import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { outputRoot } from "./content.js";
async function files(folder: string): Promise<string[]> {
  return (await Promise.all((await readdir(folder, { withFileTypes: true })).map((entry) => entry.isDirectory() ? files(resolve(folder, entry.name)) : [resolve(folder, entry.name)]))).flat();
}
const artifacts = (await files(outputRoot)).filter((file) => /\.(js|html|json|map|css|data)$/.test(file));
for (const file of artifacts) assert.ok(!/SUPABASE_SERVICE_ROLE_KEY|DATABASE_URL|SMTP_/.test(await readFile(file, "utf8")), "Server environment reference leaked: " + file);
console.log("Client secret-reference grep passed: " + artifacts.length + " artifacts.");
