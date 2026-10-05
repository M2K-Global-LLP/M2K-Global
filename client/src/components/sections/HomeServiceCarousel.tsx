import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Link } from "react-router";
import { copy, services } from "../../lib/content.js";
import { iconFor } from "../../lib/icons.js";
import { homeServiceVisuals } from "../../lib/serviceVisuals.js";



export function HomeServiceCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const active = services[activeIndex]!;
  const Icon = iconFor(active.icon);
  const visual = homeServiceVisuals[active.slug];
  const canAutoAdvance = ready && !reducedMotion && !manualPause && !focusWithin;

  useEffect(() => {
    for (const { src } of Object.values(homeServiceVisuals)) { const image = new Image(); image.src = src; }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!canAutoAdvance) return;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % services.length), 4000);
    return () => window.clearInterval(timer);
  }, [canAutoAdvance, activeIndex]);

  function moveSlide(direction: number) {
    setFocusWithin(false);
    setActiveIndex((current) => (current + direction + services.length) % services.length);
  }

  function selectSlide(index: number) {
    setFocusWithin(false);
    setActiveIndex(index);
  }

  function togglePlayback() {
    if (manualPause) setFocusWithin(false);
    setManualPause(!manualPause);
  }

  return <section className="home-hero home-cinematic-hero" aria-label="M2K Global introduction">
    <div className="home-cinematic-backdrop" aria-hidden="true">
      <div key={active.slug} className="home-carousel-slide">
        <img className="home-carousel-photo" src={visual.src} alt={visual.alt} fetchPriority="high" />
      </div>
      <div className="home-cinematic-shade" />
      <div className="home-cinematic-texture" />
    </div>
    <div className="container home-cinematic-content">
      <div className="home-cinematic-intro">
        <p className="eyebrow">{copy.homeHero.eyebrow}</p>
        <h1 className="home-brand-claim">{copy.homeHero.title}</h1>
        <Link className="home-active-slide" to={`/services/${active.slug}`} data-active-service={active.slug} aria-live="polite" onFocusCapture={() => setFocusWithin(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false); }}>
          <span className="home-active-icon" aria-hidden="true"><Icon size={27} strokeWidth={1.5} /></span>
          <div className="home-active-copy">
            <p className="home-active-kicker">{copy.sections.services.title}</p>
            <h2 className="home-active-title">{active.title}</h2>
            <p className="home-active-description">{active.summary}</p>
            <span className="home-active-read-more">Read More <ArrowRight size={17} aria-hidden="true" /></span>
          </div>
        </Link>
      </div>
      <div className="home-cinematic-feature" onFocusCapture={() => setFocusWithin(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false); }}>
        <div className="home-carousel-stage" data-active-service={active.slug} aria-label="Featured services" aria-live="off">
          <div className="home-carousel-bottom">
            <div className="home-carousel-dots" aria-label="Choose a service">
              {services.map((service, index) => <button key={service.slug} type="button" className={index === activeIndex ? "is-active" : ""} aria-label={`Show ${service.title}`} aria-pressed={index === activeIndex} onClick={() => selectSlide(index)}><span>{service.title}</span>{index === activeIndex && canAutoAdvance ? <i className="home-carousel-tab-progress" aria-hidden="true" /> : null}</button>)}
            </div>
            <div className="home-carousel-controls">
              <button type="button" aria-label="Previous service" onClick={() => moveSlide(-1)}><ArrowLeft size={17} aria-hidden="true" /></button>
              <button type="button" aria-label={manualPause ? "Play service slides" : "Pause service slides"} onClick={togglePlayback}>{manualPause ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}</button>
              <button type="button" aria-label="Next service" onClick={() => moveSlide(1)}><ArrowRight size={17} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="home-cinematic-bottomline" aria-hidden="true"><span>M2K GLOBAL</span><span>CONSULTING · TECHNOLOGY · SKILLS</span></div>
    <noscript><div className="home-service-static-list container" aria-label="All services">{services.map((service) => <article key={service.slug}><h3>{service.title}</h3><p>{service.summary}</p><a href={`/services/${service.slug}`}>{copy.ui.learnMore}</a></article>)}</div></noscript>
  </section>;
}
