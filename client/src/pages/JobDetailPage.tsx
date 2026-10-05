import { ApplicationForm } from "../components/forms/ApplicationForm.js";
import { publicContent } from "../generated/public-content.js";
import { roleIsOpen } from "../lib/seo/job-posting.js";
import { collections as c } from "../lib/content.js";
import type { Job } from "../schemas/content.schema.js";
import { Hero } from "../components/sections/Hero.js";
import { Button } from "../components/ui/Button.js";
import { MarkdownContent } from "../components/content/MarkdownContent.js";
import { crumbs, Block, Items } from "./collection-shared.js";
export function JobDetailPage({ job }: { job: Job }) {
  const open = roleIsOpen(job);
  return <><Hero eyebrow={c.ui.careers} title={job.title} description={job.summary} crumbs={crumbs(c.ui.careers, "/careers", job.title, "/careers/" + job.slug)} {...(open ? { primary: { label: c.ui.apply, href: "#apply" } } : {})} /><div className="container detail-content">{!open ? <aside className="notice"><h2>{c.ui.closedTitle}</h2><p>{c.ui.closedBody}</p><Button href="/careers" variant="text">{c.ui.currentRoles}</Button></aside> : null}<dl className="role-facts">{[[c.ui.location, job.location], [c.ui.mode, c.workModes[job.workMode]], [c.ui.type, c.employmentTypes[job.employmentType]], [c.ui.closingDate, job.closesAt ?? c.ui.noClosingDate]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><Block title={c.ui.roleOverview}><MarkdownContent>{job.descriptionMarkdown}</MarkdownContent></Block><Block title={c.ui.responsibilities}><Items items={job.responsibilities} /></Block><Block title={c.ui.requirements}><Items items={job.requirements} /></Block>{open ? <section id="apply" className="notice application-slot" aria-labelledby="apply-heading"><h2 id="apply-heading">{publicContent.forms.ui.applyHeading}</h2><p>{publicContent.forms.ui.applyBody}</p><ApplicationForm key={job.slug} jobSlug={job.slug} /></section> : null}</div></>;
}
