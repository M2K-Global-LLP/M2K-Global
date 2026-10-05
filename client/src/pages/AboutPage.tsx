import { copy, services } from "../lib/content.js";
import { iconFor } from "../lib/icons.js";
import { Hero } from "../components/sections/Hero.js";
import { SectionHeading } from "../components/ui/SectionHeading.js";
import { Button } from "../components/ui/Button.js";
import { Link } from "react-router";
import { Industries } from "../components/sections/Industries.js";
import { CTASection } from "../components/sections/CTASection.js";
import type { Service } from "../schemas/content.schema.js";

const ceoServiceDescriptions: Record<Service["slug"], string> = {
  "social-impact": "Research, surveys and programme support shaped by stakeholder needs and practical delivery contexts.",
  "tender-advisory": "Opportunity assessment, bid/no-bid guidance, tender documentation and compliance support.",
  "it-product-delivery": "Requirements shaping and delivery coordination that connect organizations with technology partners.",
  "language-training": "Practical language programmes for workplace, professional and cross-cultural communication.",
  "skill-development": "Training and capacity building that strengthen practical capability for people and organizations.",
  "export-readiness": "Buyer connections, documentation guidance and market opportunities to help suppliers grow.",
};
export function AboutPage() {
  return <>
    <Hero {...copy.aboutHero} className="about-hero" typewriterTitle crumbs={[{ label: copy.ui.home, href: "/" }, { label: copy.aboutHero.eyebrow, href: "/about" }]} />
    <section className="section" data-reveal><div className="container intro-layout"><SectionHeading eyebrow={copy.sections.aboutIntro.eyebrow} title={copy.sections.aboutIntro.title} /><div className="intro-copy"><p>{copy.sections.aboutIntro.description}</p><p>M2K Global is a professional consulting firm committed to creating impact through training, capacity building, research, surveys, and strategic advisory. We partner with government bodies, corporates, and development organizations to design and implement solutions that drive sustainable growth and measurable outcomes.</p><p>Our expertise lies in managing development projects, strengthening skills, and delivering actionable insights that empower communities and enterprises alike. At M2K Global, we believe in bridging gaps, building capacity, and turning ideas into impact.</p></div></div></section>
    <section className="section section-muted" data-reveal><div className="container mission-grid"><SectionHeading {...copy.sections.mission} /><SectionHeading {...copy.sections.vision} /></div></section>
    <section className="section" data-reveal><div className="container"><SectionHeading {...copy.sections.values} /><div className="values-grid" data-reveal-group>{copy.values.map((value) => { const Icon = iconFor(value.icon ?? "Layers"); return <article key={value.title} data-reveal-item><Icon size={28} strokeWidth={1.4} aria-hidden="true" /><h3>{value.title}</h3><p>{value.description}</p></article>; })}</div></div></section>
    <section className="section expertise-section" data-reveal><div className="container intro-layout"><SectionHeading {...copy.sections.expertise} light /><div className="expertise-list" data-reveal-group>{services.map((service, index) => <div key={service.slug} data-reveal-item><span>{String(index + 1).padStart(2, "0")}</span><Button href={"/services/" + service.slug} variant="text">{service.title}</Button></div>)}</div></div></section>
    <section className="section" data-reveal><div className="container"><SectionHeading {...copy.sections.approach} /><ol className="approach-grid" data-reveal-group>{copy.approach.map((step, index) => <li key={step.title} data-reveal-item><span className="step-number">{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></div></section>
    <Industries />
    <section className="section ceo-section" data-reveal>
      <div className="container">
        <SectionHeading eyebrow={copy.sections.leadership.eyebrow} title="Meet the founder and CEO" description="Procurement expertise, strategic advice and practical support for organizations pursuing new opportunities." />
        <div className="ceo-profile-grid">
          <figure className="ceo-portrait">
            <img src="/images/m2k-global-ceo.jpeg" alt="Mahesh Raana, Founder and CEO of M2K Global" width="400" height="400" loading="eager" fetchPriority="high" />
            <figcaption><strong>Mahesh Raana</strong><span>Founder &amp; CEO</span><small>25 years of experience</small></figcaption>
          </figure>
          <div className="ceo-bio">
            <p>With over <strong>25 years of experience in government tender procurement, bid management, tender advisory, and compliance</strong>, the founder of <strong>M2K Global</strong> helps manufacturers, consulting firms, and international organizations navigate complex procurement environments and pursue new business opportunities.</p>
            <p>His professional journey spans structured institutional environments and private-sector consulting, combining operational discipline with commercial strategy. He has supported organizations with tender participation, procurement documentation, supplier engagement, compliance requirements, and strategic sourcing across public and institutional procurement ecosystems.</p>
            <p>As the <strong>Principal Consultant at M2K Global</strong>, he works closely with businesses to develop effective procurement strategies, prepare competitive bids, strengthen vendor engagement, and participate successfully in government and institutional procurement opportunities. His work also supports manufacturers with <strong>export readiness, market access, and international business opportunities.</strong></p>
            <p>Through M2K Global, he works with Indian and international organizations seeking to participate in public procurement programs, develop effective sourcing and supplier strategies, enter the Indian market through compliant procurement channels, and establish partnerships with verified manufacturers and business partners.</p>
            <p>Alongside consulting engagements, he remains open to international collaborations and strategic partnerships in procurement strategy, proposal management, institutional partnerships, sourcing, and market development.</p>
            <div className="ceo-services">
              <h3>Services offered through M2K Global</h3>
              <ul>{services.map((service) => <li key={service.slug}><Link to={"/services/" + service.slug}><strong>{service.title}</strong><span>{ceoServiceDescriptions[service.slug]}</span></Link></li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <CTASection />
  </>;
}

