import { z } from "zod";
import { serviceSlugSchema, slugSchema } from "../../../packages/contracts/src/identifiers.js";
const text = z.string().trim().min(1);
const date = z.iso.date();
const icon = z.enum(["Building2", "Handshake", "Monitor", "Languages", "GraduationCap", "Landmark", "BriefcaseBusiness", "Pickaxe", "BookOpen", "MessagesSquare", "Globe2"]);
const localImage = z.string().regex(/^\/(placeholders|images)\/[a-zA-Z0-9/_-]+\.(svg|png|jpg|jpeg|webp)$/);
export const seoSchema = z.strictObject({ title: text, description: text, image: localImage.optional(), noIndex: z.boolean().optional() });
const imageSchema = z.strictObject({ src: localImage, alt: z.string() });
const sectionSchema = z.strictObject({ id: slugSchema, heading: text, bodyMarkdown: text });
export const serviceSchema = z.strictObject({
  slug: serviceSlugSchema, title: text, summary: text, icon,
  audience: z.array(text), offerings: z.array(text), deliverySteps: z.array(text),
  overview: text, problems: z.array(text), approach: text, sections: z.array(sectionSchema), faqIds: z.array(slugSchema), seo: seoSchema,
});
export const projectSchema = z.strictObject({
  slug: slugSchema, title: text, approved: z.boolean(), summary: text,
  serviceSlugs: z.array(serviceSlugSchema), industryId: slugSchema,
  clientDisplayName: text.optional(), image: imageSchema.optional(),
  overview: text, challenge: text, scope: z.array(text), approach: z.array(text), servicesDelivered: z.array(text), methodology: text.optional(), outcomesApproved: z.boolean(),
  sections: z.array(sectionSchema), outcomes: z.array(text).optional(), outcomeMetrics: z.array(z.strictObject({ value: text, label: text })).optional(), seo: seoSchema,
});
export const insightSchema = z.strictObject({
  slug: slugSchema, title: text, status: z.enum(["draft", "published"]), contentType: z.enum(["Article", "Guide"]).optional(),
  excerpt: text, bodyMarkdown: text, authorName: text.optional(),
  publishedAt: date.optional(), updatedAt: date.optional(), tags: z.array(text),
  image: imageSchema.optional(), seo: seoSchema,
}).superRefine((value, ctx) => {
  if (value.status === "published" && !value.publishedAt) ctx.addIssue({ code: "custom", path: ["publishedAt"], message: "Published Insights require a date." });
  if (value.updatedAt && value.publishedAt && value.updatedAt < value.publishedAt) ctx.addIssue({ code: "custom", path: ["updatedAt"], message: "Update cannot precede publication." });
});
export const jobSchema = z.strictObject({
  slug: slugSchema, title: text, status: z.enum(["draft", "open", "closed"]),
  applicantCountries: z.array(text).min(1).optional(),
  locationAddress: z.strictObject({ streetAddress: text, addressLocality: text, addressRegion: text, postalCode: text, addressCountry: z.string().length(2) }).optional(),
  department: text, location: text, workMode: z.enum(["onsite", "hybrid", "remote"]),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"]),
  summary: text, responsibilities: z.array(text), requirements: z.array(text),
  descriptionMarkdown: text, publishedAt: date.optional(), closesAt: date.optional(), seo: seoSchema,
}).superRefine((value, ctx) => {
  if (value.status !== "draft" && (!value.publishedAt || !value.requirements.length || !value.responsibilities.length)) ctx.addIssue({ code: "custom", message: "Published jobs require a date, responsibilities and requirements." });
  if (value.closesAt && value.publishedAt && value.closesAt < value.publishedAt) ctx.addIssue({ code: "custom", message: "Closing date cannot precede publication." });
});
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);
export const companySchema = z.strictObject({
  name: text, email: z.union([z.literal("[EMAIL]"), z.email()]),
  phone: text, address: text, tagline: text.optional(), logo: imageSchema.optional(),
  siteUrl: z.url().optional(), positioning: text, socialLinks: z.array(z.strictObject({ label: text, href: z.url().startsWith("https://") })).optional(),
  brand: z.strictObject({ primary: hex, accent: hex, background: hex, footer: hex }),
});
export const industrySchema = z.strictObject({ id: slugSchema, name: text, description: text, icon });
export const faqSchema = z.strictObject({ id: slugSchema, question: text, answerMarkdown: text });
export const navItemSchema = z.strictObject({ label: text, href: z.string().startsWith("/") });
export const pageSchema = z.strictObject({ path: z.string().startsWith("/"), h1: text, seo: seoSchema });
export const tenderSaarSchema = z.strictObject({
  title: text, tagline: text, summary: text, overview: text,
  workflow: z.array(z.strictObject({ title: text, description: text })), faqIds: z.array(slugSchema),
  features: z.array(z.strictObject({ id: slugSchema, title: text, description: text, icon: text })),
  pricing: z.strictObject({
    status: z.enum(["unconfirmed", "published"]), introduction: text,
    plans: z.array(z.strictObject({ id: slugSchema, name: text, priceLabel: text, features: z.array(text) })),
  }), seo: seoSchema,
}).superRefine((value, ctx) => {
  if (value.pricing.status === "unconfirmed" && value.pricing.plans.length) ctx.addIssue({ code: "custom", message: "Unconfirmed pricing must have no plans." });
});
export const legalSchema = z.strictObject({
  privacy: z.strictObject({ status: z.literal("draft"), bodyMarkdown: text }),
  terms: z.strictObject({ status: z.literal("draft"), bodyMarkdown: text }),
});
export const formsSchema = z.strictObject({ unavailable: text, received: text, error: text, contactHero: z.strictObject({ eyebrow: text, title: text, description: text }), services: z.array(z.strictObject({ value: text, label: text })), ui: z.record(z.string(), text) });
export const siteSeoSchema = z.strictObject({ locale: text, placeholderNotice: text });
export type Service = z.infer<typeof serviceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Insight = z.infer<typeof insightSchema>;
export type Job = z.infer<typeof jobSchema>;
export type CompanyConfig = z.infer<typeof companySchema>;
export type Page = z.infer<typeof pageSchema>;

