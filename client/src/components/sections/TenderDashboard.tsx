import { useId, useState } from "react";
import { Search, ArrowUpRight, Layers, Building2, CalendarDays, MapPin, IndianRupee, ListChecks } from "lucide-react";
import { copy, samples } from "../../lib/content.js";
export function TenderDashboard({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const filtered = samples.filter((item) => (item.title + " " + item.category).toLowerCase().includes(query.toLowerCase().trim()));
  return <div className={"dashboard " + (compact ? "dashboard-compact" : "")} aria-label={copy.ui.mockupLabel}>
    <div className="browser-bar"><div className="browser-dots" aria-hidden="true"><i /><i /><i /></div><span>{copy.ui.mockupAddress}</span><span className="sample-badge">{copy.ui.sampleBadge}</span></div>
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar" aria-hidden="true"><div className="dashboard-brand"><Layers size={22} />{copy.ui.productName}</div><span className="dashboard-nav-label">{copy.ui.sampleSection}</span><div className="dashboard-nav-item"><Search size={17} />{copy.ui.sampleNav}</div><div className="dashboard-profile"><span>{copy.ui.sampleProfile}</span><strong>{copy.ui.sampleProfileValue}</strong></div></aside>
      <div className="dashboard-main"><div className="dashboard-heading"><div><p className="eyebrow">{copy.ui.sampleWorkspace}</p><h3>{copy.ui.sampleResults}</h3></div><span className="sample-label">{copy.ui.sampleBadge}</span></div>
        <label className="sample-search" htmlFor={inputId}><Search size={18} aria-hidden="true" /><span className="sr-only">{copy.ui.sampleSearch}</span><input id={inputId} type="search" value={query} placeholder={copy.ui.samplePlaceholder} onChange={(event) => setQuery(event.target.value)} /></label>
        <div className="sample-tenders" aria-live="polite">{filtered.length ? filtered.map((tender) => <article className="sample-tender" key={tender.id}>
          <div className="sample-tender-header"><span className="category-tag">{tender.category}</span><span className="sample-label">{copy.ui.sampleBadge}</span></div>
          <h4>{tender.title}</h4><dl className="tender-meta">
            <div><dt><Building2 size={13} aria-hidden="true" />{copy.ui.department}</dt><dd>{tender.department}</dd></div>
            <div><dt><CalendarDays size={13} aria-hidden="true" />{copy.ui.deadline}</dt><dd>{tender.deadline}</dd></div>
            <div><dt><MapPin size={13} aria-hidden="true" />{copy.ui.location}</dt><dd>{tender.location}</dd></div>
            <div><dt><IndianRupee size={13} aria-hidden="true" />{copy.ui.value}</dt><dd>{tender.value}</dd></div>
          </dl><p className="tender-summary">{tender.summary}</p>
          <div className="tender-guidance"><ListChecks size={17} aria-hidden="true" /><div><strong className="bid-guidance-badge">{copy.ui.guidance}</strong><p>{tender.guidance}</p></div></div>
          <a href={tender.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-link">{copy.ui.officialSource}<ArrowUpRight size={14} aria-hidden="true" /></a>
        </article>) : <div className="sample-no-results"><p>{copy.ui.noSampleResults}</p><button type="button" onClick={() => setQuery("")}>{copy.ui.clearSearch}</button></div>}</div>
      </div>
    </div><p className="sample-notice">{copy.ui.sampleNotice}</p>
  </div>;
}

