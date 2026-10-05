import { test } from "node:test";
import assert from "node:assert/strict";
import { buildEnvSchema } from "../src/schemas/env.schema.js";
test("indexable builds require HTTPS public origins; preview defaults are non-indexable", () => {
  assert.equal(buildEnvSchema.parse({}).SITE_INDEXABLE, false);
  assert.deepEqual(buildEnvSchema.parse({ SITE_URL: "https://www.m2kglobal.com/path", SITE_INDEXABLE: "true" }), { SITE_URL: "https://www.m2kglobal.com", SITE_INDEXABLE: true });
  for (const SITE_URL of ["http://www.m2kglobal.com", "https://example.invalid", "https://localhost", "https://127.0.0.1", "https://[::1]", "invalid"]) {
    assert.equal(buildEnvSchema.safeParse({ SITE_URL, SITE_INDEXABLE: "true" }).success, false, SITE_URL);
  }
  assert.equal(buildEnvSchema.parse({ SITE_URL: "https://www.m2kglobal.com", SITE_INDEXABLE: "false" }).SITE_INDEXABLE, false);
});
