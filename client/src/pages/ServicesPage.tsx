import { copy, services } from "../lib/content.js";
import { Hero } from "../components/sections/Hero.js";
import { SectionHeading } from "../components/ui/SectionHeading.js";
import { ServiceCard } from "../components/cards/ServiceCard.js";
import { CTASection } from "../components/sections/CTASection.js";
export function ServicesPage() {
  return <><Hero {...copy.servicesHero} crumbs={[{ label: copy.ui.home, href: "/" }, { label: copy.ui.services, href: "/services" }]} />
    <section className="section section-muted" id="service-areas"><div className="container"><SectionHeading {...copy.sections.services} /><div className="services-grid services-overview">{services.map((service, index) => <ServiceCard key={service.slug} service={service} index={index} />)}</div></div></section>
    <section className="section"><div className="container"><SectionHeading {...copy.sections.approach} /><ol className="approach-grid">{copy.approach.map((step, index) => <li key={step.title}><span className="step-number">{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></div></section><CTASection /></>;
}

