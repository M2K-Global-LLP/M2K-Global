import { z } from "zod";
const text = z.string().trim().min(1);
const link = z.strictObject({ label: text, href: z.string().regex(/^(\/|#)/) });
export const heroSchema = z.strictObject({ eyebrow: text, title: text, description: text, primary: link, secondary: link });
const section = z.strictObject({ eyebrow: text, title: text, description: text });
const item = z.strictObject({ title: text, description: text, icon: text.optional() });
export const siteCopySchema = z.strictObject({
  ui: z.record(z.string(), text), homeHero: heroSchema, aboutHero: heroSchema, servicesHero: heroSchema,
  strip: z.array(text).length(4), visualLabels: z.array(text).length(3), sections: z.record(z.string(), section),
  pillars: z.array(item).length(4), values: z.array(item), approach: z.array(item),
  cta: z.strictObject({ eyebrow: text, title: text, description: text, label: text, href: z.string().startsWith("/") }),
  footerGroups: z.array(z.strictObject({ title: text, links: z.array(link) })).length(4),
});
export const tenderSampleSchema = z.strictObject({
  id: text, title: text, category: text, department: text, deadline: text, location: text,
  value: text, summary: text, guidance: text, sourceUrl: z.url(),
});


export const collectionCopySchema = z.strictObject({
  ui: z.record(z.string(), text), projectsHero: z.strictObject({ eyebrow: text, title: text, description: text }),
  insightsHero: z.strictObject({ eyebrow: text, title: text, description: text }), careersHero: z.strictObject({ eyebrow: text, title: text, description: text }),
  categories: z.array(z.strictObject({ id: text, label: text, serviceSlugs: z.array(z.enum(["social-impact", "tender-advisory", "it-product-delivery", "language-training", "skill-development", "export-readiness"])).min(1) })).length(4),
  careerPrinciples: z.array(item), workModes: z.strictObject({ onsite: text, hybrid: text, remote: text }),
  employmentTypes: z.strictObject({ "full-time": text, "part-time": text, contract: text, internship: text }),
});
