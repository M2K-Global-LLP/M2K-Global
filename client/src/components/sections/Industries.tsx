import { copy, industries } from "../../lib/content.js";
import { SectionHeading } from "../ui/SectionHeading.js";
import { IndustryCard } from "../cards/IndustryCard.js";
export function Industries() {
  return <section className="section industries-section" data-reveal><div className="container"><SectionHeading {...copy.sections.industries} /><div className="industries-grid" data-reveal-group>{industries.map((industry) => <IndustryCard key={industry.id} industry={industry} />)}</div></div></section>;
}

