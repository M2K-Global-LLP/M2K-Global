import { ZodError } from "zod";
import type { Response } from "express";
import type { SubmissionAccepted } from "@m2k/contracts";
import { HttpError } from "../lib/errors.js";
export function accepted(res: Response) {
  const body: SubmissionAccepted = { ok: true, data: { status: "received", message: "Your submission has been received." }, requestId: String(res.locals.requestId) };
  res.status(202).json(body);
}
export function validationError(error: ZodError) {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) { const key = String(issue.path[0] ?? "form"); (fields[key] ??= []).push("Please check this field."); }
  return new HttpError(422, "VALIDATION_ERROR", "Please check the highlighted fields.", fields);
}
export function isHoneypot(body: unknown) { return !!body && typeof body === "object" && "website" in body && typeof body.website === "string" && body.website.trim().length > 0; }
