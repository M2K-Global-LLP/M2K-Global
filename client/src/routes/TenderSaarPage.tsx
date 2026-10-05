import { TenderSaarPage } from "../pages/TenderSaarPage.js";
import type { MetaFunction } from "react-router";
import { coreMeta } from "../lib/seo/route-meta.js";
export const meta: MetaFunction = ({ location }) => coreMeta(location.pathname);
export default function Route() {  return <TenderSaarPage />; }
