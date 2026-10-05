import multer from "multer";
import type { ErrorRequestHandler } from "express";
import type { ApiErrorResponse } from "@m2k/contracts";
import { HttpError } from "../lib/errors.js";
export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  let status = 500;
  let code: ApiErrorResponse["error"]["code"] = "INTERNAL_ERROR";
  let message = "An unexpected error occurred.";
  if (error instanceof HttpError) ({ status, code, message } = error);
  else if (error instanceof multer.MulterError) { status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400; code = error.code === "LIMIT_FILE_SIZE" ? "PAYLOAD_TOO_LARGE" : "INVALID_REQUEST"; message = error.code === "LIMIT_FILE_SIZE" ? "Resume must be no larger than 5 MB." : "Invalid multipart upload."; }
  else if (error && typeof error === "object" && "type" in error) {
    if (error.type === "entity.parse.failed") { status = 400; code = "INVALID_REQUEST"; message = "Malformed JSON request."; }
    if (error.type === "entity.too.large") { status = 413; code = "PAYLOAD_TOO_LARGE"; message = "Request too large."; }
  }
  console.error("Request failed", { requestId: String(res.locals.requestId), error });
  const body: ApiErrorResponse = { ok: false, error: { code, message, ...(error instanceof HttpError && error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}) }, requestId: String(res.locals.requestId) };
  res.status(status).json(body);
};

