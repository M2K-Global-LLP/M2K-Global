import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { iconFor } from "../../lib/icons.js";
import { copy } from "../../lib/content.js";
import type { Service } from "../../schemas/content.schema.js";
export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = iconFor(service.icon);
  return <article className="service-card" data-reveal-item>
    <div className="service-card-top"><Icon size={27} strokeWidth={1.5} aria-hidden="true" /><span className="index-number">{String(index + 1).padStart(2, "0")}</span></div>
    <h3><Link to={"/services/" + service.slug}>{service.title}</Link></h3><p>{service.summary}</p>
    <Link to={"/services/" + service.slug} className="text-link" data-cta aria-label={copy.ui.learnMore + ": " + service.title}>{copy.ui.learnMore}<ArrowUpRight size={17} aria-hidden="true" /></Link>
  </article>;
}

