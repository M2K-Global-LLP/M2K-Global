import { publicContent } from "../generated/public-content.js";
import type { Project, Insight, Service, CompanyConfig, Job } from "../schemas/content.schema.js";
import { routeManifest } from "../generated/route-manifest.js";
export const copy = publicContent.siteCopy;
export const company: CompanyConfig = publicContent.company;
export const services: Service[] = publicContent.services as Service[];
export const projects: Project[] = publicContent.projects as Project[];
export const insights: Insight[] = publicContent.insights as Insight[];
export const tenderSaar = publicContent.tenderSaar;
export const samples = publicContent.tenderSamples;
export const industries = publicContent.industries;
export const faqs = publicContent.faq;
export const nav = publicContent.nav;
export function pageFor(path: string) {
  const page = routeManifest.find((page) => page.path === path);
  if (!page) throw new Error("Missing page metadata: " + path);
  return page;
}


export const collections = publicContent.collectionCopy;
export const careers: Job[] = publicContent.careers as Job[];
export const legal = publicContent.legal;
