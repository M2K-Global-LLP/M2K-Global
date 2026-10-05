import type { Page } from "../schemas/content.schema.js";
import { collectionCopy } from "./collections.js";
import { siteCopy } from "./site.js";
import { tenderSaar } from "./tender-saar.js";
export const pages: Page[] = [
  { path: "/", h1: siteCopy.homeHero.title, seo: { title: "Consulting, Technology & Skills | M2K Global", description: "Consulting, tender advisory, managed technology delivery and skill development for government bodies, PSUs, businesses and institutions." } },
  { path: "/about", h1: siteCopy.aboutHero.title, seo: { title: "About Us | M2K Global", description: "Our purpose, principles and approach to connecting advisory support, technology partners and capability building." } },
  { path: "/services", h1: siteCopy.servicesHero.title, seo: { title: "Our Services | M2K Global", description: "Explore social impact, tender advisory, export readiness, managed IT and product delivery, language training and skill-development services." } },
  { path: "/tender-saar", h1: tenderSaar.tagline, seo: tenderSaar.seo },
  ...([["/insights", "Insights"], ["/careers", "Careers"], ["/contact", "Contact"], ["/privacy-policy", "Privacy Policy"], ["/terms", "Terms"]] as const).map(([path, h1]) => ({ path, h1: path === "/insights" ? collectionCopy.insightsHero.title : path === "/careers" ? collectionCopy.careersHero.title : h1, seo: { noIndex: path === "/privacy-policy" || path === "/terms", title: h1 + " | M2K Global", description: path === "/contact" ? "Contact M2K Global about consulting, tender advisory, technology delivery and training." : h1 + " information for M2K Global. Content is awaiting approval." } })),
];
export const notFound: Page = { path: "/404", h1: "Page not found", seo: { title: "Page not found | M2K Global", description: "The requested page could not be found.", noIndex: true } };
