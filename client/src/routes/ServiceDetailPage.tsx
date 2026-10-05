import { ServiceDetailPage } from "../pages/ServiceDetailPage.js";
import { useLocation } from "react-router";
import { services } from "../lib/content.js";
import { NotFoundPage } from "../pages/NotFoundPage.js";
import type { MetaFunction } from "react-router";
import { coreMeta } from "../lib/seo/route-meta.js";
export const meta: MetaFunction = ({ location }) => coreMeta(location.pathname);
export default function Route() { const { pathname } = useLocation(); const service = services.find(item => pathname === "/services/" + item.slug); return service ? <ServiceDetailPage service={service} /> : <NotFoundPage />; }
