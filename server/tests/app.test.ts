import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { fakeServices } from "./fixtures.js";
import { createApp } from "../src/app.js";
import { serverEnvSchema } from "../src/config/env.js";
test("API health, CORS, media validation, request IDs and malformed JSON", async () => {
  const server = createApp(serverEnvSchema.parse({ NODE_ENV: "test", DATABASE_URL: "postgresql://test:test@localhost/test", SUPABASE_URL: "https://example.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "test-key-not-used-000000" }), fakeServices().services).listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = "http://127.0.0.1:" + (server.address() as AddressInfo).port;
  try {
    const health = await fetch(origin + "/health");
    assert.equal(health.status, 200);
    assert.ok(health.headers.get("x-request-id"));
    assert.equal(health.headers.get("x-content-type-options"), "nosniff");
    const allowed = await fetch(origin + "/health", { headers: { Origin: "http://localhost:5173" } });
    assert.equal(allowed.headers.get("access-control-allow-origin"), "http://localhost:5173");
    assert.equal((await fetch(origin + "/health", { headers: { Origin: "https://untrusted.example" } })).status, 403);
    for (const path of ["/api/contact", "/api/careers/apply"]) {
      const response = await fetch(origin + path, { method: "POST" });
      assert.equal(response.status, 415);
      const body = await response.json() as { error: { code: string }; requestId: string };
      assert.equal(body.error.code, "UNSUPPORTED_MEDIA_TYPE");
      assert.equal(body.requestId, response.headers.get("x-request-id"));
    }
    assert.equal((await fetch(origin + "/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" })).status, 400);
    assert.equal((await fetch(origin + "/unknown")).status, 404);
  } finally { server.closeAllConnections(); await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
});
test("production configuration rejects placeholders and console email", () => {
  assert.equal(serverEnvSchema.safeParse({ NODE_ENV: "production" }).success, false);
  assert.equal(serverEnvSchema.safeParse({ CLIENT_ORIGIN: "https://example.org/path" }).success, false);
});

