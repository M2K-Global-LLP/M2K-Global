import { ArrowUpRight } from "lucide-react";
import { copy } from "../../lib/content.js";
export function AbstractVisual({ compact = false }: { compact?: boolean }) {
  return <div className={"abstract-visual " + (compact ? "abstract-compact" : "")} aria-hidden="true">
    <img src="/placeholders/connected-progress.svg" alt="" fetchPriority="high" width="560" height="500" />
    {copy.visualLabels.map((label, index) => <span key={label} className={"visual-label visual-label-" + index}><span className="visual-dot" />{label}<ArrowUpRight size={14} /></span>)}
    <span className="visual-caption">{copy.ui.footerNote}</span>
  </div>;
}

