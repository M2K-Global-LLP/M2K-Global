import { LegalPage } from "../pages/LegalPage.js";
import { useLocation } from "react-router";
export { meta } from "../lib/seo/collection-meta.js";
export default function Route() { const { pathname } = useLocation(); return <LegalPage privacy={pathname === "/privacy-policy"} />; }
