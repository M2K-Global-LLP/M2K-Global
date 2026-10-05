import { InsightCard } from "../components/cards/InsightCard.js";
import { Link } from "react-router";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { copy, insights } from "../lib/content.js";
import { iconFor } from "../lib/icons.js";
import { HomeServiceCarousel } from "../components/sections/HomeServiceCarousel.js";
import { SectionHeading } from "../components/ui/SectionHeading.js";
import { Button } from "../components/ui/Button.js";
import { TenderDashboard } from "../components/sections/TenderDashboard.js";
import { Workflow } from "../components/sections/Workflow.js";
import { EmptyState } from "../components/content/EmptyState.js";
import { GuidedEntry } from "../components/sections/GuidedEntry.js";
import { IndustryStrip } from "../components/sections/IndustryStrip.js";
import { CTASection } from "../components/sections/CTASection.js";
export function HomePage() {
  return <>
    <HomeServiceCarousel />
    <GuidedEntry />
    <div className="capability-strip"><div className="container">{copy.strip.map((label) => <span key={label}><span className="strip-mark" aria-hidden="true" />{label}</span>)}</div></div>
    <section className="section" data-reveal><div className="container intro-layout"><SectionHeading eyebrow={copy.sections.homeIntro.eyebrow} title={copy.sections.homeIntro.title} /><div className="intro-copy"><p>{copy.sections.homeIntro.description}</p><Button href="/about" variant="text">{copy.ui.aboutUs}</Button></div></div></section>
    
    <section className="section product-section" data-reveal><div className="container"><div className="product-heading"><SectionHeading {...copy.sections.product} /><div className="product-intro-action"><Button href="/tender-saar">{copy.ui.exploreProduct}</Button><Link className="text-link" to="/tender-saar#pricing" data-cta>{copy.ui.viewPricing}<ArrowRight size={16} aria-hidden="true" /></Link></div></div><TenderDashboard compact /></div></section>
    <section className="section workflow-section" data-reveal><div className="container"><SectionHeading {...copy.sections.workflow} /><Workflow /></div></section>
    <IndustryStrip />
    <section className="section why-section" data-reveal><div className="container why-layout"><SectionHeading {...copy.sections.why} light /><div className="pillars-grid" data-reveal-group>{copy.pillars.map((pillar) => { const Icon = iconFor(pillar.icon ?? "Layers"); return <article key={pillar.title} data-reveal-item><Icon size={26} strokeWidth={1.4} aria-hidden="true" /><h3>{pillar.title}</h3><p>{pillar.description}</p></article>; })}</div></div></section>
    <section className="section" data-reveal><div className="container"><div className="section-top"><SectionHeading {...copy.sections.insights} /><Link className="text-link" to="/insights" data-cta>{copy.ui.allInsights}<ArrowUpRight size={17} aria-hidden="true" /></Link></div>{insights.length ? <div className="editorial-grid" data-reveal-group>{insights.slice(0, 3).map((insight) => <InsightCard key={insight.slug} insight={insight} />)}</div> : <EmptyState title={copy.ui.insightsEmptyTitle} description={copy.ui.insightsEmptyBody} href="/insights" label={copy.ui.allInsights} />}</div></section>
    <CTASection />
  </>;
}

