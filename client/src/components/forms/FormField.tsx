import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
export function FormField({ id, label, error, hint, required = false, children }: { id: string; label: string; error?: string | undefined; hint?: string; required?: boolean; children: ReactNode }) {
  return <div className="form-field"><label htmlFor={id}>{label}{required ? <span className="required-mark" aria-hidden="true"> *</span> : null}</label>{hint ? <p id={id + "-hint"} className="field-hint">{hint}</p> : null}{children}{error ? <p id={id + "-error"} className="field-error"><CircleAlert size={16} aria-hidden="true" /><span>{error}</span></p> : null}</div>;
}
export function fieldA11y(id: string, error: unknown, hint = false) { return { id, "aria-invalid": !!error, "aria-describedby": [hint ? id + "-hint" : "", error ? id + "-error" : ""].filter(Boolean).join(" ") || undefined }; }
