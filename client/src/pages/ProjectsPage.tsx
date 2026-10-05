import { collections as c, copy, projects } from "../lib/content.js";
import type { Project } from "../schemas/content.schema.js";
import { Hero } from "../components/sections/Hero.js";
import { CTASection } from "../components/sections/CTASection.js";
import { EmptyState } from "../components/content/EmptyState.js";
import { FilterBar, useContentFilter } from "../components/content/FilterBar.js";
import { ProjectCard } from "../components/cards/ProjectCard.js";
import { crumbs } from "./collection-shared.js";
export function ProjectsPage() {
  const filter = useContentFilter("category", c.categories);
  const category = c.categories.find((item) => item.id === filter.value);
  const matches = (project: Project) => !category || project.serviceSlugs.some((slug) => category.serviceSlugs.includes(slug));
  return <><Hero {...c.projectsHero} crumbs={crumbs(c.ui.projects, "/projects")} /><section className="section" data-reveal><div className="container"><h2 className="sr-only">{c.ui.projects}</h2><FilterBar label={c.ui.projectFilter} all={c.ui.all} options={c.categories} {...filter} /><p className="result-count" role="status">{c.ui.results} {projects.filter(matches).length}</p>{projects.length ? <div className="editorial-grid" data-reveal-group>{projects.map((project) => <div key={project.slug} hidden={!matches(project)}><ProjectCard project={project} /></div>)}</div> : <EmptyState title={copy.ui.projectsEmptyTitle} description={copy.ui.projectsEmptyBody} href="/contact" label={c.ui.contact} />}{projects.length > 0 && !projects.some(matches) ? <EmptyState title={c.ui.noCategoryTitle} description={c.ui.noCategoryBody} href="/contact" label={c.ui.contact} /> : null}</div></section><CTASection /></>;
}
