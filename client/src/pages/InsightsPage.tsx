import { collections as c, insights } from "../lib/content.js";
import type { Insight } from "../schemas/content.schema.js";
import { Hero } from "../components/sections/Hero.js";
import { CTASection } from "../components/sections/CTASection.js";
import { EmptyState } from "../components/content/EmptyState.js";
import { FilterBar, useContentFilter } from "../components/content/FilterBar.js";
import { InsightCard } from "../components/cards/InsightCard.js";
import { crumbs } from "./collection-shared.js";
export function InsightsPage() {
  const tags = [...new Set(insights.flatMap((item) => item.tags))].sort().map((tag) => ({ id: tag, label: tag }));
  const filter = useContentFilter("tag", tags);
  const matches = (item: Insight) => !filter.value || item.tags.includes(filter.value);
  return <><Hero {...c.insightsHero} crumbs={crumbs(c.ui.insights, "/insights")} /><section className="section" data-reveal><div className="container"><h2 className="sr-only">{c.ui.insights}</h2><FilterBar label={c.ui.tagFilter} all={c.ui.all} options={tags} {...filter} /><p className="result-count" role="status">{c.ui.results} {insights.filter(matches).length}</p>{insights.length ? <div className="editorial-grid" data-reveal-group>{insights.map((insight) => <div key={insight.slug} hidden={!matches(insight)}><InsightCard insight={insight} /></div>)}</div> : <EmptyState title={c.ui.noArticlesTitle} description={c.ui.noArticlesBody} href="/contact" label={c.ui.contact} />}</div></section><CTASection /></>;
}
