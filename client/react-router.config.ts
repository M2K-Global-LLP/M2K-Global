import type { Config } from "@react-router/dev/config";
import { routeManifest } from "./src/generated/route-manifest.js";
export default {
  appDirectory: "src", buildDirectory: "dist", ssr: false,
  // Explicitly retain v7 behavior until a separately reviewed migration.
  future: { v8_middleware: false, v8_splitRouteModules: false, v8_viteEnvironmentApi: false, v8_passThroughRequests: false, v8_trailingSlashAwareDataRequests: false },
  routeDiscovery: { mode: "initial" },
  prerender: routeManifest.map((page) => page.path),
} satisfies Config;

