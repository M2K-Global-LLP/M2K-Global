import { test } from "node:test";
import assert from "node:assert/strict";
import { contactSchema, applicationSchema, applicationMultipartSchema, resumeMetadataSchema } from "../src/index.js";
test("contact requires name, email, phone and message, and rejects missing consent or unknown fields", () => {
  const request = { name: "Sample User", email: "user@example.org", phone: "+1 555 0100", message: "Please share service information.", privacyConsent: true, website: "" };
  assert.equal(contactSchema.safeParse(request).success, true);
  assert.equal(contactSchema.safeParse({ ...request, phone: "" }).success, false);
  const { phone: _phone, ...withoutPhone } = request;
  assert.equal(contactSchema.safeParse(withoutPhone).success, false);
  assert.equal(contactSchema.safeParse({ ...request, privacyConsent: false }).success, false);
  assert.equal(contactSchema.safeParse({ ...request, recipient: "attacker@example.org" }).success, false);
});
test("multipart consent is strict and PDF metadata respects size limits", () => {
  const request = { jobSlug: "sample-job", name: "Sample User", email: "user@example.org", privacyConsent: "true", website: "" };
  assert.equal(applicationMultipartSchema.parse(request).privacyConsent, true);
  assert.equal(applicationMultipartSchema.safeParse({ ...request, privacyConsent: "false" }).success, false);
  assert.equal(resumeMetadataSchema.safeParse({ originalName: "resume.pdf", contentType: "application/pdf", size: 5 * 1024 * 1024 + 1 }).success, false);
});


test("invalid LinkedIn input returns validation errors without throwing", () => {
  for (const linkedInUrl of ["not a URL", "https://example.com/profile", "http://linkedin.com/in/test"]) assert.equal(applicationSchema.safeParse({ jobSlug: "test-job", name: "Test Person", email: "test@example.org", privacyConsent: true, website: "", linkedInUrl }).success, false);
});
