import "dotenv/config";
import { readFile } from "node:fs/promises";
import { createDatabasePool } from "../src/config/database.js";
import { safeSchema } from "../src/adapters/PostgresSubmissionStore.js";
const pool = createDatabasePool(process.env.DATABASE_URL!);
const connection = await pool.connect();
try {
  const sql = (await readFile(new URL("../migrations/001_submissions.sql", import.meta.url), "utf8")).replaceAll("__SCHEMA__", safeSchema(process.env.DATABASE_SCHEMA || "m2k"));
  await connection.query("BEGIN"); await connection.query(sql); await connection.query("COMMIT");
  console.log("Submission and notification migration applied.");
} catch (error) { await connection.query("ROLLBACK"); throw error; }
finally { connection.release(); await pool.end(); }
