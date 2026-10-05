import multer from "multer";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { RequestHandler } from "express";
import { resumePolicy } from "@m2k/contracts";
import { HttpError } from "../lib/errors.js";
export const resumeUpload: RequestHandler = async (req, res, next) => {
  if (!req.is("multipart/form-data")) return next(new HttpError(415, "UNSUPPORTED_MEDIA_TYPE", "Use a multipart form with a PDF resume."));
  let directory: string | undefined;
  try {
    directory = await mkdtemp(join(tmpdir(), "m2k-resume-"));
    const upload = multer({ dest: directory, limits: { fileSize: resumePolicy.maxBytes, files: 1, fields: 8, parts: 9, fieldSize: 6000 } }).single("resume");
    await new Promise<void>((resolve, reject) => upload(req, res, (error: unknown) => error ? reject(error) : resolve()));
    if (req.file) req.file.buffer = await readFile(req.file.path);
    // Only bounded bytes reach the controller. Temp paths are never persisted.
    await rm(directory, { recursive: true, force: true }); directory = undefined;
    next();
  } catch (error) {
    if (directory) await rm(directory, { recursive: true, force: true }).catch((cleanup: unknown) => console.error("Temporary upload cleanup failed", { requestId: res.locals.requestId, cleanup }));
    next(error instanceof Error && /Unexpected end of form|Boundary not found|Malformed part header/.test(error.message) ? new HttpError(400, "INVALID_REQUEST", "Malformed multipart request.") : error);
  }
};
