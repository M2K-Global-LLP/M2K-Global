import "dotenv/config";
import { readFile } from "node:fs/promises";
import { serverEnvSchema } from "../src/config/env.js";
import { createServices } from "../src/services/create-services.js";
import { safeSchema } from "../src/adapters/PostgresSubmissionStore.js";
import { createApp } from "../src/app.js";
const schema = process.env.DATABASE_SCHEMA!;
if (!/^m2k_e2e_[a-f0-9]{32}$/.test(schema)) throw new Error("E2E requires its own random test schema");
const env = serverEnvSchema.parse({ ...process.env, NODE_ENV: "test", EMAIL_DRIVER: "console", CLIENT_ORIGIN: "http://127.0.0.1:4173", PORT: "4000" });
const { services, pool, storage } = createServices(env);
await storage.assertPrivate();
await pool.query((await readFile(new URL("../migrations/001_submissions.sql", import.meta.url), "utf8")).replaceAll("__SCHEMA__", safeSchema(schema)));
const server = createApp(env, services).listen(env.PORT, "127.0.0.1", () => process.send?.("ready"));
process.on("message", (message) => {
  if (message === "stop") void (async () => {
    server.closeAllConnections(); await new Promise<void>((done) => server.close(() => done()));
    const rows = await pool.query(`SELECT resume_key FROM ${safeSchema(schema)}.submissions WHERE resume_key IS NOT NULL`);
    for (const row of rows.rows) await storage.delete(row.resume_key as string);
    await pool.query(`DROP SCHEMA ${safeSchema(schema)} CASCADE`); await pool.end(); process.disconnect();
  })().catch((error: unknown) => { console.error("E2E cleanup failed", error); process.exitCode = 1; process.disconnect(); });
});
