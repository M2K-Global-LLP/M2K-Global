import { z } from "zod";
export const contactServiceSchema = z.enum(["social-impact", "tender-advisory", "it-product-delivery", "tender-saar", "language-training", "skill-development", "export-readiness", "other"]);
export const contactSchema = z.strictObject({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: z.string().trim().min(1).max(30),
  organization: z.string().trim().max(200).optional(),
  service: contactServiceSchema.optional(),
  message: z.string().trim().min(20).max(5000),
  privacyConsent: z.literal(true),
  website: z.string().max(200),
});
export type ContactRequest = z.infer<typeof contactSchema>;

