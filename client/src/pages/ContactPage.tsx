import { publicContent } from "../generated/public-content.js";
import { company, copy } from "../lib/content.js";
import { Hero } from "../components/sections/Hero.js";
import { ContactForm } from "../components/forms/ContactForm.js";
export function ContactPage() {
  const form = publicContent.forms;
  return <><Hero {...form.contactHero} crumbs={[{ label: copy.ui.home, href: "/" }, { label: form.contactHero.title, href: "/contact" }]} /><section className="section"><div className="container contact-layout"><aside className="contact-details"><h2>{form.ui.contactDetails}</h2><p>{company.name}</p><a href={"mailto:" + company.email}>{company.email}</a><a href={"tel:" + company.phone.replace(/[^+\d]/g, "")}>{company.phone}</a><p>{company.address}</p></aside><div><h2>{form.ui.contactHeading}</h2><ContactForm /></div></div></section></>;
}
