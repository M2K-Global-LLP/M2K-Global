import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { clientRoot, repoRoot } from "./content.js";
const npm = process.env.npm_execpath;
assert.ok(npm, "Run through npm run test:readiness");
const files = ["projects.ts", "insights/tender-opportunities.md", "careers.ts"].map(file => resolve(clientRoot, "src/content", file));
const originals = await Promise.all(files.map(file => readFile(file, "utf8")));
const env = { ...process.env, SITE_URL: "https://www.m2kglobal.com", SITE_INDEXABLE: "true" };
function run(args: string[]) {
  const result = spawnSync(process.execPath, [npm!, ...args], { cwd: repoRoot, env, stdio: "inherit" });
  assert.equal(result.status, 0, args.join(" "));
}
try {
  assert.ok(originals[0]!.includes("approved: false") && originals[1]!.includes("status: draft") && originals[2]!.includes('status: "draft"'));
  await writeFile(files[0]!, originals[0]!.replace("approved: false", "approved: true"));
  await writeFile(files[1]!, originals[1]!.replace("status: draft", "status: published"));
  await writeFile(files[2]!, originals[2]!.replace('status: "draft"', 'status: "open", publishedAt: "2026-09-29", closesAt: "2099-12-31"'));
  run(["run", "build"]);
  run(["run", "test:e2e", "-w", "@m2k/client", "--", "tests/e2e/phase5.spec.ts"]);
  await mkdir(resolve(repoRoot, "reports"), { recursive: true });
  await writeFile(resolve(repoRoot, "reports/phase5-playwright.json"), await readFile(resolve(repoRoot, "screenshots/playwright-results.json")));
  run(["run", "test:performance", "-w", "@m2k/client"]);
} finally {
  await Promise.all(files.map((file, i) => writeFile(file, originals[i]!)));
  run(["run", "build"]);
  console.log("Readiness fixtures restored: all three records remain private; public artifacts regenerated.");
}
