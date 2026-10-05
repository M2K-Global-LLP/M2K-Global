import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { createStaticServer } from "../scripts/static-server.js";
test("static preview serves deep links and real unknown-path 404 documents", async () => {
  const server = createStaticServer().listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = "http://127.0.0.1:" + (server.address() as AddressInfo).port;
  try {
    for (const path of ["/", "/services/it-product-delivery", "/insights", "/careers"]) {
      assert.equal((await fetch(origin + path)).status, 200, path);
    }
    for (const path of ["/missing", "/projects", "/projects/placeholder", "/insights/placeholder", "/careers/placeholder", "/projects/unapproved-project-example", "/insights/draft-insight-example", "/careers/draft-job-example", "/404"]) {
      const response = await fetch(origin + path);
      assert.equal(response.status, 404, path);
      assert.match(await response.text(), /<h1>Page not found<\/h1>/);
    }
  } finally { server.closeAllConnections(); await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
});

