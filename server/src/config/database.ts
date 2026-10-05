import { readFileSync } from "node:fs";
import { getCACertificates } from "node:tls";
import { Pool } from "pg";

export function createDatabasePool(connectionString: string) {
  const url = new URL(connectionString);
  // URL SSL options otherwise override pg's explicit TLS settings. Always
  // authenticate the remote database instead of accepting sslmode=disable/require.
  for (const key of ["ssl", "sslmode", "sslcert", "sslkey", "sslrootcert", "uselibpqcompat"]) url.searchParams.delete(key);
  const ca = readFileSync(new URL("../../certs/supabase-root.crt", import.meta.url), "utf8");
  return new Pool({ connectionString: url.href, ssl: { rejectUnauthorized: true, ca: [...getCACertificates("default"), ca] }, connectionTimeoutMillis: 10000, query_timeout: 15000, max: 5 });
}
