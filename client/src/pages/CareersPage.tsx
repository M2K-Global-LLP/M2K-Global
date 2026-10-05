import { roleIsOpen } from "../lib/seo/job-posting.js";
import { collections as c, careers } from "../lib/content.js";
import { Hero } from "../components/sections/Hero.js";
import { Button } from "../components/ui/Button.js";
import { EmptyState } from "../components/content/EmptyState.js";
import { crumbs } from "./collection-shared.js";
export function CareersPage() {
  const open = careers.filter((job) => roleIsOpen(job));
  return <><Hero {...c.careersHero} crumbs={crumbs(c.ui.careers, "/careers")} /><section className="section"><div className="container"><h2>{c.ui.whyCareers}</h2><p className="section-intro">{c.ui.whyCareersBody}</p><div className="editorial-grid">{c.careerPrinciples.map((item) => <article className="editorial-card" key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div></section><section className="section section-muted"><div className="container"><h2>{c.ui.openRoles}</h2>{open.length ? <div className="editorial-grid">{open.map((job) => <article className="editorial-card" key={job.slug}><h3>{job.title}</h3><p>{job.summary}</p><p>{job.location} · {c.workModes[job.workMode]} · {c.employmentTypes[job.employmentType]}</p><Button href={"/careers/" + job.slug}>{c.ui.viewRole}</Button></article>)}</div> : <EmptyState title={c.ui.noRoles} description={c.ui.noRolesBody} href="/contact" label={c.ui.contact} />}</div></section></>;
}
