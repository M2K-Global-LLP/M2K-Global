import { ApiFailure } from "../../lib/api.js";
import { publicContent } from "../../generated/public-content.js";
export function formError(error: unknown) {
  const copy = publicContent.forms;
  if (!(error instanceof ApiFailure)) return copy.error;
  if (error.code === "RATE_LIMITED") return copy.ui.rateLimited;
  if (error.code === "JOB_NOT_AVAILABLE") return copy.ui.jobUnavailable;
  if (error.code === "INVALID_FILE" || error.code === "PAYLOAD_TOO_LARGE") return copy.ui.resumeHint;
  if (error.code === "VALIDATION_ERROR") return copy.ui.checkFields;
  if (error.code === "NETWORK_ERROR") return copy.ui.networkError;
  return copy.error;
}
