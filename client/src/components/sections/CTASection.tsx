import { copy } from "../../lib/content.js";
import { Button } from "../ui/Button.js";
export function CTASection() {
  return <section className="cta-section" data-reveal><div className="container cta-inner"><div><p className="eyebrow">{copy.cta.eyebrow}</p><h2>{copy.cta.title}</h2><p>{copy.cta.description}</p></div><Button href={copy.cta.href} variant="light">{copy.cta.label}</Button></div></section>;
}

