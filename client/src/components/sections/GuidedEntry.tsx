import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { services } from "../../lib/content.js";

const needs = ["Advisory", "Assessment", "Technology", "Training"] as const;
type Need = typeof needs[number];

export function GuidedEntry() {
  const [step, setStep] = useState<1 | 2>(1);
  const [focus, setFocus] = useState("");
  const [need, setNeed] = useState<Need | "">("");
  const selectedService = services.find((service) => service.slug === focus);
  const contactHref = selectedService ? "/contact?service=" + encodeURIComponent(selectedService.slug) : "/contact";

  return <section className="guided-entry section" aria-labelledby="guided-entry-title" data-reveal>
    <div className="container guided-entry-inner">
      <div className="guided-entry-heading">
        <p className="eyebrow">A considered next step</p>
        <h2 id="guided-entry-title">Find the right place to start.</h2>
        <p>Choose a focus and the kind of support you need to find a relevant service.</p>
      </div>
      <div className="guided-entry-panel">
        <p className="guided-entry-progress" aria-live="polite">Step {step} of 2</p>
        {step === 1 ? <fieldset className="guided-entry-step">
          <legend>What&apos;s your focus area?</legend>
          <div className="guided-entry-options">
            {services.map((service) => <button key={service.slug} type="button" className="guided-entry-option" aria-pressed={focus === service.slug} onClick={() => setFocus(service.slug)}>{service.title}</button>)}
          </div>
          <button className="guided-entry-next" type="button" disabled={!focus} onClick={() => setStep(2)}>Next <ArrowRight size={17} aria-hidden="true" /></button>
        </fieldset> : <fieldset className="guided-entry-step">
          <legend>What do you need?</legend>
          <div className="guided-entry-options guided-entry-needs">
            {needs.map((item) => <button key={item} type="button" className="guided-entry-option" aria-pressed={need === item} onClick={() => setNeed(item)}>{item}</button>)}
          </div>
          <div className="guided-entry-actions">
            <button className="guided-entry-back" type="button" onClick={() => setStep(1)}><ArrowLeft size={16} aria-hidden="true" /> Back</button>
            <div className="guided-entry-destinations">
              {selectedService && need ? <Link className="button button-primary" to={"/services/" + selectedService.slug}>Explore {selectedService.title}<ArrowUpRight size={16} aria-hidden="true" /></Link> : <button className="button button-primary" type="button" disabled>Select a need to continue</button>}
              {selectedService && need ? <Link className="guided-entry-contact" to={contactHref}>Discuss {need.toLowerCase()} with our team</Link> : null}
            </div>
          </div>
        </fieldset>}
      </div>
    </div>
  </section>;
}
