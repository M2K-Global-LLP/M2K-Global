import { useRef, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, resumeMetadataSchema, type ApplicationRequest } from "@m2k/contracts";
import { publicContent } from "../../generated/public-content.js";
import { ApiFailure, sendApplication } from "../../lib/api.js";
import { Button } from "../ui/Button.js";
import { FormField, fieldA11y } from "./FormField.js";
import { FormStatus, type FormState } from "./FormStatus.js";
import { formError } from "./form-errors.js";
const copy = publicContent.forms;
export function ApplicationForm({ jobSlug }: { jobSlug: string }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState(""); const [state, setState] = useState<FormState>("idle"); const [message, setMessage] = useState("");
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ApplicationRequest>({ resolver: zodResolver(applicationSchema), defaultValues: { jobSlug, name: "", email: "", phone: "", linkedInUrl: "", coverLetter: "", website: "" } });
  async function onSubmit(data: ApplicationRequest) {
    const file = fileInput.current?.files?.[0]; setFileError("");
    if (!file || !resumeMetadataSchema.safeParse({ originalName: file.name, contentType: file.type, size: file.size }).success) { setFileError(copy.ui.resumeHint); fileInput.current?.focus(); return; }
    setState("submitting"); setMessage("");
    try { await sendApplication(data, file); setState("success"); }
    catch (error) {
      if (error instanceof ApiFailure) {
        if (error.fields.includes("resume") || ["INVALID_FILE", "PAYLOAD_TOO_LARGE"].includes(error.code)) setFileError(copy.ui.resumeHint);
        for (const key of error.fields) if (["name", "email", "phone", "linkedInUrl", "coverLetter", "privacyConsent"].includes(key)) setError(key as keyof ApplicationRequest, { message: copy.ui.checkField });
      }
      setMessage(formError(error)); setState("error");
    }
  }
  if (state === "success") return <FormStatus state={state} />;
  return <form method="post" noValidate className="submission-form" onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting}>
    <input type="hidden" {...register("jobSlug")} />
    <noscript><p>{copy.ui.javascriptRequired}</p></noscript><div className="form-grid">{(["name", "email", "phone", "linkedInUrl"] as const).map((name) => <FormField key={name} id={"apply-" + name} label={copy.ui[name]} error={errors[name]?.message}><input {...register(name)} {...fieldA11y("apply-" + name, errors[name])} type={name === "email" ? "email" : name === "phone" ? "tel" : name === "linkedInUrl" ? "url" : "text"} autoComplete={name === "linkedInUrl" ? "url" : name === "phone" ? "tel" : name} maxLength={name === "name" ? 100 : name === "email" ? 254 : name === "phone" ? 30 : 500} /></FormField>)}</div>
    <FormField id="apply-resume" label={copy.ui.resume} hint={copy.ui.resumeHint} error={fileError || undefined}><input ref={fileInput} name="resume" type="file" accept=".pdf,application/pdf" {...fieldA11y("apply-resume", fileError, true)} onChange={() => setFileError("")} /></FormField>
    <FormField id="apply-coverLetter" label={copy.ui.coverLetter} error={errors.coverLetter?.message}><textarea {...register("coverLetter")} {...fieldA11y("apply-coverLetter", errors.coverLetter)} rows={5} maxLength={5000} /></FormField>
    <div className="honeypot" aria-hidden="true"><label htmlFor="apply-website">{copy.ui.website}</label><input id="apply-website" {...register("website")} tabIndex={-1} autoComplete="off" /></div>
    <FormField id="apply-consent" label={copy.ui.consentLabel} error={errors.privacyConsent?.message}><div className="consent-row"><input type="checkbox" {...register("privacyConsent")} {...fieldA11y("apply-consent", errors.privacyConsent)} /><span>{copy.ui.consent} <Link to="/privacy-policy">{copy.ui.privacyLink}</Link></span></div></FormField>
    <FormStatus state={state} message={message || undefined} /><Button type="submit" loading={isSubmitting} disabled={isSubmitting}>{isSubmitting ? copy.ui.submitting : copy.ui.sendApplication}</Button>
  </form>;
}
