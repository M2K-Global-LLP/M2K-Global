import { AboutPage } from "../pages/AboutPage.js";
import type { MetaFunction } from "react-router";
import { coreMeta } from "../lib/seo/route-meta.js";
export const meta: MetaFunction = ({ location }) => coreMeta(location.pathname);
export default function Route() {  return <AboutPage />; }
