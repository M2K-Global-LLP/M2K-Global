import { Links, Meta, Scripts, ScrollRestoration } from "react-router";
import type { ReactNode } from "react";
import "./styles/globals.css";
import { SiteLayout } from "./layouts/SiteLayout.js";
export function Layout({ children }: { children: ReactNode }) {
  return <html lang="en"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><link rel="icon" type="image/webp" href="/images/brand/m2k-global-logo.webp" /><link rel="apple-touch-icon" href="/images/brand/m2k-global-logo.png" /><Meta /><Links /></head><body>{children}<ScrollRestoration /><Scripts /></body></html>;
}
export default function App() { return <SiteLayout />; }

