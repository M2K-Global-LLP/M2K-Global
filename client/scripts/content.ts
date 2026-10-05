import { readdir, readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { company } from "../src/content/company.js";
import { services } from "../src/content/services.js";
import { projects } from "../src/content/projects.js";
import { careers } from "../src/content/careers.js";
import { industries } from "../src/content/industries.js";
import { faq } from "../src/content/faq.js";
import { nav } from "../src/content/nav.js";
import { pages, notFound } from "../src/content/pages.js";
import { collectionCopy } from "../src/content/collections.js";
import { siteCopy } from "../src/content/site.js";
import { siteCopySchema, tenderSampleSchema, collectionCopySchema } from "../src/schemas/site.schema.js";
import { tenderSaar, tenderSamples } from "../src/content/tender-saar.js";
import { forms } from "../src/content/forms.js";
import { legal } from "../src/content/legal.js";
import { seo } from "../src/content/seo.js";
import * as schemas from "../src/schemas/content.schema.js";
import { serviceSlugs } from "../../packages/contracts/src/identifiers.js";
export const clientRoot = fileURLToPath(new URL("../", import.meta.url));
export const repoRoot = resolve(clientRoot, "..");
export const outputRoot = resolve(clientRoot, "dist/client");
export async function loadContent() {
  collectionCopySchema.parse(collectionCopy);
  const folder = resolve(clientRoot, "src/content/insights");
  const insights = await Promise.all((await readdir(folder)).filter((file) => file.endsWith(".md")).sort().map(async (file) => {
    const parsed = matter(await readFile(resolve(folder, file), "utf8"));
    return schemas.insightSchema.parse({ ...parsed.data, bodyMarkdown: parsed.content.trim() });
  }));
  const content = {
    collectionCopy, siteCopy: siteCopySchema.parse(siteCopy), tenderSamples: z.array(tenderSampleSchema).parse(tenderSamples),
    company: schemas.companySchema.parse(company), services: z.array(schemas.serviceSchema).parse(services),
    projects: z.array(schemas.projectSchema).parse(projects), careers: z.array(schemas.jobSchema).parse(careers),
    insights, industries: z.array(schemas.industrySchema).parse(industries), faq: z.array(schemas.faqSchema).parse(faq),
    nav: z.array(schemas.navItemSchema).parse(nav), pages: z.array(schemas.pageSchema).parse(pages),
    notFound: schemas.pageSchema.parse(notFound),
    tenderSaar: schemas.tenderSaarSchema.parse(tenderSaar), forms: schemas.formsSchema.parse(forms),
    legal: schemas.legalSchema.parse(legal), seo: schemas.siteSeoSchema.parse(seo),
  };
  function unique(values: string[], label: string) {
    if (new Set(values).size !== values.length) throw new Error("Duplicate " + label);
  }
  for (const [label, records] of Object.entries({ services: content.services, projects: content.projects, careers: content.careers, insights: content.insights })) {
    unique(records.map((item) => item.slug), label + " slug");
    if (records.some((item) => item.slug === "placeholder")) throw new Error("The placeholder slug is reserved for Phase 1.");
  }
  unique(content.industries.map((item) => item.id), "industry");
  unique(content.faq.map((item) => item.id), "FAQ");
  unique(content.pages.map((item) => item.path), "page");
  if (content.services.length !== serviceSlugs.length) throw new Error("Service catalog must include every supported service slug.");
  for (const service of content.services) for (const id of service.faqIds) {
    if (!content.faq.some((item) => item.id === id)) throw new Error("Unknown FAQ: " + id);
  }
  for (const project of content.projects) {
    if (!content.industries.some((item) => item.id === project.industryId)) throw new Error("Unknown industry: " + project.industryId);
  }
  const pagePaths = new Set(content.pages.map((item) => item.path));
  for (const item of content.nav) if (!pagePaths.has(item.href)) throw new Error("Unknown nav path: " + item.href);
  async function checkImages(value: unknown): Promise<void> {
    if (typeof value === "string" && /^\/(placeholders|images)\//.test(value)) await access(resolve(clientRoot, "public", value.slice(1)));
    else if (Array.isArray(value)) await Promise.all(value.map(checkImages));
    else if (value && typeof value === "object") await Promise.all(Object.values(value).map(checkImages));
  }
  await checkImages(content);
  return content;
}
export type Content = Awaited<ReturnType<typeof loadContent>>;
export function selectPublicContent(content: Content) {
  return {
    collectionCopy: content.collectionCopy, siteCopy: content.siteCopy, tenderSamples: content.tenderSamples, company: content.company, services: content.services,
    projects: content.projects.filter((item) => item.approved).map(({ outcomes, outcomeMetrics, ...item }) => ({ ...item, ...(item.outcomesApproved && outcomes ? { outcomes } : {}), ...(item.outcomesApproved && outcomeMetrics ? { outcomeMetrics } : {}) })),
    insights: content.insights.filter((item) => item.status === "published"),
    careers: content.careers.filter((item) => item.status !== "draft"),
    industries: content.industries, faq: content.faq, nav: content.nav, tenderSaar: content.tenderSaar,
    forms: content.forms, legal: content.legal, seo: content.seo,
  };
}
export function publicPages(content: Content): schemas.Page[] {
  const published = selectPublicContent(content);
  return [
    ...content.pages.map((page) => page.path === "/tender-saar" ? { ...page, seo: content.tenderSaar.seo } : page),
    ...published.services.map((item) => ({ path: "/services/" + item.slug, h1: item.title, seo: item.seo })),
    ...published.projects.map((item) => ({ path: "/projects/" + item.slug, h1: item.title, seo: item.seo })),
    ...published.insights.map((item) => ({ path: "/insights/" + item.slug, h1: item.title, seo: item.seo })),
    ...published.careers.map((item) => ({ path: "/careers/" + item.slug, h1: item.title, seo: item.seo })),
    content.notFound,
  ];
}

