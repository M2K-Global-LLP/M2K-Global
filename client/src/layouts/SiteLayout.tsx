import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { MotionConfig } from "framer-motion";
import { Navbar } from "../components/layout/Navbar.js";
import { Footer } from "../components/layout/Footer.js";
import { copy } from "../lib/content.js";
export function SiteLayout() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    const main = document.getElementById("main-content");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!main || reduced || previousPath.current === location.pathname) { previousPath.current = location.pathname; return; }
    previousPath.current = location.pathname;
    const animation = main.animate([{ opacity: 0.86 }, { opacity: 1 }], { duration: 170, easing: "ease-out" });
    return () => animation.cancel();
  }, [location.pathname]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const reveal = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-item]"));
    const grouped = new Map<Element, HTMLElement[]>();
    for (const item of reveal.filter((node) => node.hasAttribute("data-reveal-item"))) {
      const group = item.closest("[data-reveal-group]");
      if (group) grouped.set(group, [...(grouped.get(group) ?? []), item]);
    }
    for (const items of grouped.values()) items.forEach((item, index) => item.style.setProperty("--reveal-delay", String(Math.min(index * 65, 390)) + "ms"));
    const pending: HTMLElement[] = [];
    for (const element of reveal) {
      if (element.getBoundingClientRect().top <= window.innerHeight * 0.92) element.dataset.revealState = "visible";
      else { element.dataset.revealState = "hidden"; pending.push(element); }
    }
    if (!pending.length) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        element.dataset.revealState = "visible";
        observer.unobserve(element);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
    pending.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [location.pathname, location.key]);
  useEffect(() => {
    if (!location.hash) return;
    let id: string; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, location.key]);
  return <MotionConfig reducedMotion="user"><a href="#main-content" className="skip-link">{copy.ui.skip}</a><Navbar /><main id="main-content" tabIndex={-1}><Outlet /></main><Footer /></MotionConfig>;
}

