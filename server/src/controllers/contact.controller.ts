import type { RequestHandler } from "express";
import { contactSchema } from "@m2k/contracts";
import type { Services } from "../services/interfaces.js";
import { HttpError } from "../lib/errors.js";
import { persistAndNotify } from "../services/submission.service.js";
import { accepted, isHoneypot, validationError } from "./helpers.js";
export const contactController = (services: Services): RequestHandler => async (req, res) => {
  if (!req.is("application/json")) throw new HttpError(415, "UNSUPPORTED_MEDIA_TYPE", "Use a JSON request.");
  if (isHoneypot(req.body)) return accepted(res);
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) throw validationError(parsed.error);
  await persistAndNotify(services, { kind: "contact", payload: parsed.data, requestId: String(res.locals.requestId) });
  accepted(res);
};
