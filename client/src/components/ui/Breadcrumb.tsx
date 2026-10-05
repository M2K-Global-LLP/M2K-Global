import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { copy } from "../../lib/content.js";
export type Crumb = { label: string; href: string };
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return <nav aria-label={copy.ui.breadcrumb} className="breadcrumb"><ol>
    {items.map((item, index) => <li key={item.href}>{index > 0 ? <ChevronRight size={12} aria-hidden="true" /> : null}{index === items.length - 1 ? <span aria-current="page">{item.label}</span> : <Link to={item.href}>{item.label}</Link>}</li>)}
  </ol></nav>;
}

