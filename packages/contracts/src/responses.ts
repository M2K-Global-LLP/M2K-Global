export type ApiErrorCode =
  | "INVALID_REQUEST" | "VALIDATION_ERROR" | "ORIGIN_NOT_ALLOWED"
  | "JOB_NOT_AVAILABLE" | "PAYLOAD_TOO_LARGE" | "UNSUPPORTED_MEDIA_TYPE"
  | "INVALID_FILE" | "RATE_LIMITED" | "SERVICE_UNAVAILABLE" | "INTERNAL_ERROR"
  | "NOT_IMPLEMENTED" | "NOT_FOUND";
export interface SubmissionAccepted {
  ok: true;
  data: { status: "received"; message: string };
  requestId: string;
}
export interface ApiErrorResponse {
  ok: false;
  error: { code: ApiErrorCode; message: string; fieldErrors?: Record<string, string[]> };
  requestId: string;
}
export type SubmissionResponse = SubmissionAccepted | ApiErrorResponse;

