import "dotenv/config";
import assert from "node:assert/strict";
import { serverEnvSchema } from "../src/config/env.js";
import { createServices } from "../src/services/create-services.js";
import { safeSchema } from "../src/adapters/PostgresSubmissionStore.js";
const parsed = serverEnvSchema.safeParse(process.env);
if (!parsed.success) throw new Error("Server environment is incomplete; validate variable names against .env.example.");
const env = parsed.data;
const { pool, storage } = createServices(env);
try {
  await storage.assertPrivate();
  const result = await pool.query<{ relname: string; relrowsecurity: boolean; browser_access: boolean }>(`
    SELECT c.relname, c.relrowsecurity,
      has_table_privilege('anon', c.oid, 'SELECT,INSERT,UPDATE,DELETE') OR
      has_table_privilege('authenticated', c.oid, 'SELECT,INSERT,UPDATE,DELETE') AS browser_access
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = $1 AND c.relname IN ('submissions', 'notifications')`, [env.DATABASE_SCHEMA]);
  assert.equal(result.rows.length, 2, "Both submission tables must exist.");
  assert.ok(result.rows.every(row => row.relrowsecurity && !row.browser_access), "RLS must be enabled with no browser grants.");
  const policies = await pool.query("SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND cmd IN ('SELECT', 'ALL')");
  assert.equal(policies.rows.length, 0, "Review Storage read policies before certifying server-only resume access.");
  const pending = await pool.query(`SELECT count(*)::integer AS count FROM ${safeSchema(env.DATABASE_SCHEMA)}.notifications WHERE status = 'pending'`);
  console.log(JSON.stringify({ database: "reachable", tablesWithRls: result.rows.length, browserTableGrants: 0, storageReadPolicies: 0, resumeBucket: "private", pendingNotifications: pending.rows[0].count, emailDriver: env.EMAIL_DRIVER }));
} finally { await pool.end(); }
