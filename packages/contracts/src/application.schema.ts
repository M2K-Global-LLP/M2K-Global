import { z } from "zod";
import { slugSchema, resumePolicy } from "./identifiers.js";
export const applicationSchema = z.strictObject({
  jobSlug: slugSchema,
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: z.string().trim().max(30).optional(),
  linkedInUrl: z.union([z.literal(""), z.url().max(500).refine((value) => { try { const url = new URL(value); return url.protocol === "https:" && (url.hostname === "linkedin.com" || url.hostname.endsWith(".linkedin.com")); } catch { return false; } }, "Use a valid HTTPS LinkedIn URL.")]).optional(),
  coverLetter: z.string().trim().max(5000).optional(),
  privacyConsent: z.literal(true),
  website: z.string().max(200),
});
export const applicationMultipartSchema = applicationSchema.extend({
  privacyConsent: z.literal("true").transform(() => true as const),
});
// This schema validates metadata only. Phase 4 must also inspect the actual bytes.
export const resumeMetadataSchema = z.strictObject({
  originalName: z.string().min(1).max(255).regex(/\.pdf$/i),
  contentType: z.literal(resumePolicy.contentType),
  size: z.number().int().positive().max(resumePolicy.maxBytes),
});
export type ApplicationRequest = z.infer<typeof applicationSchema>;
export type ApplicationMultipartRequest = z.input<typeof applicationMultipartSchema>;

