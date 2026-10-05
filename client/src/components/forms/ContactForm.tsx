import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, contactServiceSchema, type ContactRequest } from "@m2k/contracts";
import { publicContent } from "../../generated/public-content.js";
import { ApiFailure, sendContact } from "../../lib/api.js";
import { Button } from "../ui/Button.js";
import { FormField, fieldA11y } from "./FormField.js";
import { FormStatus, type FormState } from "./FormStatus.js";
import { formError } from "./form-errors.js";
const copy = publicContent.forms;
export function ContactForm() {
  const [params] = useSearchParams(); const queryService = params.get("service");
  const [state, setState] = useState<FormState>("idle"); const [message, setMessage] = useState("");
  const { register, handleSubmit, setValue, setError, formState: { errors, isSubmitting } } = useForm<ContactRequest>({ resolver: zodResolver(contactSchema), defaultValues: { name: "", email: "", phone: "", organization: "", service: "other", message: "", website: "" } });
  useEffect(() => { const parsed = contactServiceSchema.safeParse(queryService); if (parsed.success) setValue("service", parsed.data); }, [queryService, setValue]);
  async function onSubmit(data: ContactRequest) {
    setState("submitting"); setMessage("");
    try { await sendContact(data); setState("success"); }
    catch (error) {
      if (error instanceof ApiFailure) for (const key of error.fields) if (["name", "email", "phone", "organization", "service", "message", "privacyConsent"].includes(key)) setError(key as keyof ContactRequest, { message: copy.ui.checkField });
      setMessage(formError(error)); setState("error");
    }
  }
  if (state === "success") return <FormStatus state={state} />;
  return <form method="post" noValidate onSubmit={handleSubmit(onSubmit)} className="submission-form" aria-busy={isSubmitting}>
    <noscript><p>{copy.ui.javascriptRequired}</p></noscript><p className="required-fields-note">{copy.ui.requiredFields}</p><div className="form-grid">{(["name", "email", "phone", "organization"] as const).map((name) => <FormField key={name} id={"contact-" + name} label={copy.ui[name]} error={errors[name]?.message} required={name !== "organization"}><input {...register(name)} {...fieldA11y("contact-" + name, errors[name])} type={name === "email" ? "email" : name === "phone" ? "tel" : "text"} autoComplete={name === "organization" ? "organization" : name === "phone" ? "tel" : name} maxLength={name === "email" ? 254 : name === "organization" ? 200 : name === "phone" ? 30 : 100} required={name !== "organization"} /></FormField>)}</div>
    <FormField id="contact-service" label={copy.ui.service} error={errors.service?.message}><select {...register("service")} {...fieldA11y("contact-service", errors.service)}>{copy.services.map((service) => <option key={service.value} value={service.value}>{service.label}</option>)}</select></FormField>
    <FormField id="contact-message" label={copy.ui.message} error={errors.message?.message} required><textarea {...register("message")} {...fieldA11y("contact-message", errors.message)} rows={6} maxLength={5000} required /></FormField>
    <div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">{copy.ui.website}</label><input id="contact-website" {...register("website")} tabIndex={-1} autoComplete="off" /></div>
    <FormField id="contact-consent" label={copy.ui.consentLabel} error={errors.privacyConsent?.message}><div className="consent-row"><input type="checkbox" {...register("privacyConsent")} {...fieldA11y("contact-consent", errors.privacyConsent)} /><span>{copy.ui.consent} <Link to="/privacy-policy">{copy.ui.privacyLink}</Link></span></div></FormField>
    <FormStatus state={state} message={message || undefined} /><Button type="submit" loading={isSubmitting} disabled={isSubmitting}>{isSubmitting ? copy.ui.submitting : copy.ui.sendContact}</Button>
  </form>;
}
