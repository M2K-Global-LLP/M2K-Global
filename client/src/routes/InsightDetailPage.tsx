import { InsightDetailPage } from "../pages/InsightDetailPage.js";
import { useLocation } from "react-router";
import { insights } from "../lib/content.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
export { meta } from "../lib/seo/collection-meta.js";
export default function Route() { const { pathname } = useLocation(); const insight = insights.find(item => pathname === "/insights/" + item.slug); return insight ? <InsightDetailPage insight={insight} /> : <NotFoundPage />; }
