import { ProjectDetailPage } from "../pages/ProjectDetailPage.js";
import { useLocation } from "react-router";
import { projects } from "../lib/content.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
export { meta } from "../lib/seo/collection-meta.js";
export default function Route() { const { pathname } = useLocation(); const project = projects.find(item => pathname === "/projects/" + item.slug); return project ? <ProjectDetailPage project={project} /> : <NotFoundPage />; }
