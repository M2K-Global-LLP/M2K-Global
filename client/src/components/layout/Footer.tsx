import { Link } from "react-router";
import { ArrowUpRight, MapPin, Mail, Phone } from "lucide-react";
import { company, copy } from "../../lib/content.js";
import { urls } from "../../lib/urls.js";
const legalPaths = new Set(["/privacy-policy", "/terms"]);
const socialIconByLabel = { LinkedIn: "linkedin", Instagram: "instagram", Twitter: "twitter" } as const;
type SocialIconName = (typeof socialIconByLabel)[keyof typeof socialIconByLabel];

function SocialIcon({ name }: { name: SocialIconName }) {
  if (name === "linkedin") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" /></svg>;
  if (name === "instagram") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.95 4.57a10 10 0 0 1-2.82.78 4.93 4.93 0 0 0 2.16-2.73 9.9 9.9 0 0 1-3.13 1.2 4.92 4.92 0 0 0-8.38 4.48A13.98 13.98 0 0 1 1.64 3.16a4.92 4.92 0 0 0 1.52 6.56A4.9 4.9 0 0 1 .96 9.1v.07a4.92 4.92 0 0 0 3.95 4.82 4.9 4.9 0 0 1-2.22.08 4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 19.54a13.94 13.94 0 0 0 7.55 2.21c9.06 0 14.01-7.5 14.01-14.01v-.64A10 10 0 0 0 24 4.59Z" /></svg>;
}

export function Footer() {
  const legalLinks = copy.footerGroups.flatMap((group) => group.links).filter((link) => legalPaths.has(link.href));
  return <footer className="site-footer"><div className="container">
    <div className="footer-top"><div><Link to="/" className="footer-brand" aria-label={company.name}>{company.logo ? <img className="footer-brand-logo" src={company.logo.src} alt="" width="44" height="44" /> : null}<span>{company.name}</span></Link><p>{copy.ui.footerNote}</p></div><p className="footer-positioning">{company.positioning}</p></div>
    <nav className="footer-grid" aria-label={copy.ui.footerNavigation}>{copy.footerGroups.map((group) => <div key={group.title}><h2>{group.title}</h2><ul>{group.links.filter((link) => !legalPaths.has(link.href)).map((link) => <li key={link.href}><Link to={link.href}>{link.label}</Link></li>)}{group.title === copy.ui.productName && urls.tenderSaarApp ? <li><a href={urls.tenderSaarApp} target="_blank" rel="noopener noreferrer">{copy.ui.login}<ArrowUpRight size={14} aria-hidden="true" /></a></li> : null}</ul></div>)}</nav>
    <Link className="footer-cta-line" to="/contact">What can we help you achieve?<ArrowUpRight size={18} aria-hidden="true" /></Link>
    {company.socialLinks?.length ? <nav className="footer-social" aria-label="Social media">{company.socialLinks.filter((social) => social.label in socialIconByLabel).map((social) => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} title={social.label}><SocialIcon name={socialIconByLabel[social.label as keyof typeof socialIconByLabel]} /></a>)}</nav> : null}
    <div className="footer-contact"><span><Mail size={16} aria-hidden="true" />{company.email.includes("[") ? company.email : <a href={"mailto:" + company.email}>{company.email}</a>}</span><span><Phone size={16} aria-hidden="true" />{company.phone.includes("[") ? company.phone : <a href={"tel:" + company.phone.replace(/[^+\d]/g, "")}>{company.phone}</a>}</span><span><MapPin size={16} aria-hidden="true" />{company.address}</span></div>
    <div className="footer-bottom"><p>© {company.name}. {copy.ui.footerCopyright}</p><nav className="footer-legal" aria-label="Legal links">{legalLinks.map((link) => <Link key={link.href} to={link.href}>{link.label}</Link>)}</nav><p>{copy.ui.footerDisclaimer}</p></div>
  </div></footer>;
}
