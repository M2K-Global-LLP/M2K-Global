import { z } from "zod";
export const serviceSlugs = ["social-impact", "tender-advisory", "it-product-delivery", "language-training", "skill-development", "export-readiness"] as const;
export const serviceSlugSchema = z.enum(serviceSlugs);
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100);
export type ServiceSlug = z.infer<typeof serviceSlugSchema>;
export const resumePolicy = { maxBytes: 5 * 1024 * 1024, contentType: "application/pdf", extension: ".pdf" } as const;

