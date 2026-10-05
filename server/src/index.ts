import "dotenv/config";
import { createServices } from "./services/create-services.js";
import { createApp } from "./app.js";
import { serverEnvSchema } from "./config/env.js";
const result = serverEnvSchema.safeParse(process.env);
if (!result.success) {
  console.error("Invalid server environment:", result.error.issues.map((issue) => ({ path: issue.path, message: issue.message })));
  process.exit(1);
}
const { services, pool, storage } = createServices(result.data);
await pool.query("SELECT 1");
await storage.assertPrivate();
const server = createApp(result.data, services).listen(result.data.PORT, () => console.log("API listening on port " + result.data.PORT));
for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, () => server.close(() => { void pool.end(); }));

