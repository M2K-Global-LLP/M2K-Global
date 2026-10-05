import { collections as c } from "../lib/content.js";
import { Hero } from "../components/sections/Hero.js";
import { Button } from "../components/ui/Button.js";
export function NotFoundPage() {
  return <><Hero eyebrow={c.ui.notFoundEyebrow} title={c.ui.notFoundTitle} description={c.ui.notFoundBody} primary={{ label: c.ui.returnHome, href: "/" }} secondary={{ label: c.ui.exploreServices, href: "/services" }} /><section className="section"><div className="container"><h2>{c.ui.helpfulLinks}</h2><div className="related-links"><Button href="/insights" variant="secondary">{c.ui.insights}</Button><Button href="/contact" variant="text">{c.ui.notFoundContact}</Button></div></div></section></>;
}
