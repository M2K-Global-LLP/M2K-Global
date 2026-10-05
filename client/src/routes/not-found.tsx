import { NotFoundPage } from "../pages/NotFoundPage.js";
import type { MetaFunction } from "react-router";
import { routeManifest } from "../generated/route-manifest.js";
import { seoHead } from "../lib/seo/SeoHead.js";
const page = routeManifest.find((page) => page.path === "/404")!;
export const meta: MetaFunction = () => seoHead(page);
export default function NotFoundRoute() {
  return <NotFoundPage />;
}

