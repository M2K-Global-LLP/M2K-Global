import { iconFor } from "../../lib/icons.js";
export function IndustryCard({ industry }: { industry: { name: string; description: string; icon: string } }) {
  const Icon = iconFor(industry.icon);
  return <article className="industry-card" data-reveal-item><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><h3>{industry.name}</h3><p>{industry.description}</p></article>;
}

