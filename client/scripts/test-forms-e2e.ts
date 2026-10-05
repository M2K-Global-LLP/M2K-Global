import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fork, spawnSync, type ChildProcess } from "node:child_process";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import assert from "node:assert/strict";
import { clientRoot, repoRoot } from "./content.js";
const npm = process.env.npm_execpath; assert.ok(npm, "Run through npm run test:forms-e2e");
const file = resolve(clientRoot, "src/content/careers.ts"); const original = await readFile(file, "utf8");
function run(args: string[], extra: NodeJS.ProcessEnv = {}) {
  const result = spawnSync(process.execPath, [npm!, ...args], { cwd: repoRoot, stdio: "inherit", env: { ...process.env, ...extra } }); assert.equal(result.status, 0, args.join(" "));
}
let child: ChildProcess | undefined;
try {
  run(["run", "build", "-w", "@m2k/contracts"]);
  assert.ok(original.includes('status: "draft"'));
  await writeFile(file, original.replace('status: "draft"', 'status: "open", publishedAt: "2026-09-29", closesAt: "2099-12-31"'));
  run(["run", "build", "-w", "@m2k/client"], { VITE_API_URL: "http://localhost:4000" });
  child = fork(resolve(repoRoot, "server/scripts/e2e-api.ts"), [], { cwd: resolve(repoRoot, "server"), execArgv: ["--import", "tsx"], env: { ...process.env, DATABASE_SCHEMA: "m2k_e2e_" + randomUUID().replaceAll("-", "") }, stdio: ["ignore", "inherit", "inherit", "ipc"] });
  await new Promise<void>((done, reject) => { const timer = setTimeout(() => reject(new Error("E2E API startup timed out")), 30000); child!.once("message", () => { clearTimeout(timer); done(); }); child!.once("exit", (code) => { clearTimeout(timer); reject(new Error("E2E API exited: " + code)); }); });
  run(["run", "test:e2e", "-w", "@m2k/client", "--", "tests/e2e/phase4.spec.ts", "--workers=1"], { PHASE4_LIVE_E2E: "true" });
  await writeFile(resolve(repoRoot, "screenshots/phase4-playwright-results.json"), await readFile(resolve(repoRoot, "screenshots/playwright-results.json")));
} finally {
  try { if (child?.connected) { const exit = once(child, "exit"); child.send("stop"); const [code] = await exit; assert.equal(code, 0, "E2E API cleanup must succeed"); } } finally {
  await writeFile(file, original);
  run(["run", "build"]);
  console.log("E2E job fixture restored to draft and public build regenerated.");
  }
}
