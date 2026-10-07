import { test } from "node:test";
import assert from "node:assert/strict";
import { buildEnvSchema, resolveBuildEnv } from "../src/schemas/env.schema.js";
test("indexable builds require HTTPS public origins; preview defaults are non-indexable", () => {
  assert.equal(buildEnvSchema.parse({}).SITE_INDEXABLE, false);
  assert.deepEqual(buildEnvSchema.parse({ SITE_URL: "https://www.m2kglobal.com/path", SITE_INDEXABLE: "true" }), { SITE_URL: "https://www.m2kglobal.com", SITE_INDEXABLE: true });
  for (const SITE_URL of ["http://www.m2kglobal.com", "https://example.invalid", "https://localhost", "https://127.0.0.1", "https://[::1]", "invalid"]) {
    assert.equal(buildEnvSchema.safeParse({ SITE_URL, SITE_INDEXABLE: "true" }).success, false, SITE_URL);
  }
  assert.equal(buildEnvSchema.parse({ SITE_URL: "https://www.m2kglobal.com", SITE_INDEXABLE: "false" }).SITE_INDEXABLE, false);
});

test("Vercel production builds require the canonical indexable SEO configuration", () => {
  const vercelProduction = { VERCEL: "1", VERCEL_ENV: "production" };
  assert.throws(() => resolveBuildEnv(vercelProduction), /SITE_URL, SITE_INDEXABLE/);
  assert.throws(() => resolveBuildEnv({ ...vercelProduction, SITE_URL: "https://m2kglobal.com", SITE_INDEXABLE: "true" }), /SITE_URL must be https:\/\/www\.m2kglobal\.com/);
  assert.throws(() => resolveBuildEnv({ ...vercelProduction, SITE_URL: "https://www.m2kglobal.com", SITE_INDEXABLE: "false" }), /SITE_INDEXABLE must be true/);
  assert.deepEqual(resolveBuildEnv({ ...vercelProduction, SITE_URL: "https://www.m2kglobal.com", SITE_INDEXABLE: "true" }), { SITE_URL: "https://www.m2kglobal.com", SITE_INDEXABLE: true });
  assert.equal(resolveBuildEnv({ VERCEL: "1", VERCEL_ENV: "preview" }).SITE_INDEXABLE, false);
});
