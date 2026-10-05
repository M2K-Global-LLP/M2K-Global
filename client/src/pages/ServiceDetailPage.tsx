import { ArrowRight, Check } from "lucide-react";
import type { Service } from "../schemas/content.schema.js";
import { copy, projects } from "../lib/content.js";
import { Hero } from "../components/sections/Hero.js";
import { SectionHeading } from "../components/ui/SectionHeading.js";
import { Button } from "../components/ui/Button.js";
import { FAQ } from "../components/sections/FAQ.js";
import { CTASection } from "../components/sections/CTASection.js";
import { serviceDetailVisuals } from "../lib/serviceVisuals.js";
export function ServiceDetailPage({ service }: { service: Service }) {
  const related = projects.filter((project) => project.approved && project.serviceSlugs.includes(service.slug));
  const visual = serviceDetailVisuals[service.slug];
  return <>
    <Hero eyebrow={copy.ui.services} title={service.title} description={service.summary} className="service-hero" backgroundImage={visual} primary={{ label: copy.ui.talk, href: "/contact?service=" + service.slug }} secondary={{ label: copy.ui.allServices, href: "/services" }} crumbs={[{ label: copy.ui.home, href: "/" }, { label: copy.ui.services, href: "/services" }, { label: service.title, href: "/services/" + service.slug }]} />
    <section className="section" data-reveal><div className="container detail-overview"><SectionHeading eyebrow={copy.ui.overview} title={copy.ui.challenges} description={service.overview} /><ul className="challenge-list">{service.problems.map((problem) => <li key={problem}><ArrowRight size={18} aria-hidden="true" /><span>{problem}</span></li>)}</ul></div></section>
    <section className="section section-muted" data-reveal><div className="container"><SectionHeading eyebrow={copy.ui.services} title={copy.ui.capabilities} /><div className="capabilities-grid" data-reveal-group>{service.offerings.map((offering, index) => <article key={offering} data-reveal-item><span className="index-number">{String(index + 1).padStart(2, "0")}</span><h3>{offering}</h3></article>)}</div></div></section>
    <section className="section" data-reveal><div className="container intro-layout"><SectionHeading title={copy.ui.approach} /><p className="large-copy">{service.approach}</p></div><div className="container process-block"><h2>{copy.ui.process}</h2><ol className="approach-grid" data-reveal-group>{service.deliverySteps.map((step, index) => <li key={step} data-reveal-item><span className="step-number">{String(index + 1).padStart(2, "0")}</span><h3>{step}</h3></li>)}</ol></div></section>
    <section className="section audience-section" data-reveal><div className="container intro-layout"><SectionHeading title={copy.ui.audience} /><ul className="audience-list">{service.audience.map((audience) => <li key={audience}><Check size={18} aria-hidden="true" />{audience}</li>)}</ul></div></section>
    {service.slug === "it-product-delivery" ? <section className="section" data-reveal><div className="container product-callout"><SectionHeading {...copy.sections.serviceProduct} /><Button href="/tender-saar">{copy.ui.exploreTenderSaar}</Button></div></section> : null}
    {related.length ? <section className="section" data-reveal><div className="container"><SectionHeading title={copy.ui.relatedProjects} /><div className="approved-preview">{related.map((project) => <article key={project.slug}><h3>{project.title}</h3><p>{project.summary}</p><Button href={"/projects/" + project.slug} variant="text">{copy.ui.readProject}</Button></article>)}</div></div></section> : null}
    <FAQ ids={service.faqIds} />{service.slug === "export-readiness" ? <section className="cta-section" data-reveal><div className="container cta-inner"><div><p className="eyebrow">Ready to grow your business?</p><h2>Let’s connect your products with the right opportunities.</h2><p>Talk with our team about buyer connections, documentation and your next market.</p></div><Button href="/contact?service=export-readiness" variant="light">Talk to Our Team</Button></div></section> : <CTASection />}
  </>;
}

