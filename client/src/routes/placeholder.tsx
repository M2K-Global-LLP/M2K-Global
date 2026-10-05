import { useLocation, type MetaFunction } from "react-router";
import { routeManifest } from "../generated/route-manifest.js";
import { seoHead } from "../lib/seo/SeoHead.js";
function pageFor(pathname: string) {
  return routeManifest.find((page) => page.path === pathname) ?? routeManifest.find((page) => page.path === "/404")!;
}
export const meta: MetaFunction = ({ location }) => seoHead(pageFor(location.pathname));
export default function PlaceholderRoute() {
  const page = pageFor(useLocation().pathname);
  return <div className="container placeholder-page"><h1>{page.h1}</h1>{page.path === "/tender-saar" ? <div id="pricing" /> : null}</div>;
}

