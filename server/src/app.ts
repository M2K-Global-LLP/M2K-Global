import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import type { ServerEnv } from "./config/env.js";
import type { Services } from "./services/interfaces.js";
import { HttpError } from "./lib/errors.js";
import { requestId } from "./middleware/request-id.js";
import { errorHandler } from "./middleware/error-handler.js";
import { resumeUpload } from "./middleware/resume-upload.js";
import { contactController } from "./controllers/contact.controller.js";
import { careersController } from "./controllers/careers.controller.js";
export function createApp(env: ServerEnv, services: Services) {
  const app = express(); app.disable("x-powered-by");
  app.set("trust proxy", env.TRUST_PROXY_HOPS);
  app.use(requestId); app.use(helmet());
  app.use(cors({ origin(origin, callback) { if (!origin || origin === env.CLIENT_ORIGIN) callback(null, true); else callback(new HttpError(403, "ORIGIN_NOT_ALLOWED", "Origin is not allowed.")); }, methods: ["GET", "POST", "OPTIONS"], allowedHeaders: ["Content-Type"], exposedHeaders: ["X-Request-ID", "Retry-After"] }));
  const limit = (max: number) => rateLimit({ windowMs: 15 * 60 * 1000, limit: max, standardHeaders: "draft-8", legacyHeaders: false, handler: (_req, _res, next) => next(new HttpError(429, "RATE_LIMITED", "Too many requests. Please try again later.")) });
  app.get("/health", (_req, res) => res.json({ ok: true, data: { status: "healthy" }, requestId: String(res.locals.requestId) }));
  app.post("/api/contact", limit(5), express.json({ limit: "32kb" }), contactController(services));
  app.post("/api/careers/apply", limit(3), resumeUpload, careersController(services));
  app.use((_req, _res, next) => next(new HttpError(404, "NOT_FOUND", "Endpoint not found.")));
  app.use(errorHandler); return app;
}
