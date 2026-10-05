import { ChevronDown } from "lucide-react";
import { copy, faqs } from "../../lib/content.js";
import { SectionHeading } from "../ui/SectionHeading.js";
export function FAQ({ ids }: { ids: readonly string[] }) {
  const items = faqs.filter((item) => ids.includes(item.id));
  if (!items.length) return null;
  return <section className="section" data-reveal><div className="container faq-layout"><SectionHeading eyebrow={copy.ui.faqEyebrow} title={copy.ui.faq} /><div className="faq-list">{items.map((item) => <details key={item.id}><summary>{item.question}<ChevronDown size={20} aria-hidden="true" /></summary><div className="faq-answer"><div className="faq-answer-inner"><p>{item.answerMarkdown}</p></div></div></details>)}</div></div></section>;
}

