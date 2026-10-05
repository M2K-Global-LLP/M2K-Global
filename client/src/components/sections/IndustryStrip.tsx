import { industries } from "../../lib/content.js";

export function IndustryStrip() {
  return <section className="industry-strip" aria-label="Worked across industries" data-reveal>
    <div className="container industry-strip-inner">
      <p className="industry-strip-label">Worked across</p>
      <ul tabIndex={0} aria-label="Industries">
        {industries.map((industry) => <li key={industry.id}>{industry.name}</li>)}
      </ul>
    </div>
  </section>;
}
