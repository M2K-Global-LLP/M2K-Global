import type { ReactNode } from "react";
import { copy } from "../lib/content.js";
export const crumbs = (label: string, href: string, title?: string, detailHref?: string) => [{ label: copy.ui.home, href: "/" }, { label, href }, ...(title ? [{ label: title, href: detailHref ?? href }] : [])];
export function Block({ title, children }: { title: string; children: ReactNode }) { return <section className="detail-block"><h2>{title}</h2>{children}</section>; }
export function Items({ items }: { items: string[] }) { return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>; }
