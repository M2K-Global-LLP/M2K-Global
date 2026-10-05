import type { ApiErrorCode, ApplicationRequest, ContactRequest, SubmissionAccepted } from "@m2k/contracts";
import { urls } from "./urls.js";
export class ApiFailure extends Error {
  constructor(public code: ApiErrorCode | "NETWORK_ERROR", public fields: string[] = [], public retryAfter?: number) { super(code); }
}
async function submit(path: string, init: RequestInit): Promise<SubmissionAccepted> {
  let response: Response;
  try { response = await fetch(urls.api.replace(/\/$/, "") + path, { ...init, signal: AbortSignal.timeout(60000) }); }
  catch { throw new ApiFailure("NETWORK_ERROR"); }
  const body: unknown = await response.json().catch(() => undefined);
  if (response.status === 202 && body && typeof body === "object" && "ok" in body && body.ok === true) return body as SubmissionAccepted;
  if (body && typeof body === "object" && "error" in body && body.error && typeof body.error === "object") {
    const error = body.error;
    const code = "code" in error && typeof error.code === "string" ? error.code as ApiErrorCode : "INTERNAL_ERROR";
    const fields = "fieldErrors" in error && error.fieldErrors && typeof error.fieldErrors === "object" ? Object.keys(error.fieldErrors) : [];
    throw new ApiFailure(code, fields, Number(response.headers.get("Retry-After")) || undefined);
  }
  throw new ApiFailure("INTERNAL_ERROR");
}
export const sendContact = (data: ContactRequest) => submit("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export function sendApplication(data: ApplicationRequest, resume: File) {
  const body = new FormData();
  for (const [key, value] of Object.entries(data)) if (value !== undefined) body.append(key, String(value));
  body.append("resume", resume);
  return submit("/api/careers/apply", { method: "POST", body });
}
