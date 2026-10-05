import { collections as c, company, legal } from "../lib/content.js";
import { Hero } from "../components/sections/Hero.js";
import { MarkdownContent } from "../components/content/MarkdownContent.js";
import { crumbs } from "./collection-shared.js";
export function LegalPage({ privacy }: { privacy: boolean }) {
  const document = privacy ? legal.privacy : legal.terms;
  const title = privacy ? c.ui.privacy : c.ui.terms;
  return <><Hero eyebrow={c.ui.draft} title={title} description={c.ui.legalNotice} crumbs={crumbs(title, privacy ? "/privacy-policy" : "/terms")} /><div className="container detail-content"><aside className="notice"><strong>{c.ui.draft}</strong><p>{c.ui.legalNotice}</p></aside><MarkdownContent>{document.bodyMarkdown.replaceAll("[COMPANY NAME]", company.name).replaceAll("[EMAIL]", company.email)}</MarkdownContent></div></>;
}
