import { CircleCheck, LoaderCircle } from "lucide-react";
import { publicContent } from "../../generated/public-content.js";
export type FormState = "idle" | "submitting" | "success" | "error";
export function FormStatus({ state, message }: { state: FormState; message?: string | undefined }) {
  const text = message ?? (state === "submitting" ? publicContent.forms.ui.submitting : state === "success" ? publicContent.forms.received : "");
  return <div className={"form-status form-status-" + state} role="status" aria-live="polite" aria-atomic="true">{state === "success" ? <CircleCheck className="form-status-icon form-success-icon" size={20} aria-hidden="true" /> : state === "submitting" ? <LoaderCircle className="form-status-icon form-status-spinner" size={18} aria-hidden="true" /> : null}<span>{text}</span></div>
}
