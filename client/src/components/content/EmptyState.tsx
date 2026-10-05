import { ArrowUpRight, FileText } from "lucide-react";
import { Link } from "react-router";
export function EmptyState({ title, description, href, label }: { title: string; description: string; href: string; label: string }) {
  return <div className="empty-state"><span className="empty-icon"><FileText size={27} strokeWidth={1.4} aria-hidden="true" /></span><div><h3>{title}</h3><p>{description}</p></div><Link to={href} className="text-link" data-cta>{label}<ArrowUpRight size={17} aria-hidden="true" /></Link></div>;
}

