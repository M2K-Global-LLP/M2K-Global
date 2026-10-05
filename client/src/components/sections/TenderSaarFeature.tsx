import { iconFor } from "../../lib/icons.js";
export function TenderSaarFeature({ feature }: { feature: { title: string; description: string; icon: string } }) {
  const Icon = iconFor(feature.icon);
  return <article className="feature-item" data-reveal-item><span className="icon-box"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span><h3>{feature.title}</h3><p>{feature.description}</p></article>;
}

