import type { MetaDescriptor } from "react-router";
import { company, copy, pageFor, services } from "../content.js";
import { site } from "../../generated/route-manifest.js";
import { seoHead } from "./SeoHead.js";
import { structuredData, type JsonLdValue } from "./StructuredData.js";
export function breadcrumbItems(path: string) {
  const items = [{ label: copy.ui.home, href: "/" }];
  if (path === "/") return items;
  if (path.startsWith("/services/")) items.push({ label: copy.ui.services, href: "/services" });
  const service = services.find((service) => path === "/services/" + service.slug);
  const label = service?.title ?? (path === "/about" ? copy.aboutHero.eyebrow : path === "/tender-saar" ? copy.ui.productName : path === "/services" ? copy.ui.services : pageFor(path).h1);
  return [...items, { label, href: path }];
}
export function coreMeta(path: string): MetaDescriptor[] {
  const descriptors = seoHead(pageFor(path));
  if (path !== "/") descriptors.push(structuredData({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems(path).map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, item: new URL(item.href, site.origin).href })),
  }));
  const real = (value: string | undefined) => value && !value.includes("[") && !value.includes("]");
  if (real(company.name) && !new URL(site.origin).hostname.endsWith(".invalid") && new URL(site.origin).hostname !== "localhost") {
    const organization: Record<string, JsonLdValue> = { "@context": "https://schema.org", "@type": "Organization", name: company.name, url: site.origin };
    if (real(company.email)) organization.email = company.email;
    if (real(company.phone)) organization.telephone = company.phone;
    if (real(company.address)) organization.address = company.address;
    if (company.logo) organization.logo = new URL(company.logo.src, site.origin).href;
    descriptors.push(structuredData(organization));
  }
  return descriptors;
}

