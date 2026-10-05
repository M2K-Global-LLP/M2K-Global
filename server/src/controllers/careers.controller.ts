import type { RequestHandler } from "express";
import { applicationMultipartSchema, resumeMetadataSchema } from "@m2k/contracts";
import type { Services } from "../services/interfaces.js";
import { HttpError } from "../lib/errors.js";
import { persistAndNotify } from "../services/submission.service.js";
import { accepted, isHoneypot, validationError } from "./helpers.js";
export const careersController = (services: Services): RequestHandler => async (req, res) => {
  if (isHoneypot(req.body)) return accepted(res);
  const parsed = applicationMultipartSchema.safeParse(req.body);
  if (!parsed.success) throw validationError(parsed.error);
  const job = services.jobs.find((job) => job.slug === parsed.data.jobSlug);
  if (!job || job.status !== "open" || (job.closesAt && job.closesAt < new Date().toISOString().slice(0, 10))) throw new HttpError(409, "JOB_NOT_AVAILABLE", "This role is no longer accepting applications.");
  const file = req.file;
  if (!file || !resumeMetadataSchema.safeParse({ originalName: file.originalname, contentType: file.mimetype, size: file.size }).success || !/^%PDF-1\.[0-9]|^%PDF-2\.0/.test(file.buffer.subarray(0, 8).toString("ascii"))) throw new HttpError(422, "INVALID_FILE", "Upload a valid PDF resume up to 5 MB.", { resume: ["Upload a valid PDF resume up to 5 MB."] });
  const stored = await services.storage.put({ bytes: file.buffer, contentType: "application/pdf" }).catch((error: unknown) => { console.error("Resume storage failed", { requestId: res.locals.requestId, error }); throw new HttpError(503, "SERVICE_UNAVAILABLE", "Applications are temporarily unavailable. Please try again later."); });
  try { await persistAndNotify(services, { kind: "application", payload: parsed.data, resumeKey: stored.key, requestId: String(res.locals.requestId) }); }
  catch (error) {
    await services.storage.delete(stored.key).catch((cleanup: unknown) => console.error("Resume cleanup failed", { requestId: res.locals.requestId, key: stored.key, cleanup }));
    throw error;
  }
  accepted(res);
};
