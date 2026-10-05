import { ArrowRight } from "lucide-react";
import { copy, tenderSaar } from "../../lib/content.js";
export function Workflow() {
  return <ol className="workflow" data-reveal-group aria-label={copy.ui.workflowLabel}>{tenderSaar.workflow.map((step, index) => <li key={step.title} data-reveal-item>
    <div className="workflow-top"><span>{String(index + 1).padStart(2, "0")}</span>{index < tenderSaar.workflow.length - 1 ? <ArrowRight size={19} aria-hidden="true" /> : null}</div>
    <h3>{step.title}</h3><p>{step.description}</p>
  </li>)}</ol>;
}

