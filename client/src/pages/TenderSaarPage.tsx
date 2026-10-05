import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router";
import { copy, tenderSaar } from "../lib/content.js";
import { urls, tenderSaarDestination } from "../lib/urls.js";
import { Hero } from "../components/sections/Hero.js";
import { SectionHeading } from "../components/ui/SectionHeading.js";
import { Button } from "../components/ui/Button.js";
import { Workflow } from "../components/sections/Workflow.js";
import { TenderSaarFeature } from "../components/sections/TenderSaarFeature.js";
import { TenderDashboard } from "../components/sections/TenderDashboard.js";
import { FAQ } from "../components/sections/FAQ.js";
import { CTASection } from "../components/sections/CTASection.js";
export function TenderSaarPage() {
  return <>
    <Hero className="tender-hero" eyebrow={tenderSaar.title} title={tenderSaar.tagline} description={tenderSaar.summary}
      primary={{ label: urls.tenderSaarApp ? copy.ui.startFree : copy.ui.contactFallback, href: tenderSaarDestination }}
      secondary={{ label: urls.tenderSaarApp ? copy.ui.exploreApp : copy.ui.contactExplore, href: tenderSaarDestination }}
      crumbs={[{ label: copy.ui.home, href: "/" }, { label: tenderSaar.title, href: "/tender-saar" }]} />
    <section className="section tender-overview" data-reveal><div className="container intro-layout"><SectionHeading eyebrow={copy.sections.tenderOverview.eyebrow} title={copy.sections.tenderOverview.title} /><div className="intro-copy"><p>{tenderSaar.overview}</p><Link to="#workspace" className="text-link" data-cta>{copy.ui.discoveryLink}<ArrowUpRight size={17} aria-hidden="true" /></Link></div></div></section>
    <section className="section workflow-section" id="how-it-works" data-reveal><div className="container"><SectionHeading {...copy.sections.workflow} /><Workflow /></div></section>
    <section className="section" id="features" data-reveal><div className="container"><SectionHeading {...copy.sections.tenderFeatures} /><div className="features-grid" data-reveal-group>{tenderSaar.features.map((feature) => <TenderSaarFeature key={feature.id} feature={feature} />)}</div></div></section>
    <section className="section section-muted" id="workspace" data-reveal><div className="container"><SectionHeading {...copy.sections.tenderDiscovery} /><TenderDashboard /></div></section>
    <section className="section" data-reveal><div className="container intro-layout"><SectionHeading {...copy.sections.tenderGuidance} /><ul className="guidance-list" data-reveal-group>{tenderSaar.features.filter((feature) => ["understanding", "source", "decision", "expert"].includes(feature.id)).map((feature) => <li key={feature.id} data-reveal-item><Check size={18} aria-hidden="true" /><div><h3>{feature.title}</h3><p>{feature.description}</p></div></li>)}</ul></div></section>
    <section className="section pricing-section" id="pricing" data-reveal><div className="container pricing-inner"><div><p className="eyebrow">{copy.ui.pricingEyebrow}</p><h2>{tenderSaar.pricing.status === "unconfirmed" ? copy.ui.pricingTitle : copy.ui.pricingConfirmed}</h2><p>{tenderSaar.pricing.introduction}</p></div>
      {tenderSaar.pricing.status === "unconfirmed" ? <Button href={urls.tenderSaarContact}>{copy.ui.pricingContact}</Button> : <div className="pricing-plans">{(tenderSaar.pricing.plans as Array<{ id: string; name: string; priceLabel: string; features: string[] }>).map((plan) => <article key={plan.id}><h3>{plan.name}</h3><p>{plan.priceLabel}</p><ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><Button href={tenderSaarDestination}>{copy.ui.contact}</Button></article>)}</div>}
    </div></section>
    <FAQ ids={tenderSaar.faqIds} /><CTASection />
  </>;
}

