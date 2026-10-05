import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { company, copy, nav, services } from "../../lib/content.js";
import { Button } from "../ui/Button.js";
function moveNavGlow(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--nav-glow-x", ((event.clientX - bounds.left) / bounds.width * 100) + "%");
  event.currentTarget.style.setProperty("--nav-glow-y", ((event.clientY - bounds.top) / bounds.height * 100) + "%");
}
function resetNavGlow(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--nav-glow-x", "50%");
  event.currentTarget.style.setProperty("--nav-glow-y", "50%");
}
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdown = useRef<HTMLDivElement>(null);
  const serviceButton = useRef<HTMLButtonElement>(null);
  const serviceLinks = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const location = useLocation();
  useEffect(() => {
    let previousY = window.scrollY;
    let direction = 0;
    let accumulated = 0;
    const update = () => {
      const currentY = window.scrollY;
      const delta = currentY - previousY;
      setScrolled(currentY > 24);
      if (currentY <= 24) {
        setHiddenOnScroll(false);
        direction = 0;
        accumulated = 0;
      } else {
        const nextDirection = Math.sign(delta);
        if (nextDirection !== 0) {
          if (nextDirection !== direction) accumulated = 0;
          direction = nextDirection;
          accumulated += Math.abs(delta);
          if (accumulated >= 40) { if (nextDirection > 0 && document.querySelector(".site-header")?.contains(document.activeElement)) (document.activeElement as HTMLElement).blur(); setHiddenOnScroll(nextDirection > 0); }
        }
      }
      previousY = currentY;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => { if (!dropdown.current?.contains(event.target as Node)) setExpanded(false); };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [mobileOpen]);
  function closeMobile(restoreFocus = true) {
    dialog.current?.close(); setMobileOpen(false);
    if (restoreFocus) menuButton.current?.focus();
  }
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1200px)");
    const resize = () => { if (query.matches) { dialog.current?.close(); setMobileOpen(false); } };
    query.addEventListener("change", resize);
    return () => query.removeEventListener("change", resize);
  }, []);
  function focusService(index: number) {
    requestAnimationFrame(() => { const links = serviceLinks.current?.querySelectorAll<HTMLAnchorElement>("a"); links?.[index < 0 ? links.length - 1 : index]?.focus(); });
  }
  function triggerKeys(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setExpanded(true); focusService(event.key === "ArrowUp" ? -1 : 0); }
    if (event.key === "Escape") { setExpanded(false); serviceButton.current?.focus(); }
  }
  function dropdownKeys(event: KeyboardEvent<HTMLDivElement>) {
    const links = Array.from(serviceLinks.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "Escape") { event.preventDefault(); setExpanded(false); serviceButton.current?.focus(); }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
      links[next]?.focus();
    }
  }
  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = Array.from(dialog.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary, [tabindex="0"]') ?? []).filter((element) => element.getClientRects().length > 0);
    const first = controls[0]; const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return <header className={"site-header " + (location.pathname === "/" ? "is-home " : "") + (scrolled ? "is-scrolled " : "") + (hiddenOnScroll ? "is-hidden" : "")}>
    <div className="container header-inner">
      <Link to="/" className="brand" aria-label={company.name + " " + copy.ui.brandDescriptor + " — " + copy.ui.home}>{company.logo ? <img className="brand-logo" src={company.logo.src} alt="" width="42" height="42" /> : <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>}<span className="brand-wordmark">{company.name}<small>{copy.ui.brandDescriptor}</small></span></Link>
      <nav className="desktop-nav" aria-label={copy.ui.primaryNavigation}>
        {nav.filter((item) => item.href !== "/contact").map((item) => item.href === "/services" ? <div className="services-disclosure" ref={dropdown} key={item.href} onMouseEnter={() => setExpanded(true)} onMouseLeave={() => { if (!dropdown.current?.contains(document.activeElement)) setExpanded(false); }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setExpanded(false); }}>
          <button ref={serviceButton} className={"nav-link nav-glow " + (location.pathname.startsWith("/services") ? "active" : "")} onPointerMove={moveNavGlow} onPointerLeave={resetNavGlow} type="button" aria-expanded={expanded} aria-controls="services-dropdown" onClick={() => setExpanded(!expanded)} onKeyDown={triggerKeys}>{item.label}<ChevronDown size={13} aria-hidden="true" /></button>
          <div ref={serviceLinks} className={"services-dropdown" + (expanded ? " is-open" : "")} id="services-dropdown" aria-hidden={!expanded} inert={!expanded} onKeyDown={dropdownKeys}>{services.map((service) => <NavLink key={service.slug} to={"/services/" + service.slug} className="nav-glow" onPointerMove={moveNavGlow} onPointerLeave={resetNavGlow} onClick={() => setExpanded(false)}>{service.title}<ArrowUpRight size={15} aria-hidden="true" /></NavLink>)}</div>
        </div> : <NavLink className="nav-link nav-glow" onPointerMove={moveNavGlow} onPointerLeave={resetNavGlow} key={item.href} to={item.href} end={item.href === "/"}>{item.label}</NavLink>)}
      </nav>
      <div className="header-actions"><Button href="/contact" className="header-cta nav-glow" onPointerMove={moveNavGlow} onPointerLeave={resetNavGlow}>{copy.ui.talk}</Button><button type="button" ref={menuButton} className="menu-toggle" aria-label={copy.ui.openMenu} aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => { dialog.current?.showModal(); setMobileOpen(true); }}>{<Menu size={24} aria-hidden="true" />}</button></div>
    </div>
    <dialog id="mobile-menu" className="mobile-menu" ref={dialog} aria-label={copy.ui.menuTitle} onCancel={(event) => { event.preventDefault(); closeMobile(); }} onKeyDown={trapFocus} onClick={(event) => { if (event.target === event.currentTarget) closeMobile(); }}>
      <div className="mobile-panel"><div className="mobile-menu-top"><span className="eyebrow">{copy.ui.menuTitle}</span><button type="button" className="icon-button" aria-label={copy.ui.closeMenu} onClick={() => closeMobile()}><X aria-hidden="true" size={24} /></button></div>
        <nav aria-label={copy.ui.primaryNavigation}>{nav.map((item) => item.href === "/services" ? <details key={item.href}><summary className="nav-glow" onPointerMove={moveNavGlow} onPointerLeave={resetNavGlow}>{item.label}<ChevronDown size={18} aria-hidden="true" /></summary><Link to="/services" className="nav-glow" onPointerMove={moveNavGlow} onPointerLeave={resetNavGlow} onClick={() => closeMobile(false)}>{copy.ui.allServices}</Link>{services.map((service) => <NavLink to={"/services/" + service.slug} key={service.slug} className="nav-glow" onPointerMove={moveNavGlow} onPointerLeave={resetNavGlow} onClick={() => closeMobile(false)}>{service.title}</NavLink>)}</details> : <NavLink key={item.href} to={item.href} end={item.href === "/"} className="nav-glow" onPointerMove={moveNavGlow} onPointerLeave={resetNavGlow} onClick={() => closeMobile(false)}>{item.label}</NavLink>)}</nav>
        <Button href="/contact" onClick={() => closeMobile(false)}>{copy.ui.talk}</Button>
      </div>
    </dialog>
  </header>;
}

