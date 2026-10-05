import type { Project } from "../../schemas/content.schema.js";
import { collections, services } from "../../lib/content.js";
import { Button } from "../ui/Button.js";
export function ProjectCard({ project }: { project: Project }) {
  const metric = project.approved && project.outcomesApproved ? project.outcomeMetrics?.[0] : undefined;
  return <article className="editorial-card project-card" data-reveal-item><div className="card-kicker">{services.filter((service) => project.serviceSlugs.includes(service.slug)).map((service) => service.title).join(" / ")}</div><h3>{project.title}</h3>{metric ? <div className="project-metric"><span className="project-metric-value">{metric.value}</span><span className="project-metric-label">{metric.label}</span></div> : null}<p>{project.summary}</p><Button href={"/projects/" + project.slug} variant="text">{collections.ui.readProject}</Button></article>;
}
