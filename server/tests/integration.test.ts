import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { serverEnvSchema } from "../src/config/env.js";
import { createServices } from "../src/services/create-services.js";
import { safeSchema } from "../src/adapters/PostgresSubmissionStore.js";
import { contact, multipart, pdf, serve, testJobs } from "./fixtures.js";
test("real Supabase Postgres transaction, API validation, private storage and signed downloads", { skip: !process.env.DATABASE_URL }, async () => {
  const schema = "m2k_test_" + randomUUID().replaceAll("-", "");
  const env = serverEnvSchema.parse({ ...process.env, NODE_ENV: "test", EMAIL_DRIVER: "console", DATABASE_SCHEMA: schema });
  const { services, pool, storage, client } = createServices(env); services.jobs = testJobs;
  const keys: string[] = [];
  try {
    await storage.assertPrivate();
    await pool.query((await readFile(new URL("../migrations/001_submissions.sql", import.meta.url), "utf8")).replaceAll("__SCHEMA__", safeSchema(schema)));
    const server = await serve(services);
    const count = async () => Number((await pool.query(`SELECT count(*) FROM ${safeSchema(schema)}.submissions`)).rows[0].count);
    try {
      const post = (body: unknown) => fetch(server.origin + "/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      assert.equal((await post(contact)).status, 202); assert.equal(await count(), 1);
      assert.equal((await post({ ...contact, email: "bad" })).status, 422);
      assert.equal((await post({})).status, 422);
      assert.equal((await post({ website: "bot" })).status, 202); assert.equal(await count(), 1);
      assert.equal((await post(contact)).status, 202);
      const limited = await post(contact); assert.equal(limited.status, 429); assert.ok(Number(limited.headers.get("retry-after")) > 0);
      assert.equal((await fetch(server.origin + "/api/careers/apply", { method: "POST", body: multipart() })).status, 202);
      const rows = await pool.query(`SELECT resume_key FROM ${safeSchema(schema)}.submissions WHERE kind='application'`); const key: string = rows.rows[0].resume_key; keys.push(key);
      const signed = await storage.createDownloadUrl(key, 600); const download = await fetch(signed); assert.equal(download.status, 200); assert.deepEqual(Buffer.from(await download.arrayBuffer()), pdf);
      const token = new URL(signed).searchParams.get("token"); assert.ok(token); const payload = JSON.parse(Buffer.from(token.split(".")[1]!, "base64url").toString()); assert.equal(typeof payload.iat, "number"); assert.equal(payload.exp - payload.iat, 600, "Signed link lifetime uses the issuing server clock, avoiding local clock skew");
      const publicUrl = client.storage.from("resumes").getPublicUrl(key).data.publicUrl; assert.notEqual((await fetch(publicUrl)).status, 200);
      assert.equal((await client.storage.getBucket("resumes")).data?.public, false);
      assert.equal((await pool.query(`SELECT count(*) FROM ${safeSchema(schema)}.notifications`)).rows[0].count, String(await count()));
    } finally { await server.close(); }
    for (const [body, expected] of [[multipart(Buffer.from("renamed plain text")), 422], [multipart(new Uint8Array(5 * 1024 * 1024 + 1)), 413], [multipart(pdf, "resume.pdf", "application/pdf", { jobSlug: "test-closed-role" }), 409]] as const) {
      const isolated = await serve(services); try { assert.equal((await fetch(isolated.origin + "/api/careers/apply", { method: "POST", body })).status, expected); } finally { await isolated.close(); }
    }
    // Force the second insert to fail and prove the first insert is rolled back.
    const before = await count();
    await pool.query(`ALTER TABLE ${safeSchema(schema)}.notifications ADD CONSTRAINT reject_fixture CHECK (false) NOT VALID`);
    await assert.rejects(() => services.store.createWithNotification({ kind: "contact", payload: { ...contact, service: "other" }, requestId: randomUUID() })); assert.equal(await count(), before);
    console.log("Real Supabase API, atomic rollback, private bucket and ten-minute signed URL checks passed.");
  } finally {
    // Keys and schema are generated exclusively for this run; never touch owner data.
    const rows = await pool.query(`SELECT resume_key FROM ${safeSchema(schema)}.submissions WHERE resume_key IS NOT NULL`).catch(() => ({ rows: [] }));
    for (const key of new Set([...keys, ...rows.rows.map((row: { resume_key: string }) => row.resume_key)])) await storage.delete(key);
    await pool.query(`DROP SCHEMA IF EXISTS ${safeSchema(schema)} CASCADE`); await pool.end();
  }
});
