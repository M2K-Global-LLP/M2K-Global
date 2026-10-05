import type { MetaFunction } from "react-router";
import { jobPosting } from "./job-posting.js";
import { insights, careers, company } from "../content.js";
import { routeManifest, site } from "../../generated/route-manifest.js";
import { seoHead } from "./SeoHead.js";
import { structuredData } from "./StructuredData.js";
export const meta: MetaFunction = ({ location }) => {
  const page = routeManifest.find((item) => item.path === location.pathname) ?? routeManifest.find((item) => item.path === "/404")!;
  const result = seoHead(page);
  const insight = insights.find((item) => location.pathname === "/insights/" + item.slug);
  const realOrigin = !new URL(site.origin).hostname.endsWith(".invalid") && new URL(site.origin).hostname !== "localhost";
  if (insight) result.push(structuredData({ "@context": "https://schema.org", "@type": "Article", headline: insight.title, description: insight.excerpt, ...(insight.publishedAt ? { datePublished: insight.publishedAt } : {}), ...(insight.updatedAt ? { dateModified: insight.updatedAt } : {}), ...(insight.authorName ? { author: { "@type": "Person", name: insight.authorName } } : {}), ...(realOrigin ? { mainEntityOfPage: new URL(page.path, site.origin).href } : {}) }));
  const job = careers.find((item) => location.pathname === "/careers/" + item.slug);
  const posting = job ? jobPosting(job, company, site.origin) : undefined;
  if (posting) result.push(structuredData(posting));
  return result;
};
