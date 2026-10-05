import { collections as c, services } from "../lib/content.js";
import type { Project } from "../schemas/content.schema.js";
import { Hero } from "../components/sections/Hero.js";
import { CTASection } from "../components/sections/CTASection.js";
import { Button } from "../components/ui/Button.js";
import { MarkdownContent } from "../components/content/MarkdownContent.js";
import { crumbs, Block, Items } from "./collection-shared.js";
export function ProjectDetailPage({ project }: { project: Project }) {
  return <><Hero eyebrow={c.ui.projects} title={project.title} description={project.summary} crumbs={crumbs(c.ui.projects, "/projects", project.title, "/projects/" + project.slug)} /><div className="container detail-content"><Block title={c.ui.projectOverview}><p>{project.overview}</p></Block><Block title={c.ui.challenge}><p>{project.challenge}</p></Block><Block title={c.ui.scope}><Items items={project.scope} /></Block><Block title={c.ui.approach}><Items items={project.approach} /></Block><Block title={c.ui.delivered}><Items items={project.servicesDelivered} /></Block>{project.methodology ? <Block title={c.ui.methodology}><p>{project.methodology}</p></Block> : null}{project.outcomesApproved && project.outcomes?.length ? <Block title={c.ui.outcomes}><Items items={project.outcomes} /></Block> : null}{project.sections.map((section) => <Block key={section.id} title={section.heading}><MarkdownContent>{section.bodyMarkdown}</MarkdownContent></Block>)}<Block title={c.ui.relatedServices}><div className="related-links">{services.filter((service) => project.serviceSlugs.includes(service.slug)).map((service) => <Button key={service.slug} href={"/services/" + service.slug} variant="secondary">{service.title}</Button>)}</div></Block></div><CTASection /></>;
}
