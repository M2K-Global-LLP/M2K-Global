import type { ApiErrorCode } from "@m2k/contracts";
export class HttpError extends Error {
  constructor(public status: number, public code: ApiErrorCode, message: string, public fieldErrors?: Record<string, string[]>) { super(message); }
}

