import { createDatabasePool } from "../config/database.js";
import { createClient } from "@supabase/supabase-js";
import catalog from "../generated/job-catalog.json" with { type: "json" };
import type { ServerEnv } from "../config/env.js";
import { PostgresSubmissionStore } from "../adapters/PostgresSubmissionStore.js";
import { SupabaseStorageService } from "../adapters/SupabaseStorageService.js";
import { ConsoleEmailService, SmtpEmailService } from "../adapters/EmailServices.js";
import type { JobCatalogEntry, Services } from "./interfaces.js";
export function createServices(env: ServerEnv) {
  const pool = createDatabasePool(env.DATABASE_URL);
  const client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15000) }) } });
  const storage = new SupabaseStorageService(client, env.SUPABASE_STORAGE_BUCKET);
  const services: Services = { store: new PostgresSubmissionStore(pool, env.DATABASE_SCHEMA), storage, email: env.EMAIL_DRIVER === "smtp" ? new SmtpEmailService(env) : new ConsoleEmailService(), jobs: catalog as JobCatalogEntry[] };
  return { services, pool, client, storage };
}
