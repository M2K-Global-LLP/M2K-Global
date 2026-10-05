import { route, type RouteConfig } from "@react-router/dev/routes";
import { routeManifest } from "./generated/route-manifest.js";
const detailPrefixes = ["/projects/", "/insights/", "/careers/"];
const templates: Record<string, string> = { "/": "HomePage", "/about": "AboutPage", "/services": "ServicesPage", "/tender-saar": "TenderSaarPage", "/insights": "InsightsPage", "/careers": "CareersPage", "/contact": "ContactPage", "/privacy-policy": "LegalPage", "/terms": "LegalPage" };
export default [
 ...routeManifest.filter(page => !detailPrefixes.some(prefix => page.path.startsWith(prefix))).map(page => route(page.path, page.path === "/404" ? "routes/not-found.tsx" : "routes/" + (templates[page.path] ?? "ServiceDetailPage") + ".tsx", { id: "page-" + (page.path === "/" ? "home" : page.path.slice(1).replaceAll("/", "-")) })),
 route("projects/:slug", "routes/ProjectDetailPage.tsx", { id: "project-detail" }),
 route("insights/:slug", "routes/InsightDetailPage.tsx", { id: "insight-detail" }),
 route("careers/:slug", "routes/JobDetailPage.tsx", { id: "career-detail" }),
 route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
