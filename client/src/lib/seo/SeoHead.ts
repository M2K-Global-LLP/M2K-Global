import { publicContent } from "../../generated/public-content.js";
import type { MetaDescriptor } from "react-router";
import type { Page } from "../../schemas/content.schema.js";
import { site } from "../../generated/route-manifest.js";
export function seoHead(page: Page): MetaDescriptor[] {
  const canonical = new URL(page.path, site.origin).href;
  const image = new URL(page.seo.image ?? "/images/m2k-global-og.png", site.origin).href;
  return [
    { property: "og:type", content: page.path.startsWith("/insights/") ? "article" : "website" },
    { property: "og:site_name", content: publicContent.company.name },
    { property: "og:title", content: page.seo.title },
    { property: "og:description", content: page.seo.description },
    { property: "og:url", content: canonical },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: publicContent.company.name },
    { name: "twitter:card", content: "summary_large_image" },
    { title: page.seo.title },
    { name: "description", content: page.seo.description },
    { tagName: "link", rel: "canonical", href: new URL(page.path, site.origin).href },
    ...(!site.indexable || page.seo.noIndex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
  ];
}

