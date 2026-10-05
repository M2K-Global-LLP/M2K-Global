import { JobDetailPage } from "../pages/JobDetailPage.js";
import { useLocation } from "react-router";
import { careers } from "../lib/content.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
export { meta } from "../lib/seo/collection-meta.js";
export default function Route() { const { pathname } = useLocation(); const job = careers.find(item => pathname === "/careers/" + item.slug); return job ? <JobDetailPage job={job} /> : <NotFoundPage />; }
